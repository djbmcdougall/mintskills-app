import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Star, GitFork, ExternalLink } from 'lucide-react'
import { AppLayout } from '@/components/layout/AppLayout'
import { CategoryBadge } from '@/components/ui/CategoryBadge'
import { PlatformBadge } from '@/components/ui/PlatformBadge'
import { CATEGORY_LABELS } from '@/lib/categories'

interface FreeListing {
  title: string
  slug: string
  description: string
  longDescription: string
  category: string
  tags: string[]
  platforms: string[]
  creatorName: string
  repoUrl: string
  stars: number
  lastUpdated: string
  licence: string
  version: string
}

const FREE_LISTINGS: Record<string, FreeListing> = {
  'frontend-design': {
    title: 'Frontend Design Assistant',
    slug: 'frontend-design',
    description: 'Anthropic\'s official frontend design skill for generating accessible, responsive UI components using modern CSS.',
    longDescription: `The Frontend Design Assistant is Anthropic's reference skill for UI generation. It produces accessible, semantically correct HTML with modern CSS — no frameworks required.

The skill follows WCAG 2.2 AA standards by default and includes ARIA roles, focus management, and colour contrast checking in every component it generates. Output is framework-agnostic: the same prompts work whether you're in a React, Vue, or plain HTML project.

Designed for design-to-code workflows where accuracy and accessibility matter more than speed.`,
    category: 'frontend',
    tags: ['css', 'accessibility', 'responsive', 'html'],
    platforms: ['claude-code', 'cursor'],
    creatorName: 'Anthropic',
    repoUrl: 'https://github.com/anthropics/claude-code-skills',
    stars: 2840,
    lastUpdated: '21 Apr 2026',
    licence: 'MIT Licence',
    version: 'v2.1.0',
  },
}

function Stars({ count }: { count: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={12}
          className={i < Math.round(count / 500) ? 'text-mint fill-mint' : 'text-text-3'}
        />
      ))}
    </span>
  )
}

function initials(name: string) {
  return name.split(' ').slice(0, 2).map(p => p[0]?.toUpperCase() ?? '').join('')
}

export default async function FreeListing({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const listing = FREE_LISTINGS[slug]
  if (!listing) notFound()

  const categoryLabel = CATEGORY_LABELS[listing.category] ?? listing.category

  return (
    <AppLayout>
      {/* Warning banner */}
      <div className="-mx-6 -mt-10 mb-8 bg-amber-950/30 border-b border-amber-700 text-amber-400 text-scale-sm p-3 text-center">
        This is a free open source skill. It has not been Mint Verified. Review the code before installing.{' '}
        <Link href="/browse" className="underline hover:no-underline ml-1">
          What is Mint Verified? →
        </Link>
      </div>

      {/* Breadcrumb */}
      <nav className="font-mono text-scale-xs text-text-3 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-text-2 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/browse?type=free" className="hover:text-text-2 transition-colors">Free Skills</Link>
        <span>/</span>
        <Link href={`/browse/${listing.category}?type=free`} className="hover:text-text-2 transition-colors">{categoryLabel}</Link>
        <span>/</span>
        <span className="text-text-2">{listing.title}</span>
      </nav>

      <div className="mt-8 flex flex-col lg:flex-row gap-10 items-start">
        {/* LEFT COLUMN */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <GitFork size={14} className="text-text-3" />
            <span className="text-text-3 text-scale-xs font-mono">Open source</span>
          </div>

          <h1 className="font-display font-bold text-scale-3xl text-text leading-tight">
            {listing.title}
          </h1>

          {/* Creator row */}
          <div className="flex items-center gap-3 mt-4">
            <span className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center text-text-3 text-scale-xs font-mono flex-shrink-0">
              {initials(listing.creatorName)}
            </span>
            <span className="text-text-2 text-scale-sm">{listing.creatorName}</span>
          </div>

          {/* Description */}
          <div className="mt-6 text-text text-scale-base leading-relaxed max-w-prose">
            {listing.longDescription.split('\n\n').map((para, i) => (
              <p key={i} className={i > 0 ? 'mt-4' : ''}>{para}</p>
            ))}
          </div>

          {/* Platforms */}
          <div className="flex flex-wrap gap-1.5 mt-4">
            {listing.platforms.map(p => (
              <PlatformBadge key={p} platform={p} />
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            <CategoryBadge category={listing.category} size="sm" />
            {listing.tags.map(tag => (
              <span key={tag} className="bg-surface-2 border border-border-faint text-text-3 text-scale-xs px-2 py-0.5 font-mono">
                {tag}
              </span>
            ))}
          </div>

          {/* Version */}
          <p className="font-mono text-scale-xs text-text-3 mt-3">
            {listing.version} · Updated {listing.lastUpdated}
          </p>
        </div>

        {/* RIGHT COLUMN */}
        <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 lg:sticky lg:top-24 flex flex-col gap-4">
          <a
            href={listing.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full text-center flex items-center justify-center gap-2"
          >
            View on GitHub
            <ExternalLink size={14} />
          </a>

          <div className="flex items-center gap-2">
            <Star size={14} className="text-text-2" />
            <span className="text-text-2 text-scale-sm font-mono">
              {listing.stars.toLocaleString('en-GB')} stars
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-text-3 text-scale-sm">
              Last updated: {listing.lastUpdated}
            </p>
            <p className="text-text-3 text-scale-sm">{listing.licence}</p>
          </div>

          <div className="bg-bg border border-border-faint p-4">
            <p className="text-text-3 text-scale-xs font-mono mb-2">Install</p>
            <code className="text-text-2 text-scale-xs font-mono block break-all">
              git clone {listing.repoUrl}{' '}
              ~/.claude/skills/{listing.slug}
            </code>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
