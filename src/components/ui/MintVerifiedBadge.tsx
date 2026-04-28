import { ShieldCheck } from 'lucide-react'

interface MintVerifiedBadgeProps {
  variant?: 'full' | 'icon' | 'text'
  size?: 'sm' | 'md'
}

export function MintVerifiedBadge({ variant = 'full', size = 'sm' }: MintVerifiedBadgeProps) {
  const iconSize = size === 'sm' ? 11 : 13
  const textClass = size === 'sm' ? 'text-scale-xs' : 'text-scale-sm'

  if (variant === 'icon') {
    return <ShieldCheck size={iconSize} className="text-mint" aria-label="Mint Verified" />
  }

  if (variant === 'text') {
    return (
      <span className={`text-mint font-mono ${textClass}`}>Mint Verified</span>
    )
  }

  return (
    <span className={`badge-verified ${textClass}`}>
      <ShieldCheck size={iconSize} />
      Mint Verified
    </span>
  )
}
