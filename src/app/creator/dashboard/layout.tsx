import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CreatorSidebar } from './_components/CreatorSidebar'
import Link from 'next/link'

export default async function CreatorDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const displayName: string =
    (user.user_metadata?.full_name as string | undefined) ??
    user.email?.split('@')[0] ??
    'Creator'
  const avatar: string | undefined =
    user.user_metadata?.avatar_url as string | undefined

  return (
    <div className="min-h-screen bg-bg text-text">
      <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-border bg-bg/95 backdrop-blur-sm flex items-center px-6 justify-between">
        <Link href="/" className="font-mono text-scale-sm text-mint tracking-tight">
          [MINTSKILLS.AI]
        </Link>
        <Link
          href="/browse"
          className="text-text-3 text-scale-xs font-mono hover:text-text-2 transition-colors"
        >
          ← Marketplace
        </Link>
      </header>

      <CreatorSidebar displayName={displayName} avatar={avatar} />

      <main className="ml-56 pt-14 p-8 min-h-screen">{children}</main>
    </div>
  )
}
