'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const GITHUB_SVG = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0" aria-hidden>
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
)

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: (process.env.NEXT_PUBLIC_APP_URL ?? '') + '/auth/callback',
      },
    })
    setLoading(false)
    if (err) {
      setError(err.message)
    } else {
      setSent(true)
    }
  }

  async function handleGitHub() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: (process.env.NEXT_PUBLIC_APP_URL ?? '') + '/auth/callback',
      },
    })
  }

  return (
    <div className="min-h-screen bg-bg flex items-start justify-center pt-24 px-4">
      <div className="w-full max-w-sm">
        <p className="font-mono text-mint text-scale-sm text-center">[MINTSKILLS.AI]</p>

        <h1 className="font-display font-semibold text-scale-2xl text-text mt-6 text-center">
          Sign in
        </h1>
        <p className="text-text-2 text-scale-sm mt-1 text-center">No password. No friction.</p>

        {sent ? (
          <div className="mt-10 bg-surface border border-border p-6 text-center">
            <p className="text-mint font-display font-semibold text-scale-md">Check your email — link sent.</p>
            <p className="text-text-3 text-scale-sm font-mono mt-2">Click the link in the email to sign in.</p>
          </div>
        ) : (
          <form onSubmit={handleMagicLink} className="mt-8 flex flex-col gap-3">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full bg-surface border border-border text-text p-3 text-scale-sm placeholder:text-text-3 focus:outline-none focus:border-mint transition-colors"
            />

            {error && (
              <p className="text-red-400 text-scale-xs font-mono">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending…' : 'Send magic link'}
            </button>

            <div className="flex items-center gap-3 mt-1">
              <div className="flex-1 h-px bg-border" />
              <span className="text-text-3 text-scale-xs font-mono">or continue with</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <button
              type="button"
              onClick={handleGitHub}
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              {GITHUB_SVG}
              Continue with GitHub
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
