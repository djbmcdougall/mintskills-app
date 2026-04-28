import type { ReactNode } from 'react'

interface PageHeaderProps {
  eyebrow: string
  title: string
  description?: string
  actions?: ReactNode
}

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-6">
      <div>
        <p className="label-eyebrow">{eyebrow}</p>
        <h1 className="font-display font-semibold text-scale-3xl text-text mt-1">{title}</h1>
        {description && (
          <p className="text-text-2 text-scale-base mt-2 max-w-2xl">{description}</p>
        )}
      </div>
      {actions && <div className="flex-shrink-0 pt-1">{actions}</div>}
    </div>
  )
}
