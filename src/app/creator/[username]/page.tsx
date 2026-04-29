import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AppLayout } from '@/components/layout/AppLayout'
import { SkillCard } from '@/components/ui/SkillCard'
import { MintVerifiedBadge } from '@/components/ui/MintVerifiedBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { FIXTURE_LISTINGS } from '@/lib/fixtures/listings'

// ─── Fixture creators ─────────────────────────────────────────────────────────

interface CreatorProfile {
  username: string
  displayName: string
  bio: string
  memberSince: string
}

const CREATORS: Record<string, CreatorProfile> = {
  'alain-dupont':      { username: 'alain-dupont',      displayName: 'Alain Dupont',      bio: 'Security-first AI tooling. Creator of the GitHub PR Reviewer — 8k+ installs.', memberSince: 'January 2026' },
  'sarah-kim':         { username: 'sarah-kim',          displayName: 'Sarah Kim',          bio: 'Backend infrastructure and database tooling for production-grade AI pipelines.', memberSince: 'January 2026' },
  'marcus-webb':       { username: 'marcus-webb',        displayName: 'Marcus Webb',        bio: 'Frontend performance and accessibility. React specialist.', memberSince: 'February 2026' },
  'priya-nair':        { username: 'priya-nair',         displayName: 'Priya Nair',         bio: 'DevOps and infrastructure automation. Terraform and Kubernetes.', memberSince: 'February 2026' },
  'tom-fielding':      { username: 'tom-fielding',       displayName: 'Tom Fielding',       bio: 'API specification and documentation generation.', memberSince: 'February 2026' },
  'elena-torres':      { username: 'elena-torres',       displayName: 'Elena Torres',       bio: 'Database performance. SQL query analysis and optimisation.', memberSince: 'March 2026' },
  'james-okafor':      { username: 'james-okafor',       displayName: 'James Okafor',       bio: 'Testing and quality assurance. End-to-end and integration testing.', memberSince: 'March 2026' },
  'lena-fischer':      { username: 'lena-fischer',       displayName: 'Lena Fischer',       bio: 'DevOps tooling. Docker Compose and container orchestration.', memberSince: 'March 2026' },
  'dan-mercer':        { username: 'dan-mercer',         displayName: 'Dan Mercer',         bio: 'Developer productivity. Shell tooling and workflow automation.', memberSince: 'March 2026' },
  'yuki-tanaka':       { username: 'yuki-tanaka',        displayName: 'Yuki Tanaka',        bio: 'Git workflow automation and commit message generation.', memberSince: 'April 2026' },
  'amir-hassan':       { username: 'amir-hassan',        displayName: 'Amir Hassan',        bio: 'Security auditing and vulnerability scanning for AI codebases.', memberSince: 'April 2026' },
  'isabelle-laurent':  { username: 'isabelle-laurent',   displayName: 'Isabelle Laurent',   bio: 'Compliance and legal document analysis. GDPR and UK data protection.', memberSince: 'April 2026' },
  'ravi-sharma':       { username: 'ravi-sharma',        displayName: 'Ravi Sharma',        bio: 'Legal AI tooling. Contract analysis and compliance automation for SMBs and startups.', memberSince: 'April 2026' },
}

function initials(name: string): string {
  return name.split(' ').slice(0, 2).map(p => p[0]?.toUpperCase() ?? '').join('')
}

export default async function CreatorProfilePage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  const creator = CREATORS[username]

  if (!creator) notFound()

  // Match listings by creator display name
  const listings = FIXTURE_LISTINGS.filter(
    l => l.creatorName.toLowerCase().replace(/\s+/g, '-') === username && !l.isFree
  )

  // For ravi-sharma: show Legal Compliance Checker and a Contract Summariser stub
  const displayListings = username === 'ravi-sharma'
    ? FIXTURE_LISTINGS.filter(l =>
        l.slug === 'legal-compliance-checker' ||
        l.creatorName === 'Isabelle Laurent'
      ).slice(0, 2)
    : listings

  const hasVerified = displayListings.some(l => l.mintVerified)
  const totalDownloads = displayListings.reduce((sum, l) => sum + l.installCount, 0)

  function formatCount(n: number): string {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
    return String(n)
  }

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <div className="flex items-start gap-6 mb-10">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-surface-2 border border-border flex items-center justify-center flex-shrink-0">
            <span className="font-display font-semibold text-scale-xl text-text">
              {initials(creator.displayName)}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-display font-semibold text-scale-3xl text-text leading-tight">
                {creator.displayName}
              </h1>
              {hasVerified && <MintVerifiedBadge variant="full" size="md" />}
            </div>
            <p className="text-text-2 text-scale-base mt-2 max-w-xl">{creator.bio}</p>

            {/* Stats */}
            <div className="flex items-center gap-6 mt-4">
              <div>
                <span className="font-display font-semibold text-text text-scale-md">
                  {displayListings.length}
                </span>
                <span className="text-text-3 text-scale-xs font-mono ml-1.5">
                  {displayListings.length === 1 ? 'skill' : 'skills'}
                </span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div>
                <span className="font-display font-semibold text-text text-scale-md">
                  {formatCount(totalDownloads)}
                </span>
                <span className="text-text-3 text-scale-xs font-mono ml-1.5">downloads</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div>
                <span className="text-text-3 text-scale-xs font-mono">
                  Member since {creator.memberSince}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Listings */}
        <div>
          <p className="label-eyebrow mb-1">{creator.username}</p>
          <h2 className="font-display font-semibold text-scale-xl text-text mb-6">
            Verified skills
          </h2>

          {displayListings.length === 0 ? (
            <EmptyState
              title="No verified skills yet"
              description="This creator hasn't published any verified skills. Check back soon."
              action={
                <Link href="/browse" className="btn-primary">
                  Browse all skills
                </Link>
              }
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayListings.map(listing => (
                <SkillCard
                  key={listing.slug}
                  title={listing.title}
                  slug={listing.slug}
                  description={listing.description}
                  price={listing.price}
                  currency={listing.currency}
                  category={listing.category}
                  tags={listing.tags}
                  platforms={listing.platforms}
                  creatorName={listing.creatorName}
                  creatorAvatar={listing.creatorAvatar}
                  mintVerified={listing.mintVerified}
                  installCount={listing.installCount}
                  rating={listing.rating}
                  deliveryModel={listing.deliveryModel}
                  isFree={listing.isFree}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}

export async function generateStaticParams() {
  return Object.keys(CREATORS).map(username => ({ username }))
}
