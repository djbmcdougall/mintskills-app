'use client'

import { useState } from 'react'
import { ChevronUp } from 'lucide-react'

interface RequestCardProps {
  id: string
  title: string
  description: string
  upvoteCount: number
  status: 'open' | 'in_progress' | 'fulfilled'
  hasVoted: boolean
  onVote?: (id: string, newState: boolean) => void
}

const STATUS_LABEL: Record<RequestCardProps['status'], string> = {
  open:        'Open',
  in_progress: 'In progress',
  fulfilled:   'Fulfilled',
}

export function RequestCard({
  id,
  title,
  description,
  upvoteCount,
  status,
  hasVoted,
  onVote,
}: RequestCardProps) {
  const [voted, setVoted] = useState(hasVoted)
  const [count, setCount] = useState(upvoteCount)

  function handleVote() {
    const next = !voted
    setVoted(next)
    setCount(c => next ? c + 1 : Math.max(0, c - 1))
    onVote?.(id, next)
  }

  const statusClass =
    status === 'open'
      ? 'text-mint border-mint'
      : status === 'in_progress'
      ? 'text-amber-400 border-amber-400'
      : 'text-text-3 border-border-faint line-through'

  return (
    <div className="bg-surface border border-border p-5 flex gap-4">
      <button
        onClick={handleVote}
        aria-label={voted ? 'Remove upvote' : 'Upvote'}
        className={`flex flex-col items-center gap-0.5 flex-shrink-0 pt-0.5 transition-colors ${
          voted ? 'text-mint' : 'text-text-3 hover:text-text-2'
        }`}
      >
        <ChevronUp size={18} />
        <span className="text-scale-xs font-mono">{count}</span>
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className="text-scale-md font-display font-semibold text-text leading-tight">
            {title}
          </p>
          <span
            className={`flex-shrink-0 text-scale-xs font-mono border px-2 py-0.5 ${statusClass}`}
          >
            {STATUS_LABEL[status]}
          </span>
        </div>
        <p className="text-scale-sm text-text-2 mt-1 line-clamp-2">{description}</p>
      </div>
    </div>
  )
}
