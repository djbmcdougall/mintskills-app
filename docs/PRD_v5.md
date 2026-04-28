# MintSkills.ai — Product Requirements Document
### Version 5 — Updated 27 April 2026

> **Changelog from v4.** Five changes, all driven by the April 2026 competitive sweep and the deeper Agensi teardown completed 27 April. (1) Section 1 updated with competitive positioning note naming Agensi as the closest live competitor and clarifying MintSkills' structural advantages. (2) New Section 3c adds the **Skill Request Board** (demand-signal feature borrowed from Agensi and improved) — this is MVP scope. (3) Section 7 (Mint Verified) expanded with **per-download buyer fingerprinting** as MVP scope — this was V1.5 in the install hook spec but the Agensi teardown revealed it as a creator-acquisition critical feature that must ship at launch. (4) New Section 11a documents the **MCP Pool / MintPro subscription** mechanic — dual revenue streams for creators. (5) Section 20 is new: **Competitive Positioning vs Agensi** — a standing brief for the team on exactly where MintSkills is differentiated, to be consulted before any copy, pricing, or GTM decision. Everything in v4 otherwise stands unchanged.

---

## 1. What We're Building

MintSkills.ai is a paid marketplace for AI agent skills and creative code artifacts. Creators list skills, recipes, MCP servers, agent capabilities, CSS art, UI components, and other deployable code. Buyers discover, purchase, and deploy them. Every paid listing is security-verified before going live.

**One-line pitch:** "Your skills are Mint. We sell them for you."

**Hero line:** "Own your code."
**Secondary line:** "The skills protocol for AI agents."

**Business model:** Free tier indexes open source GitHub skills to drive traffic. Paid tier lets creators monetise proprietary work. 80% creator / 20% platform revenue split via Stripe Connect. No flat transaction fee — clean 80/20 at every price point.

**Competitive context (April 2026):** The closest live competitor is **Agensi.io**, which launched a paid SKILL.md marketplace before MintSkills and has established the 80/20 split as the market-rate creator payout. Agensi is developer-only (eight developer categories, no vertical expansion, no non-developer buyer acquisition), charges a $0.50 flat fee per transaction on top of its 20% cut (making it 25–30% effective take rate on low-price skills), and has no enterprise tooling, no MCP server category, and no full agent bundle tier. As of late April 2026, their top creator has 123 total downloads across all skills — the market is at day zero. MintSkills differentiates on: vertical categories for non-developer buyers, a higher and cleaner price ceiling (£5 to £1,000+), the Mint Verified trust layer (deeper than Agensi's automated scan), buyer fingerprinting for creator IP protection, the MCP Pool passive income stream, and the protocol-native install path specified in MINTSKILLS-INSTALL-HOOK-SPEC.md. Full competitive brief in Section 20.

**Security context:** The MCP server and agent tool ecosystem is under active attack. 30 CVEs were filed against MCP servers in the first 60 days of 2026. Over 24,000 secrets have been found in public MCP config files on GitHub, with 2,117 confirmed as live credentials. Malicious repos with fabricated stars and forks have delivered infostealers and credential harvesters to developers who trusted GitHub's social signals. MintSkills exists in part to fix this: Mint Verified is the trust layer the ecosystem lacks.

**Delivery philosophy:** MintSkills operates a Netflix model for code. Buyers access the effect, output, or execution of a skill — not necessarily the source. Protection is layered: API rendering, obfuscation, licence enforcement, buyer fingerprinting, and watermarking combine to make extraction commercially pointless and legally traceable.

---

## 2. What the MVP Must Do

### For Buyers:

- Browse and search skills and artifacts across all categories (developer and Cowork)
- Filter by category, price, platform compatibility, delivery model, and rating
- View skill/artifact detail pages with description, screenshots, live preview (where applicable), reviews, and Mint Verified badge
- Purchase via Stripe checkout (one-off payments for MVP, subscriptions in V2)
- Access purchased skills via embed token (API render tier) or download (source tier)
- View purchase history and active embed tokens in account dashboard
- 48-hour dispute window on all purchases (refund requests within 48 hours are reviewed by admin)
- Post to the **Skill Request Board** — describe a skill they need, upvote existing requests

### For Creators:

- Register and connect Stripe account via Stripe Connect
- Upload SKILL.md or ARTIFACT.md files with metadata (title, description, category, price, platform compatibility, delivery model) — a README.md with installation/integration instructions is mandatory in every paid listing package
- Select delivery model: Embed (API render), Source Download, or Extended Commercial
- Automatic Mint Verified security scan, watermark injection, and **buyer fingerprint provisioning** on submission
- View sales dashboard with revenue, downloads/embeds, and ratings
- Receive 80% of each sale directly to their Stripe account — no flat fee deducted
- Browse the Skill Request Board to identify validated demand before building
- **Opt in to MCP Pool** (see Section 11a) — earn a share of MintPro subscription revenue based on usage

### For the Platform:

- Index free GitHub skills via automated pipeline (crawl, parse, categorise)
- Run Mint Verified sandbox on every paid submission
- Inject forensic watermark and provision per-listing buyer fingerprint tokens into all accepted listings
- Process payments and split revenue via Stripe Connect
- Serve rendered output via embed API (for API render tier listings)
- Send transactional emails (purchase confirmation, creator payout, verification status, licence key, signed licence receipt)
- Admin dashboard for moderation, flagged listings, licence violations, and platform metrics
- Maintain Skill Request Board (public demand signal, creator-browsable)

---

## 3. Product Categories

MintSkills serves two distinct buyer populations sharing the same underlying infrastructure: the **developer lane** (Claude Code, Cursor, Codex, Windsurf, and adjacent agentic coding environments) and the **knowledge-worker lane** (Claude Cowork and the non-developer plugin ecosystem Anthropic is seeding via `anthropics/knowledge-work-plugins`). The ten developer categories are the historical core. The knowledge-worker categories were added in v4 and are MVP scope.

**What Agensi does not have:** Agensi has eight developer-only categories. The non-developer categories (3b) and the vertical-specific skills within them (accounting, legal, compliance, financial modelling, healthcare) are MintSkills' exclusive lane at launch. Creators listing professional-domain skills should be actively recruited and onboarded into these categories before Agensi builds them.

### 3a. Developer Categories (ten)

| Category                    | Description                              | Price Range  |
|-----------------------------|------------------------------------------|--------------|
| Skills                      | SKILL.md instruction packages            | £5 — £500    |
| Recipes                     | YAML workflow automations (Goose)        | £10 — £200   |
| MCP Servers                 | Tool connectors for agents               | £50 — £300   |
| Agent Configs               | Turnkey pre-tuned agents                 | £200 — £500+ |
| Prompt Libraries            | Domain-specific prompt collections       | £10 — £30    |
| Config Files                | CLAUDE.md / AGENTS.md setups             | £5 — £50     |
| Data Sets                   | Curated domain-specific data             | £20 — £200   |
| Starter Kits                | Full project scaffolds                   | £100 — £500  |
| Courses                     | How-to guides and tutorials              | £50 — £200   |
| **CSS Art & Creative Code** | **Pure CSS art, animations, games, UI components — no JS required** | **£5 — £150** |

#### CSS Art & Creative Code — Category Notes

This category targets frontend developers, CSS artists, and creative agencies. Products include pure CSS illustrations, scroll-driven animations, CSS-only games, UI micro-interactions, and experimental browser techniques.

**Key requirement:** Listings in this category must support live preview via the MintSkills embed render API. A static screenshot is insufficient — buyers must see the artifact running before purchase. The detail page renders the artifact inside a sandboxed iframe served from the MintSkills render API. Source code is never exposed to the browser.

**Ideal creator profile:** CSS artists (e.g. CodePen community, DEV.to CSS authors) who currently publish work for free with no monetisation path. MintSkills is the first platform designed to receive and commercialise this work.

### 3b. Cowork Knowledge-Worker Categories (eight)

Anthropic's `anthropics/knowledge-work-plugins` repo establishes Claude Cowork as a plugin ecosystem for non-developers. These buyers have higher willingness to pay per vertical-specific configuration (professional services pricing, not developer-tool pricing) and lower tolerance for configuration friction. Price ceilings in this lane extend to £1,000+ for vertical-specific Cowork agents.

| Category                    | Description                                                         | Price Range   |
|-----------------------------|---------------------------------------------------------------------|---------------|
| Productivity                | Time-management, task-routing, and inbox-orchestration Cowork plugins | £10 — £100    |
| Document Workflows          | Contract review, proposal generation, templated drafting             | £25 — £300    |
| Business Analysis           | Market research, competitor teardown, executive briefing packs       | £50 — £500    |
| Financial Modelling         | DCF templates, scenario planners, vertical-specific forecasting      | £100 — £1,000 |
| Research                    | Literature synthesis, source verification, citation management       | £25 — £300    |
| Marketing                   | Campaign planning, content ops, positioning frameworks               | £25 — £400    |
| Compliance                  | GDPR, FCA, MiCA, SOC2 checklists and audit-prep Cowork configs       | £100 — £1,000 |
| Vertical Agent Configs      | Turnkey Cowork agents for law, accounting, recruitment, healthcare   | £200 — £1,000+ |

#### Cowork Category Notes

**Delivery path.** Cowork listings install via the Anthropic plugin protocol (see Section 19), same as developer skills. The `marketplace.json` manifest declares compatibility with Cowork hosts. A buyer in Cowork runs the same `/plugin marketplace add mintskills/<creator>` flow a Claude Code buyer runs.

**Onboarding implication.** Cowork buyers are not reading release notes on GitHub. The onboarding flow for knowledge-worker categories must assume zero command-line comfort. Web-based install (button click → Cowork plugin install prompt) is the primary path; the CLI is secondary for this lane. Mobile-responsive purchase and install flows matter here in a way they don't for the developer categories.

**Creator profile.** Expect a meaningful share of Cowork creators to be professional-services operators rather than developers — solo consultants, accountants, analysts, compliance officers productising their internal Claude workflows. Onboarding copy should not assume technical fluency.

**Why this is MVP, not V2.** Timing. Apple's Extensions section at WWDC 26 plus Anthropic's active seeding of the Cowork plugin ecosystem means the non-developer wave arrives in 2026. Launching without Cowork categories would mean launching into half the addressable market.

### 3c. Skill Request Board

The Skill Request Board is a demand-signal feature for both sides of the marketplace, and is MVP scope.

**How it works.** Any registered user (buyer or creator) can post a request: "I need a skill that does X." Other users upvote requests. Creators browse the board to see validated demand before building — removing the guesswork from what to list next. The board is publicly visible without login (SEO value) but requires login to post or vote.

**Why this matters.** Agensi has this feature and it is their strongest supply-side mechanic. A creator who can see "47 buyers want a UK VAT compliance skill, 3 buyers specifically mentioned a price of £99" will build and list that skill faster and price it with more confidence than one working from intuition. MintSkills should launch with this feature and make it discoverable from the creator dashboard as the first call-to-action after account creation.

**Database additions.** Two new tables:

```
skill_requests
  id, posted_by (user_id), title, description, category,
  suggested_price_gbp (optional), upvote_count,
  status (open / in_progress / fulfilled),
  fulfilled_listing_id (fk to listings, nullable),
  created_at, updated_at

skill_request_votes
  id, request_id, voter_id,
  created_at
```

**Pages.** `/requests` (public board, sorted by upvotes), `/requests/new` (post a request), `/creator/dashboard/requests` (creator view, filtered to their categories).

---

## 4. Tech Stack

- **Frontend:** Next.js 14+ (App Router), Tailwind CSS, deployed on Vercel
- **Backend/DB:** Supabase (PostgreSQL, Auth, Row Level Security, Edge Functions)
- **Payments:** Stripe Connect (Express accounts for creators)
- **Search:** Supabase full-text search (sufficient for <1,000 listings at MVP, migrate to Algolia at scale if needed)
- **File Storage:** Supabase Storage (for skill file uploads and artifact source storage — never publicly accessible)
- **Render API:** Next.js API routes on Vercel Edge (for sandboxed artifact rendering)
- **Email:** Resend (transactional emails including licence key delivery)
- **Analytics:** PostHog (product analytics, free tier)
- **Monitoring:** Sentry (error tracking)

---

## 5. Database Schema (Core Tables)

```
users
  id, email, name, role (buyer/creator/admin), stripe_account_id,
  created_at, updated_at

listings
  id, creator_id, title, slug, description, category, price,
  currency, platform_compatibility[], tags[],
  file_url (private — never public), render_entry_point,
  delivery_model (embed | source_download | extended_commercial),
  status (draft/pending_review/verified/rejected/suspended),
  mint_verified_at, verified_report_url,
  watermark_hash,
  fingerprint_seed (per-listing seed for buyer fingerprint derivation),
  mcp_pool_eligible (boolean — creator opt-in for MintPro pool),
  downloads_count, embed_count, mcp_pool_usage_count,
  rating_avg, rating_count,
  created_at, updated_at

purchases
  id, buyer_id, listing_id, stripe_payment_id,
  amount, platform_fee, creator_payout,
  licence_tier (embed | source | extended),
  licence_key (UUID — embedded in delivered artifact),
  buyer_fingerprint (derived from fingerprint_seed + purchase_id + buyer_id),
  status (completed/refunded),
  created_at

installs
  id, purchase_id, listing_id, buyer_id,
  host (claude-code | cursor | codex | windsurf | vscode-copilot | cowork | web),
  repo_context_hash,
  installed_at

embed_tokens
  id, purchase_id, buyer_id, listing_id,
  token (signed JWT), domain_allowlist[],
  active (boolean), revoked_at,
  last_used_at, use_count,
  created_at, expires_at

reviews
  id, buyer_id, listing_id, rating (1-5), comment,
  created_at

free_skills (indexed from GitHub)
  id, repo_url, title, description, category,
  stars, last_updated, author,
  indexed_at

verification_reports
  id, listing_id, status (pass/fail/warning),
  checks_run[], issues_found[], sandbox_log_url,
  binary_detected (boolean),
  postinstall_scripts_found (boolean), postinstall_scripts_reviewed (boolean),
  suspicious_patterns[], base64_strings_found (boolean),
  dependency_issues[], low_dependent_count_flag (boolean),
  watermark_injected (boolean), watermark_signature,
  fingerprint_provisioned (boolean),
  created_at

licence_violations
  id, listing_id, reported_by, evidence_url,
  watermark_match (boolean), matched_licence_key,
  fingerprint_match (boolean), matched_buyer_fingerprint,
  status (open/investigating/resolved/dismissed),
  created_at

skill_requests
  id, posted_by (user_id), title, description, category,
  suggested_price_gbp (optional), upvote_count,
  status (open / in_progress / fulfilled),
  fulfilled_listing_id (nullable),
  created_at, updated_at

skill_request_votes
  id, request_id, voter_id,
  created_at

mcp_pool_usage
  id, listing_id, subscriber_id,
  session_count, last_used_at,
  period_start, period_end
```

---

## 6. Key Pages

```
/                          Landing page — hero, categories, featured listings, live previews
/browse                    Browse all listings with search and filters
/browse/[category]         Category filtered view
/listing/[slug]            Individual listing detail — includes live preview iframe for CSS Art category
/creator/[username]        Creator profile with their listings
/dashboard                 Buyer purchase history, downloads, and active embed tokens
/dashboard/tokens          Manage active embed tokens (revoke, add domain, view usage)
/creator/dashboard         Creator sales, revenue, listing management, MCP Pool earnings
/creator/new               Create new listing form with delivery model selection
/requests                  Skill Request Board — public, sorted by upvotes
/requests/new              Post a skill request (login required)
/auth/login                Login (Supabase Auth — email magic link + GitHub OAuth)
/auth/register             Register with role selection (buyer/creator)
/admin                     Admin moderation dashboard
/admin/violations          Licence violation reports and watermark/fingerprint matching tools
```

---

## 7. Mint Verified — MVP Scope

Mint Verified is the core trust differentiator for MintSkills. It exists because GitHub stars, forks, and readme quality are trivially cheap to fake — researchers at Carnegie Mellon found over 6 million fake stars across GitHub, and malicious MCP servers and agent tools have been documented deploying infostealers, credential harvesters, and residential proxy malware through repos with hundreds of fabricated stars and forks. MintSkills is the answer to this: every listing is scanned before it goes live, and the Mint Verified badge means something.

For the MVP, Mint Verified runs these automated checks on every paid listing submission:

### Static Analysis
- Scan all source files for suspicious patterns: outbound URLs, credential access patterns, environment variable reads, `eval` / `exec` calls, and base64-encoded strings (a common obfuscation technique for concealing malicious payloads)
- Flag any use of `curl`, `wget`, or equivalent HTTP client calls in shell scripts, post-install scripts, or build scripts
- Detect and hard-reject any compiled binaries (`.exe`, `.bin`, `.dylib`, `.so`, Rust/Go executables) included in the submission package — legitimate skills do not require precompiled binaries

### Post-Install Script Detection
- Parse `package.json` for `postinstall`, `preinstall`, and `install` lifecycle scripts — these are the primary attack vector for malicious npm packages
- Any post-install script that makes network requests, writes to system paths outside the project directory, or executes shell commands is an automatic **fail** requiring admin review before the listing can proceed
- All post-install scripts must be declared in the listing's README.md with explicit justification

### Dependency Verification
- Verify all referenced external packages exist in npm / pip / cargo registries
- Cross-reference against known vulnerability databases (OSV, Snyk, GitHub Advisory)
- Check dependency ratios: a package claiming wide adoption but with zero downstream dependents in npm/pip is flagged as suspicious
- Flag packages with very recent registry publication dates relative to the listing submission (a common pattern in dependency confusion attacks)

### Content Integrity
- SHA-256 hash generated and stored for every file in the submission package — serves as the baseline for future plagiarism detection and tampering verification
- Similarity check against existing verified listings for near-duplicate content detection

### Watermark Injection
- On pass, a forensic watermark is injected into the artifact (see Section 16)
- The watermark signature is stored against the listing record in `verification_reports`

### Buyer Fingerprint Provisioning (MVP — elevated from V1.5)

**This was originally scoped to V1.5 of the install hook spec. It is promoted to MVP scope based on the Agensi competitive teardown: buyer fingerprinting is the single most creator-persuasive trust feature in Agensi's product, and it must be present at MintSkills launch to win the creator acquisition battle.**

On Mint Verified pass, a `fingerprint_seed` is generated and stored against the listing record in Supabase Vault. At install time, the `install_skill` handler in MINTSKILLS-INSTALL-HOOK-SPEC.md derives a per-buyer fingerprint:

```
buyer_fingerprint = HMAC-SHA256(fingerprint_seed, purchase_id || buyer_id)
```

This fingerprint is embedded as a comment or frontmatter field in the delivered skill bundle — invisible in normal use but detectable by platform tooling and human review.

**What this enables for creators:**
- If a buyer redistributes a skill, the fingerprint in the leaked copy identifies exactly which purchase it came from
- Creator uploads the leaked file to their creator dashboard → platform matches the fingerprint → buyer account identified
- Creator can issue a warning email, suspend the buyer's access, or generate a pre-filled DMCA notice — all from the dashboard
- Full enforcement, not just detection

This must be surfaced prominently in creator onboarding as a selling point: "If your skill leaks, we tell you exactly who did it."

### Verification Outcome
Each submission produces a verification report with one of three outcomes:
- **Pass** — listing proceeds to live, Mint Verified badge applied, fingerprint provisioned
- **Warning** — listing held for admin review with specific issues flagged (e.g. a post-install script with declared network access)
- **Fail** — listing rejected, creator notified with specific failure reasons, resubmission permitted after remediation

### Mint Verified Badge — What It Communicates to Buyers
The badge on a listing page means:
- No hidden network calls or post-install scripts with undeclared behaviour
- No compiled binaries
- No obfuscated or encoded payloads
- Dependencies verified clean against known vulnerability databases
- Creator identity tied to a connected Stripe account (financial accountability)
- Content hash on file — any tampering post-verification is detectable
- **Every download is buyer-fingerprinted — redistribution is traceable**

This should be surfaced prominently on the landing page and listing detail pages. The badge is the primary trust signal — not stars, not forks, not readme quality.

V2 adds the full sandbox (Docker container execution, network monitoring, live credential exposure scanning). This is Alain's domain and requires proper security architecture.

---

## 8. Stripe Connect Flow

1. Creator registers and selects "I want to sell"
2. Creator clicks "Connect Stripe" — redirected to Stripe Connect Express onboarding
3. Stripe returns creator to MintSkills with connected account ID
4. When a buyer purchases, MintSkills creates a PaymentIntent with transfer_data pointing to the creator's connected account
5. **48-hour payout hold:** Funds are held for 48 hours before transfer to creator, allowing a dispute window for buyers
6. After 48 hours with no dispute, Stripe automatically splits: 80% to creator, 20% retained by platform. **No flat fee per transaction** — the 80/20 split is clean at every price point from £3 to £1,000+
7. Creator sees payouts in their Stripe dashboard
8. On purchase completion, system generates licence key and (where applicable) embed token and signed licence receipt, all delivered via Resend email

---

## 9. Free Tier — GitHub Indexing Pipeline

Automated pipeline runs daily:

1. Crawl known skill repositories (awesome-claude-skills, awesome-agent-skills, SkillsMP registry, etc.)
2. Parse SKILL.md files for metadata (title, description, tags)
3. Categorise into the ten product categories using LLM classification
4. Store in free_skills table with source attribution and link to original repo
5. Display in browse view with clear "Free — View on GitHub" badge (distinct from paid listings)

Purpose: Drive organic traffic. Every free skill is a gateway to discovering paid alternatives. Free skills surfaced alongside the Skill Request Board show creators which areas have demand they could monetise.

---

## 10. API Endpoints (Core)

```
Auth:
  POST   /api/auth/register
  POST   /api/auth/login
  POST   /api/auth/callback (OAuth)

Listings:
  GET    /api/listings                       (browse with filters)
  GET    /api/listings/[slug]                (detail)
  POST   /api/listings                       (create — creator only)
  PUT    /api/listings/[id]                  (update — creator only)
  DELETE /api/listings/[id]                  (soft delete — creator only)

Purchases:
  POST   /api/purchases                      (create checkout session)
  GET    /api/purchases                      (buyer history)
  GET    /api/purchases/[id]/download        (secure time-limited download link — source tier only)

Embed / Render API:
  GET    /api/render/[listing-id]            (render artifact — validates token, streams output)
  POST   /api/tokens                         (generate embed token post-purchase)
  GET    /api/tokens                         (buyer's active tokens)
  DELETE /api/tokens/[id]                    (revoke token)
  PUT    /api/tokens/[id]/domains            (update domain allowlist)

MCP:
  POST   /api/mcp/v1/mcp                     (hosted MCP server — all tool calls routed here)

Reviews:
  POST   /api/reviews                        (buyer only, after purchase)
  GET    /api/reviews/[listing_id]           (public)

Free Skills:
  GET    /api/free-skills                    (browse indexed skills)

Skill Requests:
  GET    /api/requests                       (public board)
  POST   /api/requests                       (post request — auth required)
  POST   /api/requests/[id]/vote             (upvote — auth required)
  DELETE /api/requests/[id]/vote             (remove vote)

Fingerprint / IP Enforcement:
  POST   /api/violations/fingerprint-check   (creator submits suspected leaked file — returns matched buyer)
  POST   /api/violations/report              (creator initiates enforcement action)

Webhooks:
  POST   /api/webhooks/stripe                (payment confirmations)

Admin:
  GET    /api/admin/listings/pending         (moderation queue)
  POST   /api/admin/listings/[id]/approve
  POST   /api/admin/listings/[id]/reject
  GET    /api/admin/violations               (licence violation queue)
  POST   /api/admin/violations/[id]/resolve
```

---

## 11. MVP Scope vs V2

### MVP (8-week sprint):

- Browse, search, and filter listings across developer and Cowork categories
- Creator registration and Stripe Connect
- File upload — source stored privately, never publicly accessible
- **Embed token delivery** for CSS Art & Creative Code category (API render tier)
- File download delivery for agent skills (source download tier)
- **Anthropic protocol-native install** via `marketplace.json` (see Section 19) — the `/plugin marketplace add mintskills/<creator>` path works end-to-end with licence gating
- **`@mintskills/cli` published to npm** — `init`, `install_skill`, `doctor`, `upgrade` commands working against Claude Code, Cursor, Codex, Windsurf, and VS Code Copilot as MCP hosts
- **Hosted MCP server at `api.mintskills.ai/v1/mcp`** — OAuth via Supabase Auth, `whoami`, `search_skills`, `install_skill` tools (see MINTSKILLS-INSTALL-HOOK-SPEC.md for the `install_skill` security model)
- Mint Verified static analysis + watermark injection + **buyer fingerprint provisioning**
- Purchase flow with Stripe checkout + licence key generation + signed licence receipt
- Basic creator and buyer dashboards
- **Creator fingerprint enforcement dashboard** (submit leaked file, view match, initiate action)
- Embed token management (generate, revoke, domain allowlist)
- Live preview iframe on listing detail pages (CSS Art category)
- Free tier GitHub indexing
- **Skill Request Board** (public browse, post request, upvote — auth required to post/vote)
- Web-based install flow for Cowork buyers (non-CLI path)
- Email notifications via Resend (including licence key + token delivery + signed licence receipt)
- Mobile responsive

### V2 (post-launch):

- Subscriptions and recurring billing for embed tier
- **MintPro subscription and MCP Pool** (see Section 11a — fast-follow, not MVP)
- API proxy delivery for agent skills (black box execution endpoint)
- Per-install encrypted bundles and purchase-bound watermarking (V1.5 of the install hook — see Section 9 of MINTSKILLS-INSTALL-HOOK-SPEC.md)
- Full Mint Verified sandbox (Docker, network monitoring) — Alain's domain
- Creator analytics (traffic sources, conversion rates, embed usage stats)
- Skill versioning and update notifications
- Creator verification badges (identity verified, top seller, etc.)
- Two-layer affiliate programme via Rewardful or Tolt (creator-side opt-in plus Platform Verified Picks) — fast-follow post-launch, needs real sales data to calibrate payout rates
- Extended commercial licence tier with audit trail
- Automated DMCA watermark matching on external submissions

---

## 11a. MintPro Subscription and MCP Pool

This section specifies the dual-revenue-stream model for creators: direct sales (MVP) and the MCP Pool (V2 fast-follow, targeting weeks 9–12 post-launch).

### Direct Sales (MVP)

The base model. Creator sets a price, buyer pays once, creator earns 80% at every price point with no flat fee deduction. Simple, clean, and better than Agensi's $0.50 flat-fee model especially for lower-priced skills.

### MintPro Subscription + MCP Pool (V2)

**MintPro** is a buyer-facing subscription (price TBD — likely £19–£29/month) that gives subscribers on-demand access to the full MintSkills catalogue via the hosted MCP server, with no per-skill purchase required. Agents can call any MCP Pool-eligible skill mid-conversation without the buyer having purchased it individually.

**MCP Pool** is the creator-side revenue mechanic. 70% of MintPro subscription revenue is distributed to MCP Pool creators proportional to their skill's session usage during that billing period. Platform retains 30% of subscription revenue.

**Creator opt-in.** Creators choose whether each listing participates in the MCP Pool. Opt-in is per-listing, not account-wide. A creator might sell a premium skill direct-only while listing a simpler companion skill in the Pool to drive discovery.

**Both streams run simultaneously.** A buyer who purchased a skill directly can also use it via MCP. A MintPro subscriber who finds a skill they rely on heavily can purchase it directly for offline access. The two streams are complementary, not competing.

**Database additions for MCP Pool (V2 scope):**

```
mintpro_subscriptions
  id, subscriber_id, stripe_subscription_id,
  status (active/cancelled/paused),
  period_start, period_end,
  created_at

mcp_pool_distributions
  id, period_start, period_end,
  total_subscription_revenue,
  pool_amount (70% of total),
  created_at

mcp_pool_creator_payouts
  id, distribution_id, creator_id,
  usage_share (0.0–1.0),
  payout_amount,
  stripe_transfer_id,
  created_at
```

**Why V2, not MVP.** The MCP Pool requires reliable usage telemetry from the hosted MCP server, a fair distribution algorithm, and Stripe subscription billing — all of which add sprint complexity that would delay the core marketplace. The MVP ships direct sales. The Pool is a fast-follow that gives creators a passive income story and gives MintPro subscribers a frictionless catalogue access story. Both are creator retention and buyer retention mechanics that compound over time.

---

## 12. Success Metrics

- **Month 1:** 50 paid listings live (including 10+ CSS Art, 10+ Cowork vertical), 500 free skills indexed, 100 registered users, Skill Request Board live with 50+ requests
- **Month 3:** 250 paid listings, 5,000 free skills indexed, first $10K GMV
- **Month 6:** 1,000 paid listings, 25,000 free skills, $50K monthly GMV, profitable
- **Ecosystem metrics:** Number of unique categories with 5+ listings (breadth), number of creators earning £500+/month (depth), number of Skill Request Board requests fulfilled (demand signal health)

---

## 13. Design Direction

Dark theme matching Murmur Labs aesthetic (amber/ink/cream palette from murmurlabs.co). Space Grotesk + Space Mono typography. Clean, data-dense marketplace layout — "Linear meets Modernist Library." Reference: Linear (clean dark UI, restraint as a design system, product-as-marketing), Mintlify (infrastructure positioning, tiered pricing model), Coinbase (trust-focused marketplace).

Key UX principle: The listing *is* the marketing. Skill cards and artifact previews should be visually spectacular — especially for CSS Art listings where the live preview iframe is the primary selling tool. Never show a static screenshot where a live render is possible.

Use DESIGN.md files from `~/awesome-design-md/` for AI-driven UI generation.

---

## 14. Non-Goals for MVP

- No mobile app
- No subscription billing (one-off purchases only at MVP — MintPro is V2)
- No full sandbox execution (static analysis only)
- No social features (following creators, activity feeds)
- No internationalisation
- No content moderation AI (manual admin review for MVP)
- No per-install bundle encryption (V1.5 of the install hook — MVP ships pre-signed URLs from private storage with buyer fingerprinting, which is sufficient against casual licence sharing)
- No automated external watermark scanning (V2)
- No phone-home DRM, time-bombed skills, or hardware fingerprinting (see Section 9 of MINTSKILLS-INSTALL-HOOK-SPEC.md — these are explicitly "never doing")
- No MCP Pool or MintPro subscription (V2 fast-follow)

---

## 15. Legal & IP Protection

- **Licence agreement:** Every purchase generates a signed licence key tied to the buyer account, purchase ID, and permitted use case. Licence terms are presented and accepted at checkout before payment completes.
- **Signed licence receipt:** Every install writes a tamper-evident receipt to `.mintskills/receipts/<purchase_id>.json`, signed with the platform Ed25519 key, covering purchase ID, listing ID, buyer identity hash, install timestamp, refund window, and content hash. Full schema in MINTSKILLS-INSTALL-HOOK-SPEC.md Section 4.
- **Buyer fingerprinting:** Every paid download embeds a per-buyer fingerprint derived from the listing seed and purchase identity. Redistribution is traceable to source. Creator enforcement dashboard provides one-click DMCA notice generation.
- **Plagiarism policy:** Platform reserves the right to remove listings and ban users who upload content substantially similar to existing listings (enforced via content hash, similarity checks, and watermark matching).
- **DMCA-style takedown:** Original creators can submit takedown requests. Admin reviews and compares listings using hash, similarity, and watermark tools within 48 hours.
- **Refund policy:** Buyers have a 48-hour dispute window from purchase. Refund requests are reviewed by admin. On approved refund, embed tokens are revoked immediately. Creators are not paid until the dispute window closes. Refund enforcement is honour-system with repeat-offender flagging — see MINTSKILLS-INSTALL-HOOK-SPEC.md Section 6 for the full rationale.
- **Licence violation reporting:** Any party can submit a violation report with evidence URL. Admin uses watermark and fingerprint matching tools to identify source account. Confirmed violations result in account suspension and, where applicable, legal referral.
- **Terms of Service:** Required before launch — creator agreement covering IP ownership, prohibited content, platform rights, watermarking consent, and fingerprinting consent. Legal counsel needed for final drafting.

---

## 16. Content Protection & Delivery Architecture

### Philosophy

MintSkills operates a Netflix model for code: buyers access the *effect* of a skill or artifact, not necessarily its source. Perfect copy protection does not exist — a determined developer can always inspect a browser. The goal is to make extraction sufficiently painful that it is not commercially worthwhile, and legally traceable when it occurs.

Protection is layered across four mechanisms:

### Layer 1 — API Render / Embed Delivery (Primary)

The strongest protection. Source code never leaves MintSkills servers. The buyer receives an embed snippet, not code:

```html
<iframe
  src="https://api.mintskills.ai/render/[listing-id]?token=[SIGNED_JWT]"
  sandbox="allow-scripts allow-same-origin"
/>
```

The render API endpoint:
1. Validates the signed JWT token (buyer identity, listing ID, expiry, domain allowlist)
2. Retrieves the artifact source from private Supabase Storage
3. Renders and streams the output — HTML/CSS/JS executed server-side or in an isolated worker
4. Returns rendered output only — source never exposed in response body
5. Logs usage (timestamp, domain, token ID) for analytics and abuse detection

Token properties:
- Signed with platform secret (RS256 JWT)
- Tied to buyer account ID and purchase ID
- Domain allowlist: token only validates requests from declared domains
- Revocable: platform can invalidate any token immediately (on refund, violation, or account suspension)
- Expiry: for subscription products (V2), tokens expire with the subscription

**Side effect:** Every embed is a MintSkills-branded touchpoint on a third-party website — passive marketing at scale.

### Layer 2 — Obfuscation for Source Download Tier

For listings where source download is offered (source licence tier), the delivered code is obfuscated before delivery:

- **CSS:** PostCSS transforms with custom class name mangling and value micro-variations
- **JS:** Standard minification + identifier renaming (Terser or equivalent)
- **Licence key embedding:** The buyer's unique licence key UUID is embedded as a comment or variable within the obfuscated code. This survives most copy-paste operations and serves as the forensic trace.

Obfuscation does not prevent a senior developer from reverse-engineering the code given sufficient effort. It raises the cost high enough that most buyers will not attempt it.

### Layer 3 — Forensic Watermarking + Buyer Fingerprinting

Applied to all listings at Mint Verified pass time.

**Watermark** (listing-level, injected at verification):
- Specific class name patterns unique to the listing (e.g. `.ms-[hash]-container`)
- Micro-variations in numeric values (e.g. `border-radius: 4.001px`) that are visually imperceptible but computationally distinct
- A comment block with an encoded signature stored against the listing record

**Buyer fingerprint** (purchase-level, injected at install):
- Derived per-buyer: `HMAC-SHA256(fingerprint_seed, purchase_id || buyer_id)`
- Embedded as a comment or frontmatter field in the delivered bundle
- Identifies not just "this listing was leaked" but "this specific buyer's copy was leaked"

When a violation is reported, admin tools (and the creator self-service dashboard) compare the submitted evidence against both the watermark database and the fingerprint registry. The watermark identifies the listing; the fingerprint identifies the buyer.

### Layer 4 — Legal & Licence Enforcement

The commercial and legal backstop. Every purchase:
1. Presents licence terms at checkout (buyer must accept before payment)
2. Generates a unique licence key stored in the `purchases` table
3. Emails the licence key and signed licence receipt to the buyer
4. Records the licence scope (embed / source / extended commercial)

Licence violation is a breach of contract and, where the watermark/fingerprint identifies copying of protected creative work, a potential copyright infringement. Platform reserves the right to pursue DMCA takedowns, account suspension, and legal referral for confirmed violations.

---

## 17. Licence Tier Model

Three licence tiers are available at purchase. Not all listings offer all tiers — creators choose which tiers to enable when listing.

### Tier 1 — Embed Licence

**What the buyer gets:** An embed token. Access to the rendered output of the artifact via the MintSkills render API. No source code delivered.

**Permitted use:** Embed on declared domains. Personal or commercial use on owned properties. Cannot redistribute or resell the embed.

**Price point:** Base price (lowest tier). Suitable for display use cases — a CSS animation on a website, a component in a deployed app.

**Revocability:** Platform can revoke token at any time (on refund, violation, or subscription lapse in V2).

---

### Tier 2 — Source Licence

**What the buyer gets:** Obfuscated source code download with embedded licence key and buyer fingerprint. Can integrate into their own project directly.

**Permitted use:** Single project / single organisation. Cannot redistribute, resell, or publish as open source. Domain or project scope declared at purchase.

**Price point:** 2–3× the embed licence price. Suitable for developers who need offline access, air-gapped environments, or direct code integration.

**Traceability:** Licence key and buyer fingerprint embedded in delivered code. Violation traceable to buyer account.

---

### Tier 3 — Extended Commercial Licence

**What the buyer gets:** Clean (non-obfuscated) source code with full documentation and buyer fingerprint. Audit trail generated on download.

**Permitted use:** Multiple projects, client work, integration into products for resale. Cannot resell the artifact itself as a standalone product.

**Price point:** 5–10× the embed licence price. Suitable for agencies, studios, and developers building products on top of the artifact.

**Availability:** Creator opt-in only. Not all listings will offer this tier. Creators who enable it signal confidence in their work and willingness to engage with commercial buyers.

---

### Tier Comparison Summary

| | Embed | Source | Extended Commercial |
|---|---|---|---|
| Source code delivered | No | Obfuscated | Clean |
| Buyer fingerprinted | N/A | Yes | Yes |
| Revocable | Yes | No (licence key) | No (audit trail) |
| Offline use | No | Yes | Yes |
| Multiple projects | No | No | Yes |
| Client work | No | No | Yes |
| Relative price | 1× | 2–3× | 5–10× |

---

## 18. Security Threat Narrative — Marketing & Content Strategy

The threat context documented in Section 7 is not just a product justification — it is the most compelling marketing story MintSkills has at launch.

**The core narrative:** GitHub stars are the most manipulated trust signal in open source. Researchers found 6 million fake stars, 278,000 bot accounts, and fabricated star campaigns on over 15,000 repositories. You can buy 1,000 stars for $64. Meanwhile, developers are installing MCP servers, Claude Code extensions, and agent tools from repos they evaluated in 10 seconds. Malicious repos have delivered infostealers that grab browser passwords, cookies, payment methods, and crypto wallet keys. The attack surface has exploded. GitHub has no answer to it. MintSkills does.

**Recommended launch content:**

1. **Founding blog post:** "Why we built Mint Verified" — tells the threat story, cites the real statistics, explains what the badge means. Positions MintSkills as infrastructure the ecosystem needs, not just a marketplace.

2. **Twitter/X thread:** The fake star statistics are viscerally shareable. Lead with the $64 / 1,000 stars figure, walk through the Claude Code fake repo incident (a working narrative that resonates directly with the target audience), end with the Mint Verified pitch.

3. **Creator onboarding email sequence:** Frame Mint Verified to creators not as gatekeeping but as a quality signal that protects their reputation and commands a price premium. "Your buyers know your code is clean before they install it. And if anyone leaks it, we tell you exactly who."

4. **Buyer landing page copy:** Lead with the security problem, not the marketplace features. "Every listing verified. Every dependency checked. Every binary rejected. Every download fingerprinted. That's the Mint Verified guarantee." Feature discovery and browsing are secondary to trust establishment on first visit.

**Outreach:** The author of the GitHub trust problem article (circulated April 2026) is writing directly to the MintSkills target audience. Worth direct outreach for guest post, quote, or partnership.

---

## 19. Anthropic Protocol-Native Install Path

Added in v4 to reconcile the PRD with the 10 April operational brief in CLAUDE.md. This section specifies what was previously described only at the strategic level: how a buyer on Claude Code, Cursor, Codex, Windsurf, VS Code Copilot, or Cowork actually installs a MintSkills listing into their environment using the Anthropic plugin protocol rather than a zip download.

### Why protocol-native, and why in MVP

The Anthropic `/plugin marketplace add <github-org>/<repo>` protocol is open and permissionless. Every free directory in the ecosystem (buildwithclaude.com, aitmpl.com, and Anthropic's own `claude-plugins-official` and `knowledge-work-plugins` repos) already uses it. Being a marketplace is not the moat. Being the only marketplace with **payments + verification + buyer fingerprinting + licence-gated install delivered through the native protocol** is the moat.

Shipping protocol-native install in MVP (rather than V2) matters because:

1. A buyer who has to download a zip, unpack it, and move files into `.claude/skills/` has a different expectation of the transaction than a buyer who runs `/plugin marketplace add mintskills/<creator>` and gets the skill live in their environment in under ten seconds. The second expectation is what paying customers of professional software have. MintSkills sells at professional prices and needs the install experience to match.
2. Every free directory is setting the UX bar. If MintSkills ships a worse install experience than the free alternatives, the price premium becomes impossible to justify regardless of verification quality.
3. Agensi ships a zip download with manual install instructions. The protocol-native path is a meaningful UX moat Agensi does not have.
4. The AIDesigner pattern (`@aidesigner/agent-skills` + hosted MCP server) demonstrates that this architecture is buildable by a small team and shipping today. We are not inventing a protocol; we are implementing one that exists.

### The three install surfaces

A MintSkills listing is installable via three complementary paths that share a single backend:

**Path A — `/plugin marketplace add` (native Anthropic protocol).** The buyer runs `/plugin marketplace add mintskills/<creator-slug>` inside their MCP host. The host reads `marketplace.json` from the creator's MintSkills-managed GitHub repository. The manifest declares which skills are available and points at the MintSkills hosted MCP server at `api.mintskills.ai/v1/mcp` for licence-gated install. Free and open-source listings install directly from the manifest with no payment gate. Paid listings require an authenticated session against MintSkills before the `install_skill` tool returns bundle contents.

**Path B — `@mintskills/cli`.** The buyer runs `npx -y @mintskills/cli init` to configure their MCP host (Claude Code config, Cursor config, Codex config, Windsurf config, VS Code Copilot config — the CLI detects the host and writes the correct configuration). From there, `npx @mintskills/cli install <slug>` triggers the same `install_skill` flow the native protocol uses, but with richer terminal UX: repo-context analysis, conflict detection, adoption briefs, `doctor` for diagnostics, `upgrade` for version management. This is the power-user surface.

**Path C — Web install for Cowork and non-developer buyers.** The listing detail page offers a "Install to Cowork" button. Clicking deep-links into the buyer's Cowork host with a pre-authenticated install prompt. The buyer never touches a terminal. This is the primary surface for the knowledge-worker categories introduced in Section 3b.

All three paths converge on the same server-side `install_skill` handler specified in MINTSKILLS-INSTALL-HOOK-SPEC.md. The security model, signed licence receipts, buyer fingerprint embedding, refund-window enforcement, and audit log are identical across paths. Only the client-side UX differs.

### `marketplace.json` manifest structure

Each MintSkills creator is assigned a GitHub repository under a MintSkills-managed organisation (e.g. `github.com/mintskills/<creator-slug>`). This repo contains only the manifest; no source code is stored there. The manifest declares the creator's listings and delegates install to the hosted MCP server.

```json
{
  "version": 1,
  "name": "mintskills/<creator-slug>",
  "description": "Verified agent skills by <creator name>",
  "mcp_server": {
    "url": "https://api.mintskills.ai/v1/mcp",
    "auth": "oauth"
  },
  "skills": [
    {
      "slug": "invoice-parser-pro",
      "title": "Invoice Parser Pro",
      "summary": "Extracts structured data from unstructured invoices across 40+ formats.",
      "category": "document-workflows",
      "price_gbp": 49,
      "licence_tier": "source",
      "mint_verified": true,
      "verified_at": "2026-04-11T09:12:00Z",
      "hosts": ["claude-code", "cursor", "codex", "windsurf", "vscode-copilot", "cowork"],
      "mcp_pool_eligible": true,
      "install": {
        "method": "mcp_tool",
        "tool": "install_skill",
        "listing_id": "lst_01HABC..."
      }
    }
  ]
}
```

The manifest is regenerated server-side by MintSkills whenever a creator adds, updates, or removes a listing. Creators do not hand-edit `marketplace.json`. This is deliberate: manifests are cryptographic attestations of what is currently verified and for sale, and hand-editing them would break the trust model.

### Licence gating at the protocol layer

Free listings are installable by anyone. Paid listings require:

1. An authenticated session against `api.mintskills.ai/v1/mcp` (OAuth via Supabase Auth, handled by the MCP host's standard OAuth flow)
2. A completed, non-refunded purchase for the requested `listing_id`
3. Acceptance of the licence terms at the time of the `install_skill` call

All three are verified server-side by the `install_skill` handler. The full security model — signed licence receipts written to `.mintskills/receipts/`, buyer fingerprint embedded in bundle, content hash verification, audit logging, honour-system refund enforcement with repeat-offender flagging, the V1.5 path to per-install encrypted bundles — is specified in **MINTSKILLS-INSTALL-HOOK-SPEC.md**. That document is the source of truth for `install_skill` mechanics. This section describes only how the three install surfaces route into it.

### Cross-host compatibility in MVP

MVP must support these MCP hosts at launch:

- **Claude Code** (primary — Anthropic native, largest installed base)
- **Cursor** (large and growing, MCP-native)
- **Codex** (OpenAI, MCP support shipped late 2025)
- **Windsurf** (Cognition, MCP-native)
- **VS Code Copilot** (Microsoft, MCP extension path)
- **Claude Cowork** (Anthropic — the knowledge-worker lane, see Section 3b)

The CLI handles host detection and config writing for the first five. The web install path handles Cowork.

### Public documentation

The MCP track ships with public developer documentation at `mintskills.ai/docs/mcp`, structured identically to AIDesigner's `@aidesigner/agent-skills` docs (which is the pattern that works for this buyer). This documentation is part of MVP scope, not a post-launch addition — creators and buyers both need it to evaluate the platform before committing.

---

## 20. Competitive Positioning vs Agensi

Added in v5. This is a standing brief for the team to be consulted before any copy, pricing, or GTM decision. Updated as the competitive landscape changes.

**Last updated:** 27 April 2026. Based on full homepage and skills catalogue teardown of agensi.io.

### What Agensi Is

Agensi.io is the closest live competitor. It launched before MintSkills and has established:
- 80/20 creator split as the market-rate payout
- Automated security scanning as a baseline expectation
- A buyer fingerprinting and piracy enforcement dashboard as the creator trust anchor
- An SEO content moat (60+ "how to install skills" articles targeting every relevant search query)
- A Skill Request Board as the demand-signal mechanic

These are all good and MintSkills must match or exceed them. The features above are not differentiators — they are table stakes.

### Where MintSkills Wins

| Dimension | Agensi | MintSkills Advantage |
|---|---|---|
| Pricing | 20% + $0.50 flat fee | Clean 80/20, no flat fee — better for creators at every price point |
| Price ceiling | $5–$50 typical, $400 outlier | £5–£1,000+, with dedicated categories for high-value professional skills |
| Vertical categories | Developer-only (8 categories) | Developer + 8 Cowork knowledge-worker verticals — entirely unclaimed market |
| Non-developer buyers | None | Cowork lane, mobile-responsive install, web install path |
| Install experience | Manual zip download | Protocol-native `/plugin marketplace add`, CLI, web install |
| MCP server category | None | Full MCP server listings (£50–£300) |
| Full agent bundles | None | Agent Config tier (£200–£500+) |
| Passive income for creators | None | MCP Pool (V2) — usage-share of MintPro subscription revenue |
| Enterprise tooling | None | Enterprise licence tier, audit trail, volume licensing (V2) |
| Signed licence receipts | No | Yes — tamper-evident, offline-verifiable, Ed25519 signed |
| Creator traction | ~40 creators, 222 skills, 123 max downloads | Target: 50+ paid listings at month 1, creator recruitment from skills.sh leaderboard |

### Where Agensi Has the Lead

- **Time to market.** They are live. MintSkills is not.
- **SEO.** Their content library targets the exact searches our buyers and creators will run. MintSkills needs a content strategy that either targets different queries or earns more authoritative coverage in the same queries.
- **Creator contest.** Small ($100 prize) but indicates active supply-side recruitment. MintSkills should match this with a Genesis Drop — first 25 verified creators get a permanent "Genesis Creator" badge, higher placement in search for 90 days, and a feature in the founding blog post.

### Creator Acquisition Counter-Pitch Against Agensi

When a developer on the skills.sh leaderboard is considering Agensi vs MintSkills, the pitch is:

1. **No flat fee.** Agensi takes 20% + $0.50 per sale. MintSkills takes 20%, full stop. On a £10 skill, that's 25p more per sale. On 100 sales, that's £25 in your pocket instead of Agensi's.
2. **Bigger market.** Agensi's 8 developer categories vs MintSkills' 18. Your productivity skill sells to developers and to every knowledge worker who uses Claude Cowork.
3. **Better IP protection.** Both have fingerprinting. MintSkills adds signed licence receipts that are legally robust, offline-verifiable, and enterprise-grade — not just a DMCA button.
4. **The passive income story.** The MCP Pool is coming in V2. Creators who establish themselves on MintSkills early get the best usage share when the pool launches.
5. **Protocol-native install.** Your buyers install via `/plugin marketplace add mintskills/<you>` — not by downloading a zip. That's a better first impression for your work.

### What Not to Say

Do not position MintSkills as "Agensi but better." Name Agensi only in contexts where a prospective creator or buyer has already mentioned it. The MintSkills story is positive — "the commercial layer the agent economy needs" — not reactive. The Agensi comparison table above is internal intelligence, not marketing copy.

---

*Document owner: David, Murmur Labs Ltd. Confidential — not for distribution.*
*Cross-reference: MINTSKILLS-INSTALL-HOOK-SPEC.md (install_skill security model, licence receipt schema, refund enforcement, V1.5 encryption path)*
