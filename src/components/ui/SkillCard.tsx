import Link from 'next/link'
import { MintVerifiedBadge } from './MintVerifiedBadge'
import { CategoryBadge } from './CategoryBadge'
import { GitFork } from 'lucide-react'

interface SkillCardProps {
  title: string
  slug: string
  description: string
  price: number
  currency?: string
  category: string
  tags: string[]
  platforms: string[]
  creatorName: string
  creatorAvatar?: string
  mintVerified: boolean
  installCount: number
  rating?: number
  deliveryModel: 'embed' | 'source_download' | 'extended_commercial'
  isFree?: boolean
}

function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(p => p[0]?.toUpperCase() ?? '')
    .join('')
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

export function SkillCard({
  title,
  slug,
  description,
  price,
  currency = 'GBP',
  category,
  tags,
  creatorName,
  creatorAvatar,
  mintVerified,
  installCount,
  rating,
  isFree = false,
}: SkillCardProps) {
  void currency
  const href = isFree ? `/listing/free/${slug}` : `/listing/${slug}`

  return (
    <Link
      href={href}
      className="block bg-surface border border-border hover:border-mint transition-colors duration-200 p-5 animate-fade-up"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          {creatorAvatar ? (
            <img
              src={creatorAvatar}
              alt={creatorName}
              className="w-8 h-8 rounded-full flex-shrink-0 object-cover"
            />
          ) : (
            <span className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center text-text-3 text-scale-xs font-mono flex-shrink-0">
              {initials(creatorName)}
            </span>
          )}
          <span className="text-text-2 text-scale-sm truncate">{creatorName}</span>
        </div>

        <div className="flex-shrink-0">
          {isFree ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-scale-xs font-mono bg-surface-2 border border-border-faint text-text-3">
              <GitFork size={10} className="flex-shrink-0" />
              Open source
            </span>
          ) : mintVerified ? (
            <MintVerifiedBadge size="sm" />
          ) : null}
        </div>
      </div>

      <p className="text-scale-md font-display font-semibold text-text mt-3 leading-tight">
        {title}
      </p>
      <p className="text-scale-sm text-text-2 line-clamp-2 mt-1">{description}</p>

      <div className="flex flex-wrap gap-1 mt-3">
        <CategoryBadge category={category} size="sm" />
        {tags.map(tag => (
          <span
            key={tag}
            className="bg-surface-2 border border-border-faint text-text-3 text-scale-xs px-2 py-0.5 font-mono"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between mt-4">
        <span className="text-text-3 text-scale-xs font-mono">
          {formatCount(installCount)} installs
          {rating !== undefined && (
            <> · {rating.toFixed(1)} ★</>
          )}
        </span>

        {isFree ? (
          <span className="text-text-3 font-display font-semibold text-scale-sm">Free</span>
        ) : (
          <span className="text-mint font-display font-semibold text-scale-md">
            £{price.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </span>
        )}
      </div>
    </Link>
  )
}
