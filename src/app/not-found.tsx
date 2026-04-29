import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-scale-4xl text-mint font-semibold leading-none">404</p>
      <p className="font-display text-scale-xl text-text mt-2">
        This skill doesn&rsquo;t exist. Yet.
      </p>
      <p className="text-text-3 text-scale-sm font-mono mt-4 max-w-xs">
        It may have been removed, renamed, or it never existed in the first place.
      </p>
      <Link href="/browse" className="text-mint text-scale-sm font-mono mt-6 hover:underline">
        Back to browse →
      </Link>
    </div>
  )
}
