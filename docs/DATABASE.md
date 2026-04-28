# MintSkills Database Schema

## Tables

| Table | Purpose |
|---|---|
| `users` | Registered accounts — buyers, creators, and admins. Mirrors `auth.users` IDs so RLS can use `auth.uid()`. |
| `listings` | Every paid skill, MCP server, CSS art piece, and Cowork plugin for sale on the platform. |
| `purchases` | Completed Stripe transactions with licence tier, payout split, and buyer fingerprint. |
| `installs` | Audit log of every protocol-native skill install, recording the host environment and repo context hash. |
| `embed_tokens` | Signed JWT tokens that gate access to the render API for embed-tier purchases. |
| `reviews` | Buyer ratings (1–5) and comments on purchased listings — one review per buyer per listing. |
| `free_skills` | Free skills indexed from public GitHub repositories by the daily crawl pipeline. |
| `verification_reports` | Full output of the Mint Verified static analysis pipeline — service-role access only. |
| `licence_violations` | Creator-filed IP violation reports with watermark and fingerprint match results. |
| `skill_requests` | Public demand-signal board where buyers describe skills they need. |
| `skill_request_votes` | Junction table recording upvotes on skill requests — triggers keep `upvote_count` in sync. |

---

## Key RLS Rules

### `users`
- Rows are readable and updatable only by the owning user (`auth.uid() = id`).
- Service role has full access for admin operations and the Stripe webhook handler.
- **Why:** User profiles contain email and Stripe account IDs — no cross-account reads.

### `listings`
- Anyone (including anonymous) can SELECT listings where `status = 'verified'` — required for public browse and SEO.
- Creators can SELECT, INSERT, UPDATE, and DELETE their own listings regardless of status.
- Service role bypasses all restrictions for the verification pipeline and admin moderation.
- **Why:** Drafts and rejected listings must be invisible to buyers but accessible to their creator.

### `purchases`
- Buyers can only SELECT their own rows.
- No browser INSERT — purchases are created exclusively by the Stripe webhook handler via the service role key.
- **Why:** Direct browser inserts would allow bypassing payment. The 80/20 payout split must be calculated server-side.

### `installs`
- Buyers can SELECT their own install history.
- Installs are written by the `install_skill` handler — service role only for writes.
- **Why:** Install records carry repo context hashes used for fingerprinting; they must not be user-writable.

### `embed_tokens`
- Buyers can SELECT and UPDATE (domain allowlist, revocation) their own tokens.
- Token generation and revocation-on-refund are server-side operations.
- **Why:** Tokens control access to the render API; a buyer revoking someone else's token would break their embed.

### `reviews`
- Publicly readable — required for social proof on listing pages.
- INSERT is restricted to the authenticated buyer identified in the row.
- **Why:** Review gating to authenticated buyers prevents fake reviews; public reads support SEO.

### `free_skills`
- Publicly readable — the free tier is MintSkills' primary SEO surface.
- Only the service role can write — the daily GitHub indexing pipeline runs as service role.
- **Why:** Free skill data is platform-managed, not user-submitted.

### `verification_reports`
- Service role only — not readable by creators or buyers through the API.
- **Why:** Reports contain raw static analysis output including security findings that could be used to evade detection.

### `licence_violations`
- Any authenticated user can INSERT (to file a report).
- Reporters can SELECT their own submissions.
- Service role has full access for admin investigation and resolution.
- **Why:** Open submission lowers the barrier for legitimate reports while keeping investigation details private.

### `skill_requests`
- Publicly readable (no login required) — the board is an SEO asset.
- Authenticated users can INSERT and UPDATE their own requests.
- **Why:** Public visibility drives creator discovery; login gates posting to prevent spam.

### `skill_request_votes`
- Authenticated users can INSERT and DELETE their own votes.
- A `UNIQUE (request_id, voter_id)` constraint prevents duplicate votes at the database level.
- An AFTER INSERT/DELETE trigger on this table atomically updates `upvote_count` on the parent `skill_requests` row.
- **Why:** Denormalising the count avoids a COUNT(*) on every board render.

---

## Migration Run Order

Run in this exact sequence — each file depends on the tables created before it:

| Order | File | Creates |
|---|---|---|
| 1 | `001_users.sql` | `users` |
| 2 | `002_listings.sql` | `listings` (FK → users) |
| 3 | `003_purchases.sql` | `purchases` (FK → users, listings) |
| 4 | `004_installs.sql` | `installs` (FK → purchases, listings, users) |
| 5 | `005_embed_tokens.sql` | `embed_tokens` (FK → purchases, users, listings) |
| 6 | `006_reviews.sql` | `reviews` (FK → users, listings) |
| 7 | `007_free_skills.sql` | `free_skills` |
| 8 | `008_verification_reports.sql` | `verification_reports` (FK → listings) |
| 9 | `009_licence_violations.sql` | `licence_violations` (FK → listings, users) |
| 10 | `010_skill_requests.sql` | `skill_requests`, `skill_request_votes`, upvote trigger |
| 11 | `011_functions.sql` | `update_updated_at()` trigger on users, listings, skill_requests |
| 12 | `012_seed.sql` | Dev seed: 3 creators, 3 buyers, 5 listings, 10 purchases, 8 requests, 15 free skills |
| 13 | `013_seed_free_skills.sql` | 50 free skills from top public repos |

**Skip `012_seed.sql` and `013_seed_free_skills.sql` in production.**

---

## How to Run (Alain)

```bash
# 1. Install Supabase CLI if not already installed
brew install supabase/tap/supabase

# 2. Link to the remote project
supabase link --project-ref YOUR_PROJECT_REF

# 3. Apply migrations
supabase db push

# Or apply a single migration for testing:
supabase db execute --file supabase/migrations/001_users.sql
```

> **Security reminder:** `SUPABASE_SERVICE_ROLE_KEY` must never be committed or
> exposed to the browser. Set it only in Vercel environment variables under
> the server-only scope. See `.env.example` for the full list of required vars.

---

## Notes for Future Migrations

- V2 tables (`mintpro_subscriptions`, `mcp_pool_distributions`, `mcp_pool_creator_payouts`) are defined in PRD Section 11a. Do not create them until MintPro sprint begins.
- `verification_reports` has three columns not yet reflected in `src/lib/types/database.ts`: `sandbox_log_url`, `postinstall_scripts_reviewed`, `low_dependent_count_flag`. Update the TypeScript interface when Alain connects the Supabase project.
- The `fingerprint_seed` column on `listings` stores a secret value. Consider moving it to Supabase Vault (encrypted column) before launch per the install hook spec.
