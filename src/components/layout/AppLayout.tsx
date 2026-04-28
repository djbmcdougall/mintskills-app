'use client'

import Link from 'next/link'
import { useState } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { ChevronDown, LogOut, LayoutDashboard, PlusCircle, Settings } from 'lucide-react'

interface AppLayoutProps {
  children: React.ReactNode
  user?: {
    name: string
    avatar?: string
    role?: 'buyer' | 'creator' | 'admin'
  } | null
}

function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(p => p[0]?.toUpperCase() ?? '')
    .join('')
}

export function AppLayout({ children, user }: AppLayoutProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-bg text-text">
      <header className="sticky top-0 z-50 border-b border-border bg-bg/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-6">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-mono text-scale-sm text-mint tracking-tight">
              [MINTSKILLS.AI]
            </Link>
            <nav className="hidden sm:flex items-center gap-6">
              <Link href="/browse" className="text-text-2 hover:text-text text-scale-sm transition-colors">
                Browse
              </Link>
              <Link href="/creator" className="text-text-2 hover:text-text text-scale-sm transition-colors">
                Creators
              </Link>
              <Link href="/requests" className="text-text-2 hover:text-text text-scale-sm transition-colors">
                Requests
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <DropdownMenu.Root open={open} onOpenChange={setOpen}>
                <DropdownMenu.Trigger asChild>
                  <button className="flex items-center gap-2 text-text-2 hover:text-text transition-colors">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                    ) : (
                      <span className="w-7 h-7 rounded-full bg-surface-2 flex items-center justify-center text-text-3 text-scale-xs font-mono">
                        {initials(user.name)}
                      </span>
                    )}
                    <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
                  </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    align="end"
                    sideOffset={8}
                    className="min-w-[180px] bg-surface border border-border py-1 z-50"
                  >
                    <div className="px-3 py-2 border-b border-border-faint mb-1">
                      <p className="text-text text-scale-sm font-medium truncate">{user.name}</p>
                    </div>

                    <DropdownMenu.Item asChild>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-3 py-2 text-text-2 text-scale-sm hover:text-text hover:bg-surface-2 transition-colors cursor-pointer outline-none"
                      >
                        <LayoutDashboard size={14} />
                        Dashboard
                      </Link>
                    </DropdownMenu.Item>

                    {(user.role === 'creator' || user.role === 'admin') && (
                      <>
                        <DropdownMenu.Item asChild>
                          <Link
                            href="/creator/dashboard"
                            className="flex items-center gap-2 px-3 py-2 text-text-2 text-scale-sm hover:text-text hover:bg-surface-2 transition-colors cursor-pointer outline-none"
                          >
                            <Settings size={14} />
                            Creator Dashboard
                          </Link>
                        </DropdownMenu.Item>
                        <DropdownMenu.Item asChild>
                          <Link
                            href="/creator/new"
                            className="flex items-center gap-2 px-3 py-2 text-text-2 text-scale-sm hover:text-text hover:bg-surface-2 transition-colors cursor-pointer outline-none"
                          >
                            <PlusCircle size={14} />
                            New Listing
                          </Link>
                        </DropdownMenu.Item>
                      </>
                    )}

                    <DropdownMenu.Separator className="my-1 border-t border-border-faint" />

                    <DropdownMenu.Item asChild>
                      <form action="/auth/logout" method="post">
                        <button
                          type="submit"
                          className="flex items-center gap-2 px-3 py-2 text-text-2 text-scale-sm hover:text-text hover:bg-surface-2 transition-colors cursor-pointer outline-none w-full text-left"
                        >
                          <LogOut size={14} />
                          Sign out
                        </button>
                      </form>
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            ) : (
              <Link href="/auth/login" className="btn-secondary text-scale-xs px-4 py-2">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">{children}</main>
    </div>
  )
}
