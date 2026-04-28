-- =============================================================================
-- 013_seed_free_skills.sql — 50 free skills from top public repos.
-- Run after 007_free_skills.sql. Safe to re-run (ON CONFLICT DO NOTHING).
-- =============================================================================

INSERT INTO public.free_skills (repo_url, title, description, category, stars, last_updated, author, indexed_at)
VALUES

-- ── Skills / general ──────────────────────────────────────────────────────
('https://github.com/vercel-labs/agent-skills',
 'find-skills',
 'Discovers and recommends relevant skills from public registries and the MintSkills catalogue based on your project context.',
 'skills', 14200, '2026-04-20', 'vercel-labs', now()),

('https://github.com/affaan-m/everything-claude-code',
 'everything-claude-code',
 'Comprehensive skill collection covering the full software development lifecycle for Claude Code environments.',
 'skills', 141900, '2026-04-25', 'affaan-m', now()),

('https://github.com/obra/superpowers',
 'superpowers',
 'Batteries-included agent skill pack: web search, file management, code execution, and data transformation.',
 'skills', 137000, '2026-04-22', 'obra', now()),

('https://github.com/addyosmani/agent-skills',
 'agent-skills',
 'Curated set of high-quality agent skills covering frontend engineering, performance, and web platform best practices.',
 'skills', 29300, '2026-04-18', 'addyosmani', now()),

-- ── Frontend ──────────────────────────────────────────────────────────────
('https://github.com/anthropics/skills',
 'frontend-design',
 'Generates accessible, responsive React components with Tailwind CSS from design descriptions or Figma links.',
 'frontend', 118100, '2026-04-23', 'anthropics', now()),

('https://github.com/vercel-labs/agent-skills',
 'vercel-react-best-practices',
 'Enforces Vercel and Next.js App Router best practices: Server Components, streaming, ISR, and image optimisation.',
 'frontend', 25200, '2026-04-19', 'vercel-labs', now()),

('https://github.com/vercel-labs/agent-skills',
 'web-design-guidelines',
 'Applies modern web design principles: spacing systems, typography scales, colour contrast, and responsive layout patterns.',
 'frontend', 25200, '2026-04-19', 'vercel-labs', now()),

('https://github.com/affaan-m/everything-claude-code',
 'frontend-patterns',
 'Implements common frontend architecture patterns: compound components, render props, custom hooks, and state colocation.',
 'frontend', 141900, '2026-04-21', 'affaan-m', now()),

('https://github.com/affaan-m/everything-claude-code',
 'minimalist-ui',
 'Applies minimalist UI design principles: purposeful whitespace, typographic hierarchy, and restrained colour use.',
 'frontend', 141900, '2026-04-20', 'affaan-m', now()),

('https://github.com/affaan-m/everything-claude-code',
 'design-taste-frontend',
 'Critiques UI designs and suggests improvements grounded in typography, colour theory, and layout composition principles.',
 'frontend', 141900, '2026-04-17', 'affaan-m', now()),

-- ── Docs ──────────────────────────────────────────────────────────────────
('https://github.com/anthropics/skills',
 'pdf',
 'Extracts, analyses, and manipulates PDF documents including form data extraction and multi-page text summarisation.',
 'docs', 118100, '2026-04-23', 'anthropics', now()),

('https://github.com/anthropics/skills',
 'docx',
 'Creates, edits, and converts Word documents with advanced formatting, tables, and tracked-changes support.',
 'docs', 118100, '2026-04-23', 'anthropics', now()),

('https://github.com/anthropics/skills',
 'pptx',
 'Generates slide decks from outlines or structured data with consistent themes, speaker notes, and slide transitions.',
 'docs', 118100, '2026-04-23', 'anthropics', now()),

('https://github.com/anthropics/skills',
 'xlsx',
 'Creates and parses Excel workbooks: formulas, pivot tables, conditional formatting, and multi-sheet structures.',
 'docs', 118100, '2026-04-23', 'anthropics', now()),

('https://github.com/affaan-m/everything-claude-code',
 'documentation-and-adrs',
 'Generates Architecture Decision Records and developer documentation from code, PRs, and conversation context.',
 'docs', 141900, '2026-04-16', 'affaan-m', now()),

-- ── Security ──────────────────────────────────────────────────────────────
('https://github.com/anthropics/skills',
 'security-review',
 'Reviews code for OWASP Top 10 vulnerabilities, checks for hardcoded secrets, and flags insecure patterns.',
 'security', 118100, '2026-04-22', 'anthropics', now()),

('https://github.com/anthropics/skills',
 'security-hardening',
 'Applies security hardening to web applications: CSP headers, rate limiting, CSRF protection, and input sanitisation.',
 'security', 118100, '2026-04-22', 'anthropics', now()),

('https://github.com/affaan-m/everything-claude-code',
 'security-scan',
 'Comprehensive security audit against OWASP Top 10, CVE database cross-reference, and hardcoded secrets detection.',
 'security', 141900, '2026-04-20', 'affaan-m', now()),

('https://github.com/obra/superpowers',
 'vulnerability-check',
 'Scans project dependencies for known vulnerabilities using OSV, Snyk, and GitHub Advisory Database sources.',
 'security', 137000, '2026-04-21', 'obra', now()),

-- ── Testing ───────────────────────────────────────────────────────────────
('https://github.com/anthropics/skills',
 'test-driven-development',
 'Guides TDD workflow: writes failing tests first, implements minimal passing code, then refactors with coverage verification.',
 'testing', 118100, '2026-04-22', 'anthropics', now()),

('https://github.com/affaan-m/everything-claude-code',
 'python-testing',
 'Generates pytest test suites with fixtures, parametrization, and coverage configuration from existing Python code.',
 'testing', 141900, '2026-04-19', 'affaan-m', now()),

('https://github.com/affaan-m/everything-claude-code',
 'e2e-testing',
 'Writes Playwright end-to-end tests for critical user journeys with screenshot capture and trace upload.',
 'testing', 141900, '2026-04-18', 'affaan-m', now()),

('https://github.com/affaan-m/everything-claude-code',
 'browser-testing-with-devtools',
 'Leverages browser DevTools APIs for performance profiling, network throttling, and accessibility auditing in tests.',
 'testing', 141900, '2026-04-17', 'affaan-m', now()),

-- ── DevOps ────────────────────────────────────────────────────────────────
('https://github.com/affaan-m/everything-claude-code',
 'docker-patterns',
 'Produces production-grade Dockerfiles and docker-compose configs with multi-stage builds and security hardening.',
 'devops', 141900, '2026-04-16', 'affaan-m', now()),

('https://github.com/affaan-m/everything-claude-code',
 'deployment-patterns',
 'Implements zero-downtime deployment patterns: blue-green, canary releases, and feature flag rollouts.',
 'devops', 141900, '2026-04-15', 'affaan-m', now()),

('https://github.com/affaan-m/everything-claude-code',
 'ci-cd-and-automation',
 'Configures CI/CD pipelines for GitHub Actions, CircleCI, and GitLab CI with caching, parallelism, and deployment gates.',
 'devops', 141900, '2026-04-14', 'affaan-m', now()),

('https://github.com/vercel-labs/agent-skills',
 'vercel-deployment',
 'Manages Vercel project configuration, environment variables, preview deployments, and production promotion workflows.',
 'devops', 25200, '2026-04-18', 'vercel-labs', now()),

-- ── Git ───────────────────────────────────────────────────────────────────
('https://github.com/anthropics/skills',
 'git-workflow-and-versioning',
 'Manages branching strategy, conventional commit messages, semantic versioning, and automated changelog generation.',
 'git', 118100, '2026-04-22', 'anthropics', now()),

('https://github.com/affaan-m/everything-claude-code',
 'git-workflow',
 'Enforces git workflow conventions: branch naming, commit hygiene, PR descriptions, and merge conflict resolution.',
 'git', 141900, '2026-04-13', 'affaan-m', now()),

-- ── Backend ───────────────────────────────────────────────────────────────
('https://github.com/anthropics/skills',
 'backend-patterns',
 'Implements repository pattern, service layer, and consistent API response envelopes for Node.js and Python backends.',
 'backend', 118100, '2026-04-22', 'anthropics', now()),

('https://github.com/affaan-m/everything-claude-code',
 'api-and-interface-design',
 'Designs RESTful and GraphQL APIs with consistent naming, versioning, pagination, and error response standards.',
 'backend', 141900, '2026-04-12', 'affaan-m', now()),

('https://github.com/affaan-m/everything-claude-code',
 'database-migrations',
 'Generates safe database migrations with rollback support, zero-downtime column additions, and index strategies.',
 'backend', 141900, '2026-04-11', 'affaan-m', now()),

('https://github.com/affaan-m/everything-claude-code',
 'postgres-patterns',
 'Applies PostgreSQL best practices: query optimisation, RLS policies, JSONB indexing, and connection pool configuration.',
 'backend', 141900, '2026-04-10', 'affaan-m', now()),

('https://github.com/affaan-m/everything-claude-code',
 'spec-driven-development',
 'Derives implementation plans from PRD and API specs before writing code, ensuring alignment between spec and code.',
 'backend', 141900, '2026-04-09', 'affaan-m', now()),

-- ── Data Science ──────────────────────────────────────────────────────────
('https://github.com/affaan-m/everything-claude-code',
 'pytorch-patterns',
 'Scaffolds PyTorch training loops, dataset classes, and model architectures with reproducibility best practices.',
 'data-science', 141900, '2026-04-08', 'affaan-m', now()),

('https://github.com/affaan-m/everything-claude-code',
 'data-scraper-agent',
 'Builds ethical web scrapers with rate limiting, robots.txt compliance, structured output, and retry logic.',
 'data-science', 141900, '2026-04-07', 'affaan-m', now()),

('https://github.com/affaan-m/everything-claude-code',
 'analytics-tracking',
 'Implements product analytics instrumentation with PostHog, Amplitude, or Mixpanel including event taxonomy design.',
 'data-science', 141900, '2026-04-06', 'affaan-m', now()),

-- ── Debugging ─────────────────────────────────────────────────────────────
('https://github.com/anthropics/skills',
 'debugging-and-error-recovery',
 'Systematically diagnoses runtime errors, stack traces, and unexpected behaviour with minimal reproduction context.',
 'debugging', 118100, '2026-04-22', 'anthropics', now()),

('https://github.com/affaan-m/everything-claude-code',
 'performance-optimization',
 'Identifies performance bottlenecks in frontend and backend code and applies targeted fixes with before/after benchmarks.',
 'debugging', 141900, '2026-04-05', 'affaan-m', now()),

-- ── Automation ────────────────────────────────────────────────────────────
('https://github.com/affaan-m/everything-claude-code',
 'autonomous-agent-harness',
 'Builds multi-step autonomous agent loops with progress tracking, safe interruption, and structured output capture.',
 'automation', 141900, '2026-04-04', 'affaan-m', now()),

('https://github.com/affaan-m/everything-claude-code',
 'agentic-engineering',
 'Applies agentic engineering patterns: tool use, subagent delegation, context budgeting, and loop termination conditions.',
 'automation', 141900, '2026-04-03', 'affaan-m', now()),

('https://github.com/anthropics/skills',
 'schedule',
 'Creates and manages scheduled remote agent tasks with cron expressions and one-off timed triggers.',
 'automation', 118100, '2026-04-22', 'anthropics', now()),

-- ── Marketing / SEO ───────────────────────────────────────────────────────
('https://github.com/affaan-m/everything-claude-code',
 'seo-audit',
 'Audits on-page SEO, technical SEO, and content quality for any URL and generates a prioritised action plan.',
 'marketing-seo', 141900, '2026-04-02', 'affaan-m', now()),

('https://github.com/affaan-m/everything-claude-code',
 'content-strategy',
 'Builds content calendars, keyword cluster maps, and topic briefs from a site URL and target audience description.',
 'marketing-seo', 141900, '2026-04-01', 'affaan-m', now()),

('https://github.com/affaan-m/everything-claude-code',
 'ai-seo',
 'Optimises content for AI search visibility: structured data, concise answers, and entity disambiguation.',
 'marketing-seo', 141900, '2026-03-31', 'affaan-m', now()),

('https://github.com/affaan-m/everything-claude-code',
 'social-content',
 'Adapts long-form content into platform-native social posts for X, LinkedIn, and Bluesky with engagement optimisation.',
 'marketing-seo', 141900, '2026-03-30', 'affaan-m', now()),

-- ── Productivity ──────────────────────────────────────────────────────────
('https://github.com/affaan-m/everything-claude-code',
 'context-engineering',
 'Optimises Claude context window usage: summarises history, prunes redundancy, and structures information for maximum retention.',
 'productivity', 141900, '2026-03-29', 'affaan-m', now()),

('https://github.com/anthropics/skills',
 'planning-and-task-breakdown',
 'Decomposes complex projects into phased task lists with dependency mapping, time estimates, and risk flags.',
 'productivity', 118100, '2026-04-22', 'anthropics', now()),

('https://github.com/anthropics/skills',
 'task-management',
 'Manages in-session tasks with TodoWrite integration: tracks progress, marks completions, and surfaces blockers.',
 'productivity', 118100, '2026-04-22', 'anthropics', now()),

('https://github.com/affaan-m/everything-claude-code',
 'copy-editing',
 'Proofreads and improves prose for clarity, concision, active voice, and house style consistency.',
 'productivity', 141900, '2026-03-28', 'affaan-m', now());
