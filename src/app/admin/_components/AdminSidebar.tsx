'use client'

import type React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ShieldCheck, AlertTriangle, Users } from 'lucide-react'

interface NavItem {
  href: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  label: string
  exact: boolean
}

const NAV_ITEMS: NavItem[] = [
  { href: '/admin',            icon: LayoutDashboard, label: 'Overview',          exact: true },
  { href: '/admin/moderation', icon: ShieldCheck,     label: 'Moderation Queue',  exact: false },
  { href: '/admin/violations', icon: AlertTriangle,   label: 'Violations',        exact: false },
  { href: '/admin/users',      icon: Users,           label: 'Users',             exact: false },
]

export function AdminSidebar() {
  const pathname = usePathname()

  function isActive(href: string, exact: boolean) {
    if (exact) return pathname === href
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <aside className="fixed left-0 top-14 w-56 h-[calc(100vh-3.5rem)] bg-surface border-r border-border p-4 flex flex-col gap-1 z-40">
      <div className="px-3 py-2 mb-2 border-b border-border-faint">
        <p className="text-text-3 text-scale-xs font-mono uppercase tracking-wider">Admin panel</p>
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
