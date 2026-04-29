import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from './_components/AdminSidebar'
import Link from 'next/link'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const role = user.user_metadata?.role as string | undefined
  if (role !== 'admin') redirect('/browse')

  const displayName: string =
    (user.user_metadata?.full_name as string | undefined) ??
    user.email?.split('@')[0] ??
    'Admin'

  return (
    <div className="min-h-screen bg-bg text-text">
      <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-border bg-bg/95 backdrop-blur-sm flex items-center px-6 justify-between">
        <Link href="/" className="font-mono text-scale-sm text-mint tracking-tight">[MINTSKILLS.AI]</Link>
        <span className="text-text-3 text-scale-xs font-mono">Admin — {displayName}</span>
      </header>
      <AdminSidebar />
      <main className="ml-56 pt-14 p-8 min-h-screen">{children}</main>
    </div>
  )
}
