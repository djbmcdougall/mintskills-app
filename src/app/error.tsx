'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // TODO: pipe to error logging (Sentry / Vercel monitoring)
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-scale-2xl text-text font-semibold">
        Something broke.
      </p>
      <p className="text-text-2 text-scale-sm mt-3 max-w-sm">
        It&rsquo;s been logged. Try again or browse the catalogue.
      </p>
      <div className="flex items-center gap-4 mt-8">
        <button onClick={reset} className="btn-primary">
          Try again
        </button>
        <Link href="/browse" className="text-mint text-scale-sm font-mono hover:underline">
          Browse →
        </Link>
      </div>
    </div>
  )
}
