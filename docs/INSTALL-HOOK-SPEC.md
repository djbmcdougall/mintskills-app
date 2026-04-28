# MintSkills — `install_skill` Licence-Gated Install Hook

> **Status:** Draft spec, 10 April 2026. One-page technical brief covering the highest-risk unknown in the MCP MVP scope. Owner: David. Reviewer: Alain (when on-boarded) for the security and key-handling sections.

## 1. What this spec covers

The `install_skill` MCP tool is the single most security-sensitive surface in MintSkills. It has to do four things atomically and verifiably:

1. Confirm the authenticated caller has a valid, non-refunded purchase of the requested listing
2. Deliver the skill files to the buyer's local filesystem
3. Write a tamper-evident licence receipt that proves the install was legitimate
4. Enforce the 48-hour refund window without leaving the buyer with a working skill if they refund

Everything else in the MCP server is discovery or account management and carries standard web-app risk. `install_skill` is the money path.

## 2. Threat model

What we are defending against, in rough priority order:

- **Licence sharing.** Buyer A purchases, extracts files, passes them to Buyer B.
- **Refund-and-keep.** Buyer purchases, installs, refunds within 48h, keeps working copy.
- **MCP client spoofing.** Malicious MCP client calls `install_skill` with a valid OAuth token scraped from elsewhere.
- **Replay.** Attacker captures a legitimate install response and replays it on a different machine.
- **Server compromise.** Attacker gains read access to the skills storage bucket and exfiltrates paid content.
- **Creator-side attack.** Creator publishes malicious skill to harvest buyer environments. Out of scope for this spec — handled by Mint Verified.

## 3. Install flow (happy path)

```
Buyer agent                      MCP server                    Storage
  │                                 │                              │
  │  install_skill(listing_id,      │                              │
  │     repo_context, accept=true)  │                              │
  ├────────────────────────────────>│                              │
  │                                 │  check purchases table       │
  │                                 │  verify 48h window position  │
  │                                 │  generate install_token      │
  │                                 │  (signed, 5 min TTL)         │
  │                                 │                              │
  │                                 │  request pre-signed URL ────>│
  │                                 │<──────────────── signed URL  │
  │                                 │                              │
  │<──────── install_manifest ──────│                              │
  │          + signed_url           │                              │
  │          + licence_receipt      │                              │
  │                                 │                              │
  │  fetch skill bundle (tar.gz) ──────────────────────────────────>│
  │<──────────────────────────────────────────── encrypted bundle  │
  │                                                                │
  │  decrypt with per-install key from manifest                    │
  │  verify SHA-256 against manifest                               │
  │  write to .claude/skills/<slug>/                               │
  │  write licence_receipt to .mintskills/receipts/<id>.json       │
```

Not-in-browser. Everything from manifest onward runs in the CLI process on the buyer's machine, not in the MCP host.

## 4. The licence receipt

Written to `.mintskills/receipts/<purchase_id>.json`. Signed with a platform Ed25519 key. The public key ships in the CLI binary so receipts can be verified offline.

```json
{
  "version": 1,
  "purchase_id": "pur_01HXYZ...",
  "listing_id": "lst_01HABC...",
  "listing_slug": "invoice-parser-pro",
  "listing_version": "1.4.2",
  "buyer_id": "usr_01HDEF...",
  "buyer_email_hash": "sha256:...",
  "host": "claude-code",
  "installed_at": "2026-04-10T14:22:00Z",
  "refund_window_closes_at": "2026-04-12T14:22:00Z",
  "content_hash": "sha256:...",
  "bundle_key_hash": "sha256:...",
  "signature": "ed25519:..."
}
```

The receipt is human-readable (auditable) and machine-verifiable (enforceable). It is written before the skill files are made executable, so a crashed install leaves no orphan skill without a receipt.

## 5. Per-install encryption (optional, V1.5)

For MVP, bundles are served from private Supabase Storage via short-lived pre-signed URLs. This is sufficient for licence-sharing deterrence against casual attackers but does not prevent a determined buyer from re-hosting the decrypted tar.gz.

For V1.5 (not in the 8-week sprint, but the architecture should not preclude it):

- Each listing is encrypted at rest with a listing-level AES-256 key held in Supabase Vault
- On install, the server derives a per-install key = HKDF(listing_key, purchase_id, buyer_id)
- The per-install key is included in the signed install manifest and discarded server-side after 5 minutes
- Decryption happens client-side in the CLI
- A leaked bundle is watermarked with the `purchase_id` via the derivation, so re-hosted copies trace back to the original buyer

This is a meaningful deterrent. It is not DRM — a sophisticated attacker can always decrypt and strip the watermark — but it raises the cost of licence sharing from "copy a zip" to "reverse-engineer per-install key derivation, then strip watermarks."

## 6. Refund enforcement

The 48-hour refund window is the trickiest piece. Options considered:

1. **Time-bomb the skill** — skill refuses to run 48h after install unless the CLI periodically phones home to confirm non-refunded status. **Rejected:** breaks offline use, adds a dependency the buyer did not sign up for, feels hostile.
2. **Receipt revocation list** — CLI checks a signed revocation list on startup. **Rejected:** same offline problem, and still fails against a buyer who simply removes the check.
3. **Honour system with reputation consequences** — refunded skills remain installed but the buyer's account is flagged if they repeatedly refund then retain usage. **Chosen for MVP.** Simple, offline-safe, and aligns with how every other software marketplace handles this. The 20% platform fee includes the cost of a small fraction of buyers gaming the refund window. Repeat offenders get their accounts suspended.

This is the right call for a marketplace of professional creators and professional buyers. DRM-heavy enforcement would destroy the developer-experience advantage the MCP install path creates in the first place.

## 7. Token and key handling

- **OAuth access tokens** — stored by the MCP host (Claude Code, Cursor, etc.), never by the CLI. 1-hour TTL, refreshable.
- **Install tokens** — short-lived (5 min), signed by the MintSkills backend, single-use, scoped to `{purchase_id, buyer_id, ip_address_hash}`. IP binding is soft — we log mismatches rather than reject them, because buyers behind corporate proxies will see IP changes mid-flow.
- **Platform signing key** (Ed25519, for licence receipts) — held in Supabase Vault, rotated annually, public key shipped in CLI binary with a version number. Old public keys retained so receipts signed before a rotation remain verifiable.
- **Listing encryption keys** (V1.5) — held in Supabase Vault, one per listing, never logged, never returned to any client.

## 8. Server-side verification on `install_skill`

Pseudo-code for the MCP tool handler. This is the critical path — get it right.

```typescript
async function installSkill(input, ctx) {
  const { listing_id, repo_context, accept_licence } = input;
  const user = ctx.authenticatedUser;

  if (!accept_licence) {
    throw new ToolError("licence_not_accepted");
  }

  // 1. Verify purchase exists, is completed, and has not been refunded
  const purchase = await db.purchases.findOne({
    buyer_id: user.id,
    listing_id,
    status: "completed",
  });
  if (!purchase) {
    throw new ToolError("no_valid_purchase");
  }

  // 2. Fetch listing (must be verified and not suspended)
  const listing = await db.listings.findOne({ id: listing_id });
  if (listing.status !== "verified") {
    throw new ToolError("listing_not_available");
  }

  // 3. Check for host-level conflicts using repo_context
  const conflicts = await detectConflicts(repo_context, listing);
  if (conflicts.blocking.length > 0) {
    return {
      status: "conflict",
      conflicts: conflicts.blocking,
    };
  }

  // 4. Generate pre-signed URL (5 min TTL)
  const bundleUrl = await storage.createSignedUrl(
    listing.bundle_path,
    { expiresIn: 300 }
  );

  // 5. Generate and sign the licence receipt
  const receipt = {
    version: 1,
    purchase_id: purchase.id,
    listing_id,
    listing_slug: listing.slug,
    listing_version: listing.current_version,
    buyer_id: user.id,
    buyer_email_hash: sha256(user.email),
    host: repo_context.host,
    installed_at: new Date().toISOString(),
    refund_window_closes_at: addHours(purchase.created_at, 48).toISOString(),
    content_hash: listing.content_hash,
    bundle_key_hash: null, // populated in V1.5
  };
  receipt.signature = await sign(receipt, PLATFORM_SIGNING_KEY);

  // 6. Audit log — every install recorded for fraud analysis
  await db.installs.insert({
    purchase_id: purchase.id,
    host: repo_context.host,
    repo_context_hash: sha256(JSON.stringify(repo_context)),
    installed_at: receipt.installed_at,
  });

  return {
    status: "ok",
    install_manifest: {
      bundle_url: bundleUrl,
      content_hash: listing.content_hash,
      target_path: `.claude/skills/${listing.slug}/`,
      licence_receipt: receipt,
    },
  };
}
```

## 9. What ships in MVP vs V1.5

**MVP (8-week sprint):**
- Pre-signed URL delivery from private Supabase Storage
- Signed licence receipts written to `.mintskills/receipts/`
- Honour-system refund enforcement with repeat-offender account flagging
- Audit log of every install with `repo_context_hash` for fraud analysis
- Server-side `install_skill` handler with the verification flow above
- CLI-side verification of manifest `content_hash` against downloaded bundle

**V1.5 (fast-follow, weeks 9–12):**
- Per-install key derivation and encrypted bundles
- Purchase-bound watermarking
- Fraud-analysis job over the install audit log

**Explicitly not doing, ever:**
- Phone-home DRM
- Time-bombed skills
- Hardware fingerprinting

## 10. Open questions for Alain

1. Is Supabase Vault acceptable for the platform signing key, or do we need a dedicated HSM or cloud KMS? My assumption is Supabase Vault for MVP, migrate to AWS KMS or GCP Cloud KMS if Mint Verified enterprise tier demands it.
2. Is Ed25519 the right signature algorithm, or do we want post-quantum-ready (your speciality)? Signed receipts will be long-lived artefacts and may need to verify 10+ years from now.
3. Should the install audit log be append-only (e.g. signed log segments) or is a standard Postgres table sufficient?
4. What is the right rotation cadence for the platform signing key, and what is the verification story for receipts signed under an old key?

## 11. Differentiation against copy-paste registries

Added 11 April 2026 in response to 21st.dev's expansion into the agent registry space and the broader emergence of free, community-contributed agent directories. The artefacts specified above — signed licence receipts, content hashes, audit logs, and the V1.5 per-install watermarking path — are first and foremost security and integrity mechanisms, and that framing is unchanged. They exist because the threats in Section 2 are real and the money path in `install_skill` cannot be left undefended. None of the verification language elsewhere in this spec should be read as having a marketing purpose.

But the same artefacts also produce a strategic property that copy-paste registries structurally cannot match, and it is worth naming it explicitly so it does not get lost. A free directory — 21st.dev's `/community/agents`, claudemarketplaces.com's community pages, any awesome-list with an install button — has nothing to attest to. There is no purchase, no buyer identity, no refund window, no platform signing key, no audit trail. The artefact a buyer ends up with after a copy-paste install is indistinguishable from a file that arrived by any other route. That is fine for free content and it is the right model for free content. It is also a permanent ceiling on what those operators can offer a buyer who needs proof — proof of provenance, proof of licence, proof of non-tampering, proof of refund-window compliance, proof that the install happened and when.

The licence receipt schema in Section 4 is the artefact that produces all of those proofs in a single signed object, and it exists as a side effect of the verification flow rather than as a separate compliance feature. That means any future enterprise story MintSkills tells — audit trails for regulated industries, IP attribution for creator disputes, refund proof for finance teams reconciling Stripe payouts, supply-chain attestation for buyers whose own customers will eventually demand it — is built on infrastructure that already has to exist for the security model to work. The cost of the moat is paid in the MVP build either way. The only question is whether the strategic value gets surfaced or not, and it should be surfaced, because the most likely competitive scenario through 2026 is not another paid marketplace with better verification but a well-funded free directory bolting on basic monetisation. Against that scenario, the receipt schema is the moat. Watermarking strengthens it. Honour-system refund enforcement is acceptable precisely because the receipt makes the honour visible.

This paragraph is descriptive, not prescriptive. The MVP scope in Section 9 is unchanged, the V1.5 split is unchanged, the "explicitly not doing, ever" list is unchanged, and the open questions for Alain in Section 10 are unchanged. Nothing in this section authorises a scope expansion.

---

**Next step:** walk this through with Alain when he on-boards as CSO. The MCP track in the sprint plan can start without his review (the MVP-scope items here are all standard web-app security), but V1.5 per-install encryption needs his sign-off before any code is written.
