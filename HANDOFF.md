# MintSkills App — Developer Handoff

**For:** Alain and Ezequiel
**From:** David (via Claude Code)
**Date:** 29 April 2026

---

## What's been built

Every page, component, and API route in the marketplace is scaffolded and functional with fixture data. The visual design matches the live landing page exactly — same fonts, same colours (OKLCH), same aesthetic. Alain and Ezequiel inherit a deployable app.

---

## Pages live

| Route | Status |
|---|---|
| `/` | Homepage |
| `/browse` | Marketplace with filters, search, free/paid toggle |
| `/browse/[category]` | All 31 category pages (static) |
| `/listing/[slug]` | Paid listing detail with purchase card and Mint Verified accordion |
| `/listing/free/[slug]` | Free skill detail with GitHub link and amber warning banner |
| `/creator/[username]` | Public creator profile with stats and listings grid |
| `/creator/dashboard` | Full creator dashboard — overview, listings, earnings tabs |
| `/creator/new` | 5-step listing submission form |
| `/dashboard` | Buyer dashboard — purchases, downloads, embed tokens |
| `/requests` | Skill Request Board with voting and post-request form |
| `/auth/login` | Magic link + GitHub OAuth |
| `/auth/register` | Magic link + GitHub OAuth + role selection |
| `/admin` | Admin overview — stats, activity feed |
| `/admin/moderation` | Moderation queue with slide-over review sheet |
| `/admin/violations` | Violation reports with mark-resolved state |
| `/admin/users` | User list |
| `/search` | Full-text search page |
| `/_not-found` | 404 page |

---

## Components built

`SkillCard`, `MintVerifiedBadge`, `PriceDisplay`, `CategoryBadge`, `PlatformBadge`, `PageHeader`, `AppLayout`, `RequestCard`, `LoadingSpinner`, `EmptyState`

---

## API routes scaffolded

All 14 handlers in `src/app/api/` have:
- TypeScript types for request/response
- Zod input validation (`src/lib/validations/index.ts`)
- Auth checks where required
- Correct HTTP status codes
- TODO comments for business logic

The Stripe webhook (`/api/webhooks/stripe`) is a stub — that is Alain's primary Day 1 job.

---

## Database

Migrations in `supabase/migrations/` — run in order with `supabase db push`. Do not modify.

---

## Free skills indexer

```bash
npm run index-skills
```

Pulls `SKILL.md` files from five public GitHub repos and upserts into the `free_skills` table. Run once after initial deploy, then weekly via cron or manually.

Source: `src/lib/indexer/scrape.ts`

---

## Alain — your jobs, in order

### Day 1 — Connect infrastructure (2–3 hours)

1. Create Supabase project at [supabase.com](https://supabase.com)
2. Copy `.env.local.example` → `.env.local`, fill in Supabase URL + anon key + service role key
3. `supabase link --project-ref YOUR_PROJECT_REF`
4. `supabase db push` — runs all migrations in order 001 onwards
5. Enable GitHub OAuth in Supabase Auth → Providers
6. Set `NEXT_PUBLIC_APP_URL=http://localhost:3000` in `.env.local`
7. `npm run dev`
8. Verify browse page loads at `localhost:3000/browse` with real data

### Day 1–2 — Stripe Connect (3–4 hours)

Implement `src/app/api/webhooks/stripe/route.ts` — full spec in the TODO comments and `/docs/PRD_v5.md` Section 8.

Key numbers:
- Platform cut: `application_fee_amount = Math.round(price_pence * 0.20)`
- Creator payout: 80% — automatic via Stripe Connect transfer
- 48-hour dispute hold: configured on the Stripe Connect account, not in code

### Day 2–3 — Wire real data (2–3 hours)

Each page has a `// TODO: replace with real Supabase query` comment. The TypeScript types are already correct.

Priority order:
1. Browse page → listing detail
2. Creator dashboard
3. Buyer dashboard

### Day 3–4 — Install hook

Spec: `/docs/INSTALL-HOOK-SPEC.md`
Stub is at `src/app/api/mcp/` — implement when ready.
David will not chase you on this.

### Day 4 — Deploy (1 hour)

```bash
vercel link
vercel env add   # add all env vars from .env.local
vercel --prod
```

Set custom domain: `app.mintskills.ai` in the Vercel dashboard.
Set `mintskills.ai` to redirect `/` → `app.mintskills.ai`.

### After deploy — run the indexer

```bash
npm run index-skills
```

Populates `free_skills` with real skills from GitHub. Run again weekly.

---

## Hard rules — please read before touching anything

1. **Never implement `install_skill` crypto without David's sign-off** — see `/docs/INSTALL-HOOK-SPEC.md`
2. **Never run `supabase db push` on production without reviewing each migration first**
3. **Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser** — server-side only, always
4. **Feature branches only** — never commit directly to `main`
5. **The landing page (`mintskills.ai`) is a separate repo** — do not touch it

---

## First command

```bash
git clone https://github.com/djbmcdougall/mintskills-app
cd mintskills-app
cp .env.local.example .env.local
# fill in your Supabase and Stripe keys, then:
npm install
npm run dev
```
