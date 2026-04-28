@AGENTS.md

# MintSkills App — Claude Code Context

## What this is
mintskills-app is the full marketplace application for MintSkills.ai.
The marketing landing page is a SEPARATE repo at github.com/djbmcdougall/mintskills-landing. Do not modify that repo.

## Product specs
/docs/PRD_v5.md — full product requirements. Read before writing any code.
/docs/INSTALL-HOOK-SPEC.md — install hook security spec. Read before any MCP work.

## Stack
Next.js 16 (App Router) · Supabase · Stripe Connect · Tailwind CSS v4 · TypeScript
Radix UI primitives · Lucide icons · Recharts · Resend · Vercel deployment

## Next.js 16 — Breaking changes
- `middleware.ts` is DEPRECATED. Use `src/proxy.ts` with a named `proxy` export.
- Tailwind v4 is CSS-first: design tokens live in `@theme {}` blocks in globals.css. There is NO tailwind.config.ts.
- Read node_modules/next/dist/docs/ before touching routing, caching, or auth patterns.

## Design system
Fonts: Barlow Condensed (display), Barlow (body), Martian Mono (code)
All colours are OKLCH — exact values in src/app/globals.css @theme block.
Mint is used surgically. CTAs, badges, prices, verified marks only.
Background is near-black. Surfaces are dark grey. Text is cream.
Aesthetic: restrained, data-dense, professional infrastructure. Not flashy.
The listing IS the marketing. Skill cards must be beautiful.

## Brand rules
- No hyphens anywhere. Em dashes or commas only.
- British English (catalogue, monetise, colour, organise, licence).
- Numbers under ten are words except in stats and data.
- Active voice. "We verify every skill" not "skills are verified."
- 341 is ClawHub's malicious skill count. Never present as a MintSkills metric.
- "Stop Open Sourcing Your Income" — brand line, standalone, never modified.
- "Your skills. Your price. Your terms." — proposition, creator pages only.

## Business rules
- Creator payout: 80% of every sale. Platform: 20%. No flat fee.
- 48-hour dispute window before payout releases to creator.
- Mint Verified = passed static analysis + watermark injected + fingerprint provisioned.
- Three licence tiers: Embed (API render only), Source (obfuscated download), Extended Commercial (clean source).

## Security rules — NON-NEGOTIABLE
1. NEVER implement install_skill cryptographic operations without Alain sign-off.
   Stub with: // TODO: SECURITY-REVIEW-REQUIRED — see /docs/INSTALL-HOOK-SPEC.md
2. NEVER run supabase db push. Generate migration files only.
3. NEVER expose SUPABASE_SERVICE_ROLE_KEY to the browser.
4. NEVER make listing file_url publicly accessible. Always use pre-signed URLs.
5. NEVER commit secrets. Always use env vars.
6. Feature branches only. Never commit directly to main.

## Routes
/browse — marketplace browse, search, filter
/browse/[category] — category view
/listing/[slug] — paid listing detail
/listing/free/[slug] — free skill detail (no purchase, links to GitHub)
/creator/[username] — public creator profile
/dashboard — buyer dashboard
/dashboard/tokens — embed token management
/creator/dashboard — creator dashboard
/creator/new — new listing form
/requests — Skill Request Board
/auth/login and /auth/register
/admin — admin dashboard

## Alain's jobs (do not pre-empt)
- Connect Supabase project and run migrations
- Wire Stripe Connect webhook handler
- Implement install_skill security handler
- Set production env vars and deploy to Vercel
