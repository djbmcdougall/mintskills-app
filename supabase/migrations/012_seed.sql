-- =============================================================================
-- 012_seed.sql — Development seed data only. NOT for production.
-- In production, users must be created via Supabase Auth so that
-- public.users.id matches auth.users.id (required for RLS auth.uid() checks).
-- =============================================================================

-- Creators ----------------------------------------------------------------
INSERT INTO public.users (id, email, name, role, stripe_account_id, created_at, updated_at) VALUES
  ('00000000-0000-0000-0001-000000000001', 'alex.chen@example.com',   'Alex Chen',    'creator', 'acct_seed_alex',   now() - interval '30 days', now() - interval '30 days'),
  ('00000000-0000-0000-0001-000000000002', 'priya.sharma@example.com','Priya Sharma', 'creator', 'acct_seed_priya',  now() - interval '25 days', now() - interval '25 days'),
  ('00000000-0000-0000-0001-000000000003', 'marcus.webb@example.com', 'Marcus Webb',  'creator', 'acct_seed_marcus', now() - interval '20 days', now() - interval '20 days');

-- Buyers ------------------------------------------------------------------
INSERT INTO public.users (id, email, name, role, created_at, updated_at) VALUES
  ('00000000-0000-0000-0002-000000000001', 'jamie.oliver@example.com', 'Jamie Oliver',  'buyer', now() - interval '15 days', now() - interval '15 days'),
  ('00000000-0000-0000-0002-000000000002', 'sarah.kim@example.com',    'Sarah Kim',     'buyer', now() - interval '12 days', now() - interval '12 days'),
  ('00000000-0000-0000-0002-000000000003', 'tom.brookes@example.com',  'Tom Brookes',   'buyer', now() - interval '10 days', now() - interval '10 days');

-- Listings (5, all status=verified, across categories) --------------------
INSERT INTO public.listings (
  id, creator_id, title, slug, description, category, price, currency,
  platform_compatibility, tags,
  delivery_model, status, mint_verified_at, mcp_pool_eligible,
  downloads_count, embed_count, rating_avg, rating_count,
  created_at, updated_at
) VALUES
  (
    '00000000-0000-0000-0010-000000000001',
    '00000000-0000-0000-0001-000000000001',
    'TypeScript Type Generator Pro',
    'typescript-type-generator-pro',
    'Generates precise TypeScript interfaces and Zod schemas from JSON, API responses, database schemas, or plain English descriptions. Handles nested objects, optional fields, discriminated unions, and recursive types.',
    'skill', 29.00, 'GBP',
    ARRAY['claude-code','cursor','codex'],
    ARRAY['typescript','zod','codegen','types'],
    'source_download', 'verified', now() - interval '14 days', true,
    47, 0, 4.80, 12,
    now() - interval '21 days', now() - interval '14 days'
  ),
  (
    '00000000-0000-0000-0010-000000000002',
    '00000000-0000-0000-0001-000000000002',
    'GitHub Repo Analyser MCP',
    'github-repo-analyser-mcp',
    'MCP server that gives your agent deep insight into any GitHub repository: dependency graphs, contributor activity, code quality metrics, open issue triage, and PR review patterns. Works with any MCP-compatible host.',
    'mcp_server', 79.00, 'GBP',
    ARRAY['claude-code','cursor','windsurf'],
    ARRAY['github','mcp','code-analysis','devtools'],
    'embed', 'verified', now() - interval '10 days', true,
    23, 89, 4.90, 8,
    now() - interval '18 days', now() - interval '10 days'
  ),
  (
    '00000000-0000-0000-0010-000000000003',
    '00000000-0000-0000-0001-000000000003',
    'Glassmorphism UI Kit',
    'glassmorphism-ui-kit',
    'Pure CSS glassmorphism component library: 24 polished components including cards, modals, navbars, buttons, and form elements. Scroll-driven reveal animations included. Zero JavaScript required.',
    'css_art', 24.00, 'GBP',
    ARRAY['web','cursor'],
    ARRAY['css','glassmorphism','ui-kit','animations','no-js'],
    'embed', 'verified', now() - interval '8 days', false,
    0, 134, 4.70, 19,
    now() - interval '15 days', now() - interval '8 days'
  ),
  (
    '00000000-0000-0000-0010-000000000004',
    '00000000-0000-0000-0001-000000000001',
    'UK VAT Compliance Cowork Agent',
    'uk-vat-compliance-cowork-agent',
    'Cowork plugin for UK VAT: MTD filing preparation, quarterly return reconciliation, partial exemption calculations, import VAT, and HMRC query drafting. Understands Making Tax Digital requirements end to end.',
    'cowork', 149.00, 'GBP',
    ARRAY['cowork'],
    ARRAY['vat','uk-tax','mtd','hmrc','accounting','compliance'],
    'source_download', 'verified', now() - interval '6 days', false,
    31, 0, 4.60, 7,
    now() - interval '12 days', now() - interval '6 days'
  ),
  (
    '00000000-0000-0000-0010-000000000005',
    '00000000-0000-0000-0001-000000000002',
    'Full-Stack Code Review Agent',
    'full-stack-code-review-agent',
    'Pre-configured agent that performs production-quality code review across TypeScript, Python, SQL, and infrastructure files. Checks security, performance, architecture, test coverage, and accessibility. Integrates with GitHub PR workflows.',
    'agent_config', 299.00, 'GBP',
    ARRAY['claude-code','cursor','codex','windsurf','vscode-copilot'],
    ARRAY['code-review','security','typescript','python','sql','devops'],
    'extended_commercial', 'verified', now() - interval '4 days', true,
    14, 0, 5.00, 5,
    now() - interval '9 days', now() - interval '4 days'
  );

-- Purchases (10 across buyers and listings, various licence tiers) ---------
INSERT INTO public.purchases (
  id, buyer_id, listing_id, stripe_payment_id,
  amount, platform_fee, creator_payout,
  licence_tier, licence_key, status, created_at
) VALUES
  ('00000000-0000-0000-0020-000000000001', '00000000-0000-0000-0002-000000000001', '00000000-0000-0000-0010-000000000001', 'pi_seed_001', 29.00,  5.80,  23.20, 'source',   gen_random_uuid(), 'completed', now() - interval '10 days'),
  ('00000000-0000-0000-0020-000000000002', '00000000-0000-0000-0002-000000000001', '00000000-0000-0000-0010-000000000002', 'pi_seed_002', 79.00,  15.80, 63.20, 'embed',    gen_random_uuid(), 'completed', now() - interval '9 days'),
  ('00000000-0000-0000-0020-000000000003', '00000000-0000-0000-0002-000000000002', '00000000-0000-0000-0010-000000000001', 'pi_seed_003', 29.00,  5.80,  23.20, 'source',   gen_random_uuid(), 'completed', now() - interval '8 days'),
  ('00000000-0000-0000-0020-000000000004', '00000000-0000-0000-0002-000000000002', '00000000-0000-0000-0010-000000000003', 'pi_seed_004', 24.00,  4.80,  19.20, 'embed',    gen_random_uuid(), 'completed', now() - interval '7 days'),
  ('00000000-0000-0000-0020-000000000005', '00000000-0000-0000-0002-000000000003', '00000000-0000-0000-0010-000000000004', 'pi_seed_005', 149.00, 29.80, 119.20,'source',   gen_random_uuid(), 'completed', now() - interval '6 days'),
  ('00000000-0000-0000-0020-000000000006', '00000000-0000-0000-0002-000000000001', '00000000-0000-0000-0010-000000000005', 'pi_seed_006', 299.00, 59.80, 239.20,'extended', gen_random_uuid(), 'completed', now() - interval '5 days'),
  ('00000000-0000-0000-0020-000000000007', '00000000-0000-0000-0002-000000000002', '00000000-0000-0000-0010-000000000002', 'pi_seed_007', 79.00,  15.80, 63.20, 'embed',    gen_random_uuid(), 'completed', now() - interval '4 days'),
  ('00000000-0000-0000-0020-000000000008', '00000000-0000-0000-0002-000000000003', '00000000-0000-0000-0010-000000000001', 'pi_seed_008', 29.00,  5.80,  23.20, 'source',   gen_random_uuid(), 'completed', now() - interval '3 days'),
  ('00000000-0000-0000-0020-000000000009', '00000000-0000-0000-0002-000000000003', '00000000-0000-0000-0010-000000000003', 'pi_seed_009', 24.00,  4.80,  19.20, 'embed',    gen_random_uuid(), 'completed', now() - interval '2 days'),
  ('00000000-0000-0000-0020-000000000010', '00000000-0000-0000-0002-000000000001', '00000000-0000-0000-0010-000000000004', 'pi_seed_010', 149.00, 29.80, 119.20,'source',   gen_random_uuid(), 'refunded',  now() - interval '1 day');

-- Skill Requests (8 with realistic demand content) -------------------------
INSERT INTO public.skill_requests (
  id, posted_by, title, description, category, suggested_price_gbp, upvote_count, status, created_at, updated_at
) VALUES
  (
    '00000000-0000-0000-0030-000000000001',
    '00000000-0000-0000-0002-000000000001',
    'UK Self-Assessment Tax Return Agent',
    'A Cowork plugin that walks through a UK self-assessment tax return step by step: calculates allowances, flags missing income sources, handles property income and capital gains, and drafts the final HMRC submission.',
    'cowork', 150.00, 47, 'open', now() - interval '14 days', now() - interval '2 days'
  ),
  (
    '00000000-0000-0000-0030-000000000002',
    '00000000-0000-0000-0002-000000000002',
    'Rust Borrow Checker Explainer',
    'A skill that takes a Rust borrow checker error, produces a plain-English explanation with a minimal reproduction case, and offers three alternative approaches to fix it. Essential for anyone learning Rust.',
    'skill', 20.00, 34, 'open', now() - interval '12 days', now() - interval '3 days'
  ),
  (
    '00000000-0000-0000-0030-000000000003',
    '00000000-0000-0000-0002-000000000003',
    'Figma to Next.js Component Converter',
    'Paste a Figma frame link and receive production-quality Next.js Server Components with Tailwind, TypeScript types, accessibility attributes, and responsive breakpoints. Must handle complex nested layouts and auto-layout frames.',
    'skill', 45.00, 89, 'in_progress', now() - interval '10 days', now() - interval '1 day'
  ),
  (
    '00000000-0000-0000-0030-000000000004',
    '00000000-0000-0000-0002-000000000001',
    'GDPR Compliance Audit Cowork Plugin',
    'Reviews a website or application against GDPR requirements, generates a compliance gap report, produces a cookie policy draft, and creates a data processing register template. Must cover legitimate interest assessments.',
    'cowork', 99.00, 62, 'open', now() - interval '9 days', now() - interval '2 days'
  ),
  (
    '00000000-0000-0000-0030-000000000005',
    '00000000-0000-0000-0002-000000000002',
    'CSS Art Loading Spinner Pack',
    'Twenty pure CSS loading spinners from simple circles to complex morphing shapes. Each should be a standalone snippet under 40 lines, with CSS custom properties for colour and size theming. No JavaScript.',
    'css_art', 15.00, 28, 'open', now() - interval '8 days', now() - interval '4 days'
  ),
  (
    '00000000-0000-0000-0030-000000000006',
    '00000000-0000-0000-0002-000000000003',
    'PostgreSQL Query Optimiser',
    'Analyses a slow PostgreSQL query, reads EXPLAIN ANALYZE output, identifies the bottleneck, and produces an optimised version with index recommendations. Should handle CTE refactoring and JOIN order optimisation.',
    'skill', 35.00, 51, 'open', now() - interval '7 days', now() - interval '1 day'
  ),
  (
    '00000000-0000-0000-0030-000000000007',
    '00000000-0000-0000-0002-000000000001',
    'AWS Cost Analysis and Reduction Agent',
    'Agent that reads from AWS Cost Explorer, identifies the top cost drivers, compares against right-sizing recommendations, and produces a prioritised cost reduction plan with specific actions and estimated monthly savings.',
    'agent_config', 199.00, 73, 'open', now() - interval '6 days', now() - interval '2 days'
  ),
  (
    '00000000-0000-0000-0030-000000000008',
    '00000000-0000-0000-0002-000000000002',
    'UK Employment Law Document Reviewer',
    'Cowork plugin for HR and founders. Reviews employment contracts, settlement agreements, and disciplinary letters against UK employment law, flags non-compliant clauses, and suggests standard replacement language.',
    'cowork', 249.00, 41, 'open', now() - interval '5 days', now() - interval '3 days'
  );

-- 15 representative free_skills for dev testing ---------------------------
INSERT INTO public.free_skills (repo_url, title, description, category, stars, last_updated, author, indexed_at) VALUES
  ('https://github.com/vercel-labs/agent-skills',       'find-skills',               'Discovers and recommends relevant skills from the MintSkills catalogue based on project context.',                                             'skills',      14200,  now() - interval '5 days',  'vercel-labs', now()),
  ('https://github.com/anthropics/skills',              'frontend-design',           'Generates accessible, responsive React components with Tailwind CSS from design descriptions or Figma links.',                                  'frontend',    118100, now() - interval '3 days',  'anthropics',  now()),
  ('https://github.com/affaan-m/everything-claude-code','everything-claude-code',    'Comprehensive skill collection covering the full software development lifecycle for Claude Code environments.',                                  'skills',      141900, now() - interval '2 days',  'affaan-m',    now()),
  ('https://github.com/obra/superpowers',               'superpowers',               'Batteries-included agent skill pack: web search, file management, code execution, and data transformation.',                                    'skills',      137000, now() - interval '4 days',  'obra',        now()),
  ('https://github.com/anthropics/skills',              'pdf',                       'Extract, analyse, and manipulate PDF documents including form data extraction and text summarisation.',                                          'docs',        118100, now() - interval '3 days',  'anthropics',  now()),
  ('https://github.com/anthropics/skills',              'docx',                      'Create, edit, and convert Word documents with advanced formatting, tables, and tracked-changes support.',                                        'docs',        118100, now() - interval '3 days',  'anthropics',  now()),
  ('https://github.com/affaan-m/everything-claude-code','security-scan',             'Comprehensive security audit against OWASP Top 10, dependency CVE check, and hardcoded secrets detection.',                                    'security',    141900, now() - interval '6 days',  'affaan-m',    now()),
  ('https://github.com/affaan-m/everything-claude-code','python-testing',            'Generates pytest test suites with fixtures, parametrization, and coverage configuration from existing Python code.',                            'testing',     141900, now() - interval '7 days',  'affaan-m',    now()),
  ('https://github.com/affaan-m/everything-claude-code','docker-patterns',           'Produces production-grade Dockerfiles and docker-compose configs with multi-stage builds and security hardening.',                              'devops',      141900, now() - interval '8 days',  'affaan-m',    now()),
  ('https://github.com/anthropics/skills',              'git-workflow-and-versioning','Manages branching strategy, commit message conventions, semantic versioning, and changelog generation.',                                       'git',         118100, now() - interval '5 days',  'anthropics',  now()),
  ('https://github.com/affaan-m/everything-claude-code','backend-patterns',          'Implements repository pattern, service layer, and API response formats for Node.js and Python backends.',                                       'backend',     141900, now() - interval '9 days',  'affaan-m',    now()),
  ('https://github.com/affaan-m/everything-claude-code','pytorch-patterns',          'Scaffolds PyTorch training loops, dataset classes, and model architectures with reproducibility best practices.',                               'data-science',141900, now() - interval '10 days', 'affaan-m',    now()),
  ('https://github.com/anthropics/skills',              'debugging-and-error-recovery','Systematically diagnoses runtime errors, stack traces, and unexpected behaviour with minimal reproduction context.',                          'debugging',   118100, now() - interval '4 days',  'anthropics',  now()),
  ('https://github.com/affaan-m/everything-claude-code','seo-audit',                 'Audits on-page SEO, technical SEO, and content quality for any URL and generates a prioritised action plan.',                                  'marketing-seo',141900,now() - interval '11 days', 'affaan-m',    now()),
  ('https://github.com/affaan-m/everything-claude-code','context-engineering',       'Optimises Claude context window usage: summarises history, prunes redundancy, and structures information for maximum retention.',               'productivity',141900, now() - interval '12 days', 'affaan-m',    now());
