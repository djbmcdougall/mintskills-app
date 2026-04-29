import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageHeader } from '@/components/ui/PageHeader'
import { SkillCard } from '@/components/ui/SkillCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { BrowseFilters } from '@/app/browse/_components/BrowseFilters'
import { FIXTURE_LISTINGS } from '@/lib/fixtures/listings'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; sort?: string }>
}) {
  const { q, category, sort } = await searchParams

  if (!q?.trim()) redirect('/browse')

  const query = q.trim().toLowerCase()

  // Filter fixture listings by search query
  let results = FIXTURE_LISTINGS.filter(l => {
    const haystack = `${l.title} ${l.description} ${l.tags.join(' ')} ${l.creatorName}`.toLowerCase()
    return haystack.includes(query)
  }).filter(l => !l.isFree)

  // Apply category filter
  if (category) {
    results = results.filter(l => l.category === category)
  }

  // Apply sort
  if (sort === 'newest') {
    // Fixture data — stable order preserved
  } else if (sort === 'rating') {
    results = [...results].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
  } else {
    results = [...results].sort((a, b) => b.installCount - a.installCount)
  }

  return (
    <AppLayout>
      <div className="mb-8">
        <PageHeader
          eyebrow="Search"
          title={`Results for "${q}"`}
          description={
            results.length > 0
              ? `${results.length} skill${results.length === 1 ? '' : 's'} found`
              : undefined
          }
        />
      </div>

      <div className="flex gap-8 items-start">
        {/* Sidebar */}
        <aside className="w-52 flex-shrink-0 hidden lg:block">
          <Suspense fallback={<LoadingSpinner />}>
            <BrowseFilters />
          </Suspense>
        </aside>

        {/* Results */}
        <div className="flex-1 min-w-0">
          {results.length === 0 ? (
            <EmptyState
              title="No skills matched your search"
              description={`We couldn't find any verified skills matching "${q}". Try a broader search term or browse by category.`}
              action={
                <Link href="/browse" className="btn-primary">
                  Browse all skills
                </Link>
              }
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {results.map(listing => (
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
