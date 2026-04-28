import Link from 'next/link'
import { FIXTURE_LISTINGS } from '@/lib/fixtures/listings'
import { CATEGORY_LABELS } from '@/lib/categories'

type ListingStatus = 'verified' | 'pending' | 'draft'

const LISTING_ROWS = FIXTURE_LISTINGS.filter(l => !l.isFree).slice(0, 5).map((l, i) => ({
  ...l,
  status: (i === 0 ? 'verified' : i === 3 ? 'pending' : i === 4 ? 'draft' : 'verified') as ListingStatus,
  downloads: [127, 96, 34, 12, 0][i] ?? 0,
  revenue: [
    `£${(l.price * 2.5 * ([127, 96, 34, 12, 0][i] ?? 0) * 0.8).toFixed(0)}`,
    '£6,912', '£816', '£288', '£0',
  ][i] ?? '£0',
}))

function StatusBadge({ status }: { status: ListingStatus }) {
  if (status === 'verified') {
    return <span className="badge-verified">Verified</span>
  }
  if (status === 'pending') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 text-scale-xs font-mono border border-amber-600 text-amber-400">
        Pending
      </span>
    )
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 text-scale-xs font-mono border border-border text-text-3">
      Draft
    </span>
  )
}

export default function ListingsPage() {
  return (
    <div>
      <div className="flex items-start justify-between gap-6 mb-8">
        <div>
          <p className="label-eyebrow">My Listings</p>
          <h1 className="font-display font-semibold text-scale-2xl text-text mt-1">Manage listings</h1>
        </div>
        <Link href="/creator/new" className="btn-primary flex-shrink-0">
          Add new listing
        </Link>
      </div>

      <div className="bg-surface border border-border overflow-x-auto">
        <table className="w-full text-scale-sm">
          <thead>
            <tr className="border-b border-border">
              {['Name', 'Category', 'Price', 'Status', 'Downloads', 'Revenue', 'Actions'].map(col => (
                <th key={col} className="text-left text-text-3 text-scale-xs font-mono uppercase px-4 py-3 whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {LISTING_ROWS.map(row => (
              <tr key={row.slug} className="border-b border-border-faint last:border-b-0 hover:bg-surface-2 transition-colors">
                <td className="px-4 py-3">
                  <Link
                    href={`/listing/${row.slug}`}
                    className="text-text font-display font-semibold hover:text-mint transition-colors whitespace-nowrap"
                  >
                    {row.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-text-3 font-mono text-scale-xs whitespace-nowrap">
                  {CATEGORY_LABELS[row.category] ?? row.category}
                </td>
                <td className="px-4 py-3 text-mint font-display font-semibold whitespace-nowrap">
                  £{row.price}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={row.status} />
                </td>
                <td className="px-4 py-3 text-text-2 font-mono text-scale-xs text-right">
                  {row.downloads.toLocaleString('en-GB')}
                </td>
                <td className="px-4 py-3 text-mint font-display font-semibold whitespace-nowrap">
                  {row.revenue}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/creator/dashboard/listings/${row.slug}/edit`}
                    className="text-text-3 text-scale-xs font-mono hover:text-mint transition-colors"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
