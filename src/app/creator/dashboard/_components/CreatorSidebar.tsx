'use client'

import type React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Package, PlusCircle,
  DollarSign, MessageSquare, Settings,
} from 'lucide-react'

interface CreatorSidebarProps {
  displayName: string
  avatar?: string
}

interface NavItem {
  href: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  label: string
  exact: boolean
  accent?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { href: '/creator/dashboard',          icon: LayoutDashboard, label: 'Overview',        exact: true },
  { href: '/creator/dashboard/listings', icon: Package,          label: 'My Listings',    exact: false },
  { href: '/creator/new',                icon: PlusCircle,       label: 'New Listing',    exact: false, accent: true },
  { href: '/creator/dashboard/earnings', icon: DollarSign,       label: 'Earnings',       exact: false },
  { href: '/requests',                   icon: MessageSquare,    label: 'Skill Requests', exact: false },
  { href: '/creator/dashboard/settings', icon: Settings,         label: 'Settings',       exact: false },
]

function initials(name: string) {
  return name.split(' ').slice(0, 2).map(p => p[0]?.toUpperCase() ?? '').join('')
}

export function CreatorSidebar({ displayName, avatar }: CreatorSidebarProps) {
  const pathname = usePathname()

  function isActive(href: string, exact: boolean) {
    if (exact) return pathname === href
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <aside className="fixed left-0 top-14 w-56 h-[calc(100vh-3.5rem)] bg-surface border-r border-border p-4 flex flex-col gap-1 z-40 overflow-y-auto">
      {/* Creator identity */}
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

      {/* Nav */}
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
                : item.accent
                ? 'border-transparent text-mint hover:bg-mint-dim'
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
