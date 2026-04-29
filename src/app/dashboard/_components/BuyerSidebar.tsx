'use client'

import type React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, Download, KeyRound, Settings } from 'lucide-react'

interface BuyerSidebarProps {
  displayName: string
  avatar?: string
}

interface NavItem {
  href: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  label: string
  exact: boolean
}

const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard',           icon: ShoppingBag, label: 'Purchases',     exact: true },
  { href: '/dashboard/downloads', icon: Download,    label: 'Downloads',     exact: false },
  { href: '/dashboard/tokens',    icon: KeyRound,    label: 'Embed Tokens',  exact: false },
  { href: '/dashboard/settings',  icon: Settings,    label: 'Settings',      exact: false },
]

function initials(name: string) {
  return name.split(' ').slice(0, 2).map(p => p[0]?.toUpperCase() ?? '').join('')
}

export function BuyerSidebar({ displayName, avatar }: BuyerSidebarProps) {
  const pathname = usePathname()

  function isActive(href: string, exact: boolean) {
    if (exact) return pathname === href
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <aside className="fixed left-0 top-14 w-56 h-[calc(100vh-3.5rem)] bg-surface border-r border-border p-4 flex flex-col gap-1 z-40 overflow-y-auto">
      <div className="flex items-center gap-2.5 px-3 py-3 mb-2 border-b border-border-faint">
        {avatar ? (
          <img src={avatar} alt={displayName} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
        ) : (
          <span className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center text-text-3 text-scale-xs font-mono flex-shrink-0">
            {initials(displayName)}
          </span>
        )}
        <span className="text-text text-scale-sm truncate">{displayName}</span>
      </div>

      {NAV_ITEMS.map(item => {
        const active = isActive(item.href, item.exact)
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2.5 px-3 py-2 text-scale-sm transition-colors rounded-r border-l-2 ${
              active
                ? 'border-mint text-mint bg-mint-dim'
                : 'border-transparent text-text-2 hover:text-text hover:bg-surface-2'
            }`}
          >
            <Icon size={14} className="flex-shrink-0" />
            {item.label}
          </Link>
        )
      })}
    </aside>
  )
}
