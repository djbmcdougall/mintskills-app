import { Suspense } from 'react'
import Link from 'next/link'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageHeader } from '@/components/ui/PageHeader'
import { SkillCard } from '@/components/ui/SkillCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { BrowseFilters } from './_components/BrowseFilters'
import { SearchBar } from './_components/SearchBar'
import { FIXTURE_LISTINGS } from '@/lib/fixtures/listings'

import type { ListingFixture } from '@/lib/fixtures/listings'

const FREE_SKILLS: ListingFixture[] = [
  {
    title: 'Frontend Design Assistant',
    slug: 'frontend-design',
    description: 'Anthropic\'s official frontend design skill for generating accessible, responsive UI components using modern CSS.',
    price: 0, currency: 'GBP',
    category: 'frontend',
    tags: ['css', 'accessibility', 'responsive'],
    platforms: ['claude-code', 'cursor'],
    creatorName: 'Anthropic',
    mintVerified: false,
    installCount: 8420,
    deliveryModel: 'source_download' as const,
    isFree: true,
  },
  {
    title: 'Cursor Rules Starter Pack',
    slug: 'cursor-rules-starter',
    description: 'Battle-tested .cursorrules for TypeScript monorepos — enforces naming conventions, import order, and test requirements.',
    price: 0, currency: 'GBP',
    category: 'config_files',
    tags: ['cursor', 'rules', 'typescript'],
    platforms: ['cursor'],
    creatorName: 'Dan Mercer',
    mintVerified: false,
    installCount: 3201,
    deliveryModel: 'source_download' as const,
    isFree: true,
  },
  {
    title: 'Git Commit Message Writer',
    slug: 'git-commit-message-writer',
    description: 'Analyses staged diffs and generates conventional commit messages grouped by change type and impact area.',
    price: 0, currency: 'GBP',
    category: 'git',
    tags: ['git', 'conventional-commits', 'productivity'],
    platforms: ['claude-code', 'cursor', 'windsurf'],
    creatorName: 'Yuki Tanaka',
    mintVerified: false,
    installCount: 5480,
    deliveryModel: 'source_download' as const,
    isFree: true,
  },
  {
    title: 'Python Type Hint Generator',
    slug: 'python-type-hints',
    description: 'Analyses Python function signatures and adds accurate type hints using mypy-compatible annotations throughout your codebase.',
    price: 0, currency: 'GBP',
    category: 'backend',
    tags: ['python', 'types', 'mypy'],
    platforms: ['claude-code', 'cursor'],
    creatorName: 'Mei Zhang',
    mintVerified: false,
    installCount: 2190,
    deliveryModel: 'source_download' as const,
    isFree: true,
  },
  {
    title: 'Shell Alias Toolkit',
    slug: 'shell-alias-toolkit',
    description: 'Opinionated set of shell aliases and functions for common dev workflows — git, docker, and directory navigation.',
    price: 0, currency: 'GBP',
    category: 'productivity',
    tags: ['shell', 'bash', 'aliases'],
    platforms: ['claude-code'],
    creatorName: 'Omar Shaikh',
    mintVerified: false,
    installCount: 1340,
    deliveryModel: 'source_download' as const,
    isFree: true,
  },
  {
    title: 'README Generator',
    slug: 'readme-generator',
    description: 'Reads your project structure, package.json, and existing docs to generate a polished, complete README.md.',
    price: 0, currency: 'GBP',
    category: 'docs',
    tags: ['docs', 'markdown', 'readme'],
    platforms: ['claude-code', 'cursor', 'codex'],
    creatorName: 'Sofia Rossi',
    mintVerified: false,
    installCount: 4780,
    deliveryModel: 'source_download' as const,
    isFree: true,
  },
]

const PAGE_SIZE = 12

interface SearchParams {
  q?: string
  type?: string
  category?: string
  price_min?: string
  price_max?: string
  platform?: string
  sort?: string
  page?: string
}

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams

  const type = params.type === 'free' ? 'free' : 'paid'
  const q = (params.q ?? '').toLowerCase()
  const activeCategories = params.category?.split(',').filter(Boolean) ?? []
  const activePlatforms = params.platform?.split(',').filter(Boolean) ?? []
  const priceMin = params.price_min ? Number(params.price_min) : 0
  const priceMax = params.price_max ? Number(params.price_max) : Infinity
  const sort = params.sort ?? 'trending'
  const page = Math.max(1, Number(params.page ?? 1))

  const sourceList = type === 'free' ? FREE_SKILLS : FIXTURE_LISTINGS.filter(l => !l.isFree)

  let filtered = sourceList.filter(listing => {
    if (q && !listing.title.toLowerCase().includes(q) && !listing.description.toLowerCase().includes(q)) return false
    if (activeCategories.length && !activeCategories.includes(listing.category)) return false
    if (activePlatforms.length && !listing.platforms.some(p => activePlatforms.includes(p))) return false
    if (type === 'paid') {
      if (listing.price < priceMin) return false
      if (listing.price > priceMax) return false
    }
    return true
  })

  // Sort
  if (sort === 'installed') {
    filtered = [...filtered].sort((a, b) => b.installCount - a.installCount)
  } else if (sort === 'rated') {
    filtered = [...filtered].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
  } else if (sort === 'newest') {
    filtered = [...filtered].reverse()
  }
  // 'trending' keeps default order

  const totalCount = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function buildPageUrl(p: number) {
    const sp = new URLSearchParams()
    if (params.q) sp.set('q', params.q)
    if (params.type) sp.set('type', params.type)
    if (params.category) sp.set('category', params.category)
    if (params.price_min) sp.set('price_min', params.price_min)
    if (params.price_max) sp.set('price_max', params.price_max)
    if (params.platform) sp.set('platform', params.platform)
    if (params.sort) sp.set('sort', params.sort)
    sp.set('page', String(p))
    return `/browse?${sp.toString()}`
  }

  return (
    <AppLayout>
      <div className="mb-8">
        <PageHeader eyebrow="Catalogue" title="Verified skills. One install." />
        <div className="mt-6">
          <Suspense fallback={null}>
            <SearchBar />
          </Suspense>
        </div>
      </div>

      <div className="flex gap-0 -mx-6">
        <Suspense fallback={
          <aside className="w-60 flex-shrink-0 bg-surface border-r border-border p-5 h-screen sticky top-16">
            <div className="flex justify-center pt-8">
              <LoadingSpinner size="sm" />
            </div>
          </aside>
        }>
          <BrowseFilters />
        </Suspense>

        <div className="flex-1 p-6 min-w-0">
          <p className="text-text-2 text-scale-sm mb-4">
            Showing {totalCount} {totalCount === 1 ? 'skill' : 'skills'}
          </p>

          {paged.length === 0 ? (
            <EmptyState
              title="No skills found"
              description="Try adjusting your filters or search term."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {paged.map(listing => (
                <SkillCard key={listing.slug} {...listing} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center gap-2 mt-10 pt-6 border-t border-border">
              {currentPage > 1 && (
                <Link
                  href={buildPageUrl(currentPage - 1)}
                  className="text-text-2 text-scale-sm font-mono hover:text-text transition-colors px-3 py-1 border border-border hover:border-border"
                >
                  ← Prev
                </Link>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <Link
                  key={p}
                  href={buildPageUrl(p)}
                  className={`text-scale-sm font-mono px-3 py-1 border transition-colors ${
                    p === currentPage
                      ? 'border-mint text-mint'
                      : 'border-border text-text-3 hover:border-border hover:text-text-2'
                  }`}
                >
                  {p}
                </Link>
              ))}
              {currentPage < totalPages && (
                <Link
                  href={buildPageUrl(currentPage + 1)}
                  className="text-text-2 text-scale-sm font-mono hover:text-text transition-colors px-3 py-1 border border-border"
                >
                  Next →
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
