'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageHeader } from '@/components/ui/PageHeader'
import { DEV_CATEGORIES, COWORK_CATEGORIES, CATEGORY_LABELS } from '@/lib/categories'

export default function NewRequestPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !description.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, category, suggestedPrice: price }),
      })
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <AppLayout>
        <div className="max-w-sm mx-auto pt-20 text-center">
          <CheckCircle size={40} className="text-mint mx-auto" />
          <p className="font-display font-semibold text-scale-xl text-text mt-4">
            Request posted
          </p>
          <p className="text-text-2 text-scale-sm mt-2">
            Creators will be notified. You will receive an email when someone starts building.
          </p>
          <Link href="/requests" className="btn-secondary inline-block mt-6">
            Back to requests
          </Link>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="max-w-xl">
        <PageHeader
          eyebrow="Community"
          title="Post a request"
          description="Describe the skill you need. Be specific — better descriptions attract better builders."
        />

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
          <div>
            <label className="label-eyebrow block mb-2">Title <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              placeholder="e.g. Sentry error root-cause analyser"
              className="w-full bg-surface border border-border text-text p-3 text-scale-sm placeholder:text-text-3 focus:outline-none focus:border-mint transition-colors"
            />
          </div>

          <div>
            <label className="label-eyebrow block mb-2">Description <span className="text-red-400">*</span></label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              rows={5}
              placeholder="What should the skill do? What problem does it solve? What outputs do you expect?"
              className="w-full bg-surface border border-border text-text p-3 text-scale-sm placeholder:text-text-3 focus:outline-none focus:border-mint transition-colors resize-y font-body"
            />
          </div>

          <div>
            <label className="label-eyebrow block mb-2">Category <span className="text-text-3">(optional)</span></label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full bg-surface border border-border text-text p-3 text-scale-sm focus:outline-none focus:border-mint transition-colors"
            >
              <option value="">No category</option>
              <optgroup label="Developer">
                {(DEV_CATEGORIES as readonly string[]).map(s => (
                  <option key={s} value={s}>{CATEGORY_LABELS[s]}</option>
                ))}
              </optgroup>
              <optgroup label="Cowork / Knowledge worker">
                {(COWORK_CATEGORIES as readonly string[]).map(s => (
                  <option key={s} value={s}>{CATEGORY_LABELS[s]}</option>
                ))}
              </optgroup>
            </select>
          </div>

          <div>
            <label className="label-eyebrow block mb-2">Suggested price <span className="text-text-3">(optional)</span></label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3 font-mono text-scale-sm">£</span>
              <input
                type="number"
                min={0}
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="25"
                className="w-full bg-surface border border-border text-text pl-7 pr-3 py-3 text-scale-sm focus:outline-none focus:border-mint transition-colors"
              />
            </div>
            <p className="text-text-3 text-scale-xs font-mono mt-1">Signals how much you would pay — not a commitment.</p>
          </div>

          {error && <p className="text-red-400 text-scale-xs font-mono">{error}</p>}

          <button
            type="submit"
            disabled={submitting || !title.trim() || !description.trim()}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Posting…' : 'Post Request'}
          </button>
        </form>
      </div>
    </AppLayout>
  )
}
