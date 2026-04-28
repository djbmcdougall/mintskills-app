interface RequestFixture {
  id: string
  title: string
  description: string
  upvoteCount: number
  status: 'open' | 'in_progress' | 'fulfilled'
  hasVoted: boolean
}

export const FIXTURE_REQUESTS: RequestFixture[] = [
  {
    id: 'req-001',
    title: 'Linear issue triage skill',
    description: 'Auto-label and prioritise incoming Linear issues based on content, affected area, and historical patterns.',
    upvoteCount: 148,
    status: 'in_progress',
    hasVoted: false,
  },
  {
    id: 'req-002',
    title: 'Figma to Tailwind converter',
    description: 'Export selected Figma frames and generate production-ready Tailwind CSS utility classes and component markup.',
    upvoteCount: 312,
    status: 'open',
    hasVoted: false,
  },
  {
    id: 'req-003',
    title: 'Sentry error root-cause analyser',
    description: 'Feed in a Sentry issue and get a ranked list of probable root causes with links to the relevant code paths.',
    upvoteCount: 97,
    status: 'open',
    hasVoted: false,
  },
  {
    id: 'req-004',
    title: 'Next.js App Router migration guide',
    description: 'Analyse a Next.js Pages Router project and output a step-by-step migration plan to App Router with file diffs.',
    upvoteCount: 204,
    status: 'fulfilled',
    hasVoted: false,
  },
  {
    id: 'req-005',
    title: 'Stripe webhook event handler generator',
    description: 'Given a Stripe product plan, scaffold all required webhook handlers with idempotency keys and error handling.',
    upvoteCount: 73,
    status: 'open',
    hasVoted: false,
  },
  {
    id: 'req-006',
    title: 'AWS CDK stack reviewer',
    description: 'Review CDK stacks for security misconfigurations, over-permissive IAM roles, and missing least-privilege constraints.',
    upvoteCount: 89,
    status: 'open',
    hasVoted: false,
  },
  {
    id: 'req-007',
    title: 'Changelog writer from git log',
    description: 'Parse git history between two tags and generate a structured, human-readable changelog grouped by change type.',
    upvoteCount: 55,
    status: 'in_progress',
    hasVoted: false,
  },
  {
    id: 'req-008',
    title: 'API rate limit calculator',
    description: 'Model your API endpoints, expected traffic patterns, and provider limits — outputs a recommended throttle configuration.',
    upvoteCount: 41,
    status: 'open',
    hasVoted: false,
  },
]
