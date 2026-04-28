'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { Search } from 'lucide-react'

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const params = new URLSearchParams(searchParams.toString())
      if (e.target.value) {
        params.set('q', e.target.value)
      } else {
        params.delete('q')
      }
      params.delete('page')
      router.push(`/browse?${params.toString()}`)
    },
    [router, searchParams],
  )

  return (
    <div className="relative w-full">
      <Search
        size={14}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-text-3 pointer-events-none"
      />
      <input
        type="search"
        defaultValue={searchParams.get('q') ?? ''}
        onChange={handleChange}
        placeholder="Search verified skills or describe what you need..."
        className="w-full bg-surface border border-border text-text placeholder:text-text-3 text-scale-sm font-body pl-10 pr-4 py-3 focus:outline-none focus:border-mint transition-colors"
      />
    </div>
  )
}
