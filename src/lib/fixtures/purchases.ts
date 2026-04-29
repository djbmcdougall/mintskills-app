export interface PurchaseFixture {
  id: string
  slug: string
  title: string
  creator: string
  amount: string
  licence: string
  date: string
  refundable: boolean
}

export const FIXTURE_PURCHASES: PurchaseFixture[] = [
  {
    id: 'pur-001',
    slug: 'github-pr-reviewer',
    title: 'GitHub PR Reviewer',
    creator: 'Alain Dupont',
    amount: '£29',
    licence: 'Embed',
    date: '20 Apr 2026',
    refundable: false,
  },
  {
    id: 'pur-002',
    slug: 'supabase-schema-migrator',
    title: 'Supabase Schema Migrator',
    creator: 'Sarah Kim',
    amount: '£48',
    licence: 'Source',
    date: '18 Apr 2026',
    refundable: false,
  },
  {
    id: 'pur-003',
    slug: 'react-component-auditor',
    title: 'React Component Auditor',
    creator: 'Marcus Webb',
    amount: '£15',
    licence: 'Embed',
    date: '15 Apr 2026',
    refundable: false,
  },
  {
    id: 'pur-004',
    slug: 'terraform-plan-explainer',
    title: 'Terraform Plan Explainer',
    creator: 'Priya Nair',
    amount: '£168',
    licence: 'Extended',
    date: '10 Apr 2026',
    refundable: false,
  },
  {
    id: 'pur-005',
    slug: 'openapi-spec-generator',
    title: 'OpenAPI Spec Generator',
    creator: 'Tom Fielding',
    amount: '£18',
    licence: 'Embed',
    date: '5 Apr 2026',
    refundable: false,
  },
  {
    id: 'pur-006',
    slug: 'sql-query-optimiser',
    title: 'SQL Query Optimiser',
    creator: 'Elena Torres',
    amount: '£55',
    licence: 'Source',
    date: '28 Apr 2026',
    refundable: true,
  },
]

export const FIXTURE_TOKENS = [
  {
    id: 'tok-001',
    tokenId: 'ems_8f3a2b1c',
    skill: 'GitHub PR Reviewer',
    slug: 'github-pr-reviewer',
    domains: ['app.company.com', 'staging.company.com'],
    status: 'active' as const,
    lastUsed: '27 Apr 2026',
  },
  {
    id: 'tok-002',
    tokenId: 'ems_c4d9e7f2',
    skill: 'Supabase Schema Migrator',
    slug: 'supabase-schema-migrator',
    domains: ['dashboard.acme.io'],
    status: 'active' as const,
    lastUsed: '25 Apr 2026',
  },
  {
    id: 'tok-003',
    tokenId: 'ems_a1b2c3d4',
    skill: 'OpenAPI Spec Generator',
    slug: 'openapi-spec-generator',
    domains: ['docs.startup.com'],
    status: 'revoked' as const,
    lastUsed: '10 Apr 2026',
  },
  {
    id: 'tok-004',
    tokenId: 'ems_f5e6d7c8',
    skill: 'Terraform Plan Explainer',
    slug: 'terraform-plan-explainer',
    domains: ['infra.corp.net'],
    status: 'active' as const,
    lastUsed: '22 Apr 2026',
  },
]
