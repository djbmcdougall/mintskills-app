'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { CATEGORY_LABELS, DEV_CATEGORIES, COWORK_CATEGORIES, PLATFORMS } from '@/lib/categories'

type SortOption = 'trending' | 'newest' | 'installed' | 'rated'

export function BrowseFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const type = searchParams.get('type') ?? 'paid'
  const activeCategories = searchParams.get('category')?.split(',').filter(Boolean) ?? []
  const activePlatforms = searchParams.get('platform')?.split(',').filter(Boolean) ?? []
  const priceMin = searchParams.get('price_min') ?? ''
  const priceMax = searchParams.get('price_max') ?? ''
  const sort = (searchParams.get('sort') ?? 'trending') as SortOption

  const update = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === '') {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      }
      params.delete('page')
      router.push(`/browse?${params.toString()}`)
    },
    [router, searchParams],
  )

  function setType(value: 'paid' | 'free') {
    update({ type: value, category: null, price_min: null, price_max: null })
  }

  function toggleCategory(slug: string) {
    const next = activeCategories.includes(slug)
      ? activeCategories.filter(c => c !== slug)
      : [...activeCategories, slug]
    update({ category: next.length ? next.join(',') : null })
  }

  function togglePlatform(value: string) {
    const next = activePlatforms.includes(value)
      ? activePlatforms.filter(p => p !== value)
      : [...activePlatforms, value]
    update({ platform: next.length ? next.join(',') : null })
  }

  function clearAll() {
    router.push('/browse')
  }

  const devCats = DEV_CATEGORIES as readonly string[]
  const coworkCats = COWORK_CATEGORIES as readonly string[]

  return (
    <aside className="w-60 flex-shrink-0 bg-surface border-r border-border p-5 h-screen sticky top-16 overflow-y-auto flex flex-col gap-6">
      {/* Type toggle */}
      <div className="flex gap-1">
        <button
          onClick={() => setType('paid')}
          className={`flex-1 py-1.5 text-scale-xs font-mono transition-colors border ${
            type === 'paid'
              ? 'bg-mint text-bg border-mint'
              : 'text-text-3 border-border-faint hover:border-border hover:text-text-2'
          }`}
        >
          Paid — Mint Verified
        </button>
        <button
          onClick={() => setType('free')}
          className={`flex-1 py-1.5 text-scale-xs font-mono transition-colors border ${
            type === 'free'
              ? 'bg-mint text-bg border-mint'
              : 'text-text-3 border-border-faint hover:border-border hover:text-text-2'
          }`}
        >
          Free — GitHub
        </button>
      </div>

      {/* Category */}
      <div>
        <p className="label-eyebrow mb-3">Category</p>
        <p className="text-text-3 text-scale-xs font-mono mb-2 mt-3">Developer</p>
        <div className="flex flex-col gap-1.5">
          {devCats.map(slug => (
            <label key={slug} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={activeCategories.includes(slug)}
                onChange={() => toggleCategory(slug)}
                className="w-3 h-3 accent-mint"
              />
              <span className="text-text-2 text-scale-xs font-mono group-hover:text-text transition-colors">
                {CATEGORY_LABELS[slug]}
              </span>
            </label>
          ))}
        </div>
        <p className="text-text-3 text-scale-xs font-mono mb-2 mt-4">Cowork / Knowledge worker</p>
        <div className="flex flex-col gap-1.5">
          {coworkCats.map(slug => (
            <label key={slug} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={activeCategories.includes(slug)}
                onChange={() => toggleCategory(slug)}
                className="w-3 h-3 accent-mint"
              />
              <span className="text-text-2 text-scale-xs font-mono group-hover:text-text transition-colors">
                {CATEGORY_LABELS[slug]}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price range — only show for paid */}
      {type === 'paid' && (
        <div>
          <p className="label-eyebrow mb-3">Price</p>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-text-3 text-scale-xs font-mono">£</span>
              <input
                type="number"
                min={0}
                placeholder="Min"
                value={priceMin}
                onChange={e => update({ price_min: e.target.value || null })}
                className="w-full bg-bg border border-border text-text text-scale-xs font-mono pl-5 pr-2 py-1.5 focus:outline-none focus:border-mint transition-colors"
              />
            </div>
            <span className="text-text-3 text-scale-xs font-mono">–</span>
            <div className="relative flex-1">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-text-3 text-scale-xs font-mono">£</span>
              <input
                type="number"
                min={0}
                placeholder="Max"
                value={priceMax}
                onChange={e => update({ price_max: e.target.value || null })}
                className="w-full bg-bg border border-border text-text text-scale-xs font-mono pl-5 pr-2 py-1.5 focus:outline-none focus:border-mint transition-colors"
              />
            </div>
          </div>
        </div>
      )}

      {/* Platform */}
      <div>
        <p className="label-eyebrow mb-3">Platform</p>
        <div className="flex flex-col gap-1.5">
          {PLATFORMS.map(p => (
            <label key={p.value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={activePlatforms.includes(p.value)}
                onChange={() => togglePlatform(p.value)}
                className="w-3 h-3 accent-mint"
              />
              <span className="text-text-2 text-scale-xs font-mono group-hover:text-text transition-colors">
                {p.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <p className="label-eyebrow mb-3">Sort</p>
        <select
          value={sort}
          onChange={e => update({ sort: e.target.value })}
          className="w-full bg-bg border border-border text-text-2 text-scale-xs font-mono px-2 py-1.5 focus:outline-none focus:border-mint transition-colors"
        >
          <option value="trending">Trending</option>
          <option value="newest">Newest</option>
          <option value="installed">Most Installed</option>
          <option value="rated">Best Rated</option>
        </select>
      </div>

      <button
        onClick={clearAll}
        className="text-text-3 text-scale-xs font-mono hover:text-text-2 transition-colors text-left mt-auto"
      >
        Clear all filters
      </button>
    </aside>
  )
}
