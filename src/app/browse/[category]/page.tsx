import { Suspense } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageHeader } from '@/components/ui/PageHeader'
import { SkillCard } from '@/components/ui/SkillCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { BrowseFilters } from '../_components/BrowseFilters'
import { SearchBar } from '../_components/SearchBar'
import { FIXTURE_LISTINGS } from '@/lib/fixtures/listings'
import { CATEGORY_LABELS, ALL_CATEGORY_SLUGS } from '@/lib/categories'

export function generateStaticParams() {
  return ALL_CATEGORY_SLUGS.map(slug => ({ category: slug }))
}

interface SearchParams {
  q?: string
  sort?: string
  page?: string
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>
  searchParams: Promise<SearchParams>
}) {
  const { category } = await params
  const sp = await searchParams

  const label = CATEGORY_LABELS[category]
  if (!label) notFound()

  const q = (sp.q ?? '').toLowerCase()
  const sort = sp.sort ?? 'trending'
  const page = Math.max(1, Number(sp.page ?? 1))
  const PAGE_SIZE = 12

  let filtered = FIXTURE_LISTINGS.filter(l => {
    if (l.category !== category) return false
    if (q && !l.title.toLowerCase().includes(q) && !l.description.toLowerCase().includes(q)) return false
    return true
  })

  if (sort === 'installed') filtered = [...filtered].sort((a, b) => b.installCount - a.installCount)
  else if (sort === 'rated') filtered = [...filtered].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
  else if (sort === 'newest') filtered = [...filtered].reverse()

  const totalCount = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function buildPageUrl(p: number) {
    const s = new URLSearchParams()
    if (sp.q) s.set('q', sp.q)
    if (sp.sort) s.set('sort', sp.sort)
    s.set('page', String(p))
    return `/browse/${category}?${s.toString()}`
  }

  return (
    <AppLayout>
      <div className="mb-8">
        <PageHeader eyebrow="Catalogue" title={label} />
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
              title={`No ${label} skills yet`}
              description="Be the first to list one, or browse other categories."
              action={
                <Link href="/browse" className="btn-secondary text-scale-sm">
                  Browse all
                </Link>
              }
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
                <Link href={buildPageUrl(currentPage - 1)} className="text-text-2 text-scale-sm font-mono hover:text-text transition-colors px-3 py-1 border border-border">
                  ← Prev
                </Link>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <Link key={p} href={buildPageUrl(p)} className={`text-scale-sm font-mono px-3 py-1 border transition-colors ${p === currentPage ? 'border-mint text-mint' : 'border-border text-text-3 hover:text-text-2'}`}>
                  {p}
                </Link>
              ))}
              {currentPage < totalPages && (
                <Link href={buildPageUrl(currentPage + 1)} className="text-text-2 text-scale-sm font-mono hover:text-text transition-colors px-3 py-1 border border-border">
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
