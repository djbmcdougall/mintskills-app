'use client'

import { useState, useRef } from 'react'
import { CheckCircle, Upload, X, Check } from 'lucide-react'
import { SkillCard } from '@/components/ui/SkillCard'
import { PurchaseCard } from '@/app/listing/_components/PurchaseCard'
import { DEV_CATEGORIES, COWORK_CATEGORIES, CATEGORY_LABELS, PLATFORMS } from '@/lib/categories'

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormState {
  title: string
  description: string
  category: string
  tags: string[]
  price: string
  licences: string[]
  mcpPool: boolean
  file: File | null
  platforms: string[]
}

const INITIAL: FormState = {
  title: '', description: '', category: '', tags: [],
  price: '', licences: ['source'], mcpPool: false,
  file: null, platforms: [],
}

const LICENCE_OPTIONS = [
  {
    value: 'embed',
    label: 'Embed Licence',
    hint: 'Rendered output only. No source code. Base price × 1.',
    includes: ['API rendering', 'No source access', 'Single workspace'],
  },
  {
    value: 'source',
    label: 'Source Licence',
    hint: 'Obfuscated source download. Suggested +50%.',
    includes: ['Obfuscated source', 'Local execution', 'Single workspace'],
  },
  {
    value: 'extended',
    label: 'Extended Commercial',
    hint: 'Clean source. Client work permitted. Suggested +400%.',
    includes: ['Clean source code', 'Client project use', 'Unlimited workspaces'],
  },
]

const STEPS = ['Basics', 'Pricing', 'Upload', 'Preview', 'Submit']

// ─── Progress bar ─────────────────────────────────────────────────────────────

function StepProgress({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-10">
      {STEPS.map((label, i) => {
        const n = i + 1
        const done = n < current
        const active = n === current
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-scale-xs font-mono border-2 transition-colors ${
                  done
                    ? 'border-mint bg-transparent text-mint'
                    : active
                    ? 'border-mint bg-mint text-bg'
                    : 'border-border text-text-3'
                }`}
              >
                {done ? <Check size={12} /> : n}
              </div>
              <span className={`text-scale-xs font-mono hidden sm:block ${active ? 'text-mint' : 'text-text-3'}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-2 mb-4 ${n < current ? 'bg-mint' : 'bg-border'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function NewListingPage() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormState>(INITIAL)
  const [tagInput, setTagInput] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── Validation ──────────────────────────────────────────────────────────────

  function validate(s: number): Record<string, string> {
    const e: Record<string, string> = {}
    if (s === 1) {
      if (!form.title.trim()) e.title = 'Title is required.'
      else if (form.title.length > 80) e.title = 'Title must be 80 characters or fewer.'
      if (form.description.length < 100) e.description = 'Description must be at least 100 characters.'
      if (!form.category) e.category = 'Select a category.'
    }
    if (s === 2) {
      const p = Number(form.price)
      if (!form.price || isNaN(p) || p < 5) e.price = 'Price must be £5 or more.'
      if (form.licences.length === 0) e.licences = 'Select at least one licence tier.'
    }
    if (s === 3) {
      if (!form.file) e.file = 'Upload a file to continue.'
      if (form.platforms.length === 0) e.platforms = 'Select at least one platform.'
    }
    return e
  }

  function next() {
    const e = validate(step)
    if (Object.keys(e).length > 0) { setErrors(e); return }
    setErrors({})
    setStep(s => s + 1)
  }

  function back() {
    setErrors({})
    setStep(s => s - 1)
  }

  // ── Field helpers ────────────────────────────────────────────────────────────

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function handleTagKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      const v = tagInput.trim().toLowerCase()
      if (v && !form.tags.includes(v)) set('tags', [...form.tags, v])
      setTagInput('')
    }
  }

  function removeTag(tag: string) {
    set('tags', form.tags.filter(t => t !== tag))
  }

  function toggleLicence(value: string) {
    set('licences', form.licences.includes(value)
      ? form.licences.filter(l => l !== value)
      : [...form.licences, value])
  }

  function togglePlatform(value: string) {
    set('platforms', form.platforms.includes(value)
      ? form.platforms.filter(p => p !== value)
      : [...form.platforms, value])
  }

  // ── File drop ────────────────────────────────────────────────────────────────

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) set('file', file)
  }

  function handleFilePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) set('file', file)
  }

  // ── Submit ───────────────────────────────────────────────────────────────────

  async function handleSubmit() {
    setSubmitting(true)
    try {
      await fetch('/api/listings', { method: 'POST', body: JSON.stringify(form) })
      setSubmitted(true)
    } catch {
      setErrors({ submit: 'Something went wrong. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  // ── Preview helpers ──────────────────────────────────────────────────────────

  const previewDelivery =
    form.licences.includes('extended') ? 'extended_commercial'
    : form.licences.includes('source') ? 'source_download'
    : 'embed'

  // ─────────────────────────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-6">
        <div className="max-w-sm text-center">
          <CheckCircle size={40} className="text-mint mx-auto" />
          <p className="font-display font-semibold text-scale-xl text-text mt-4">
            Submitted for Mint Verification
          </p>
          <p className="text-text-2 text-scale-sm mt-2">
            We will email you when your listing is verified — usually within 24 hours.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg px-6 pt-24 pb-20">
      <div className="max-w-2xl mx-auto">
        <p className="label-eyebrow mb-1">Creator tools</p>
        <h1 className="font-display font-semibold text-scale-2xl text-text mb-8">New listing</h1>

        <StepProgress current={step} />

        {/* ── STEP 1: Basics ────────────────────────────────────────────────── */}
        {step === 1 && (
          <div className="flex flex-col gap-5">
            {/* Title */}
            <div>
              <label className="label-eyebrow block mb-2">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={e => set('title', e.target.value)}
                maxLength={80}
                placeholder="e.g. GitHub PR Reviewer"
                className="w-full bg-surface border border-border text-text p-3 text-scale-sm placeholder:text-text-3 focus:outline-none focus:border-mint transition-colors"
              />
              <div className="flex items-center justify-between mt-1">
                {errors.title && <p className="text-red-400 text-scale-xs font-mono">{errors.title}</p>}
                <p className={`text-scale-xs font-mono ml-auto ${form.title.length > 72 ? 'text-amber-400' : 'text-text-3'}`}>
                  {form.title.length}/80
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="label-eyebrow block mb-2">Description</label>
              <textarea
                value={form.description}
                onChange={e => set('description', e.target.value)}
                rows={6}
                placeholder="Describe what your skill does, who it is for, and what makes it better than a generic prompt. Markdown supported."
                className="w-full bg-surface border border-border text-text p-3 text-scale-sm placeholder:text-text-3 focus:outline-none focus:border-mint transition-colors resize-y font-body"
              />
              <div className="flex items-center justify-between mt-1">
                {errors.description && <p className="text-red-400 text-scale-xs font-mono">{errors.description}</p>}
                <p className={`text-scale-xs font-mono ml-auto ${form.description.length < 100 ? 'text-amber-400' : 'text-text-3'}`}>
                  {form.description.length} chars — min 100
                </p>
              </div>
              <p className="text-text-3 text-scale-xs font-mono mt-1">Markdown supported</p>
            </div>

            {/* Category */}
            <div>
              <label className="label-eyebrow block mb-2">Category</label>
              <select
                value={form.category}
                onChange={e => set('category', e.target.value)}
                className="w-full bg-surface border border-border text-text p-3 text-scale-sm focus:outline-none focus:border-mint transition-colors"
              >
                <option value="">Select a category…</option>
                <optgroup label="Developer">
                  {(DEV_CATEGORIES as readonly string[]).map(slug => (
                    <option key={slug} value={slug}>{CATEGORY_LABELS[slug]}</option>
                  ))}
                </optgroup>
                <optgroup label="Cowork / Knowledge worker">
                  {(COWORK_CATEGORIES as readonly string[]).map(slug => (
                    <option key={slug} value={slug}>{CATEGORY_LABELS[slug]}</option>
                  ))}
                </optgroup>
              </select>
              {errors.category && <p className="text-red-400 text-scale-xs font-mono mt-1">{errors.category}</p>}
            </div>

            {/* Tags */}
            <div>
              <label className="label-eyebrow block mb-2">Tags</label>
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleTagKey}
                placeholder="Type a tag and press Enter…"
                className="w-full bg-surface border border-border text-text p-3 text-scale-sm placeholder:text-text-3 focus:outline-none focus:border-mint transition-colors"
              />
              {form.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {form.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 bg-surface-2 border border-border-faint text-text-3 text-scale-xs px-2 py-0.5 font-mono">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="hover:text-text transition-colors">
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 2: Pricing ───────────────────────────────────────────────── */}
        {step === 2 && (
          <div className="flex flex-col gap-6">
            {/* Price */}
            <div>
              <label className="label-eyebrow block mb-2">Base price</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3 font-mono text-scale-sm">£</span>
                <input
                  type="number"
                  min={5}
                  value={form.price}
                  onChange={e => set('price', e.target.value)}
                  placeholder="29"
                  className="w-full bg-surface border border-border text-text pl-7 pr-3 py-3 text-scale-sm focus:outline-none focus:border-mint transition-colors"
                />
              </div>
              {errors.price && <p className="text-red-400 text-scale-xs font-mono mt-1">{errors.price}</p>}
              <p className="text-text-3 text-scale-xs font-mono mt-1">Minimum £5. You keep 80% of every sale.</p>
            </div>

            {/* Licence tiers */}
            <div>
              <label className="label-eyebrow block mb-2">Licence tiers</label>
              <div className="flex flex-col gap-2">
                {LICENCE_OPTIONS.map(opt => {
                  const checked = form.licences.includes(opt.value)
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => toggleLicence(opt.value)}
                      className={`text-left border p-4 transition-colors ${
                        checked ? 'border-mint bg-mint-dim' : 'border-border hover:border-border'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 w-4 h-4 border flex items-center justify-center flex-shrink-0 ${checked ? 'border-mint bg-mint' : 'border-border'}`}>
                          {checked && <Check size={10} className="text-bg" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-scale-sm font-display font-semibold ${checked ? 'text-mint' : 'text-text'}`}>
                            {opt.label}
                          </p>
                          <p className="text-text-3 text-scale-xs font-mono mt-0.5">{opt.hint}</p>
                          <ul className="flex flex-wrap gap-x-4 gap-y-0.5 mt-2">
                            {opt.includes.map(item => (
                              <li key={item} className="text-text-2 text-scale-xs font-mono">· {item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
              {errors.licences && <p className="text-red-400 text-scale-xs font-mono mt-1">{errors.licences}</p>}
            </div>

            {/* MCP Pool toggle */}
            <div className="flex items-center justify-between py-3 border-t border-border-faint">
              <div>
                <p className="text-text text-scale-sm font-display font-semibold">MintPro Pool</p>
                <p className="text-text-3 text-scale-xs font-mono mt-0.5">
                  Include in MintPro catalogue for passive income — V2
                </p>
              </div>
              <button
                type="button"
                onClick={() => set('mcpPool', !form.mcpPool)}
                className={`w-10 h-5 rounded-full border-2 transition-colors relative ${
                  form.mcpPool ? 'bg-mint border-mint' : 'bg-surface-2 border-border'
                }`}
              >
                <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-bg transition-transform ${form.mcpPool ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Upload ────────────────────────────────────────────────── */}
        {step === 3 && (
          <div className="flex flex-col gap-6">
            {/* Drop zone */}
            <div>
              <label className="label-eyebrow block mb-2">Skill file</label>
              <div
                onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed p-10 text-center cursor-pointer transition-colors ${
                  isDragging ? 'border-mint bg-mint-dim' : 'border-border hover:border-mint'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".md,.zip,.tar.gz"
                  onChange={handleFilePick}
                  className="hidden"
                />
                {form.file ? (
                  <div>
                    <p className="text-mint font-mono text-scale-sm">{form.file.name}</p>
                    <p className="text-text-3 font-mono text-scale-xs mt-1">
                      {(form.file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                ) : (
                  <div>
                    <Upload size={24} className="text-text-3 mx-auto mb-3" />
                    <p className="text-text-2 text-scale-sm">Drag and drop or click to upload</p>
                    <p className="text-text-3 text-scale-xs font-mono mt-1">Accepts .md, .zip, .tar.gz</p>
                  </div>
                )}
              </div>
              {errors.file && <p className="text-red-400 text-scale-xs font-mono mt-1">{errors.file}</p>}
              {form.file?.name.endsWith('.zip') && (
                <p className="text-amber-400 text-scale-xs font-mono mt-1.5 flex items-center gap-1">
                  ⚠ README.md required inside the archive
                </p>
              )}
            </div>

            {/* Platforms */}
            <div>
              <label className="label-eyebrow block mb-2">Platform compatibility</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PLATFORMS.map(p => {
                  const checked = form.platforms.includes(p.value)
                  return (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => togglePlatform(p.value)}
                      className={`flex items-center gap-2 border px-3 py-2 text-scale-xs font-mono transition-colors ${
                        checked ? 'border-mint text-mint bg-mint-dim' : 'border-border text-text-3 hover:border-border hover:text-text-2'
                      }`}
                    >
                      <div className={`w-3 h-3 border flex items-center justify-center flex-shrink-0 ${checked ? 'border-mint bg-mint' : 'border-border'}`}>
                        {checked && <Check size={8} className="text-bg" />}
                      </div>
                      {p.label}
                    </button>
                  )
                })}
              </div>
              {errors.platforms && <p className="text-red-400 text-scale-xs font-mono mt-1">{errors.platforms}</p>}
            </div>
          </div>
        )}

        {/* ── STEP 4: Preview ───────────────────────────────────────────────── */}
        {step === 4 && (
          <div>
            <p className="text-text-3 text-scale-xs font-mono mb-6">Looking good? Continue.</p>
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              <div className="flex-1 min-w-0">
                <p className="label-eyebrow mb-3">Card preview</p>
                <SkillCard
                  title={form.title || 'Your skill title'}
                  slug="preview"
                  description={form.description || 'Your skill description will appear here once you have written at least 100 characters.'}
                  price={Number(form.price) || 29}
                  category={form.category || 'skill'}
                  tags={form.tags.length > 0 ? form.tags : ['example', 'tag']}
                  platforms={form.platforms.length > 0 ? form.platforms : ['claude-code']}
                  creatorName="Your name"
                  mintVerified={false}
                  installCount={0}
                  deliveryModel={previewDelivery}
                  isFree={false}
                />
              </div>
              <div className="w-full lg:w-72 flex-shrink-0">
                <p className="label-eyebrow mb-3">Purchase card preview</p>
                <PurchaseCard
                  basePrice={Number(form.price) || 29}
                  slug={form.title.toLowerCase().replace(/\s+/g, '-') || 'your-skill'}
                  mintVerified={false}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 5: Submit ────────────────────────────────────────────────── */}
        {step === 5 && (
          <div className="flex flex-col gap-6">
            <p className="text-text-2 text-scale-sm">Review your listing before submitting.</p>
            <div className="bg-surface border border-border p-5 flex flex-col gap-3">
              {[
                { label: 'Title',       value: form.title },
                { label: 'Category',    value: CATEGORY_LABELS[form.category] ?? form.category },
                { label: 'Price',       value: `£${form.price}` },
                { label: 'Licences',    value: form.licences.map(l => LICENCE_OPTIONS.find(o => o.value === l)?.label).join(', ') },
                { label: 'Platforms',   value: form.platforms.map(p => PLATFORMS.find(x => x.value === p)?.label).join(', ') },
                { label: 'Tags',        value: form.tags.join(', ') || '—' },
                { label: 'File',        value: form.file?.name ?? '—' },
              ].map(row => (
                <div key={row.label} className="flex gap-4 py-2 border-b border-border-faint last:border-b-0">
                  <span className="text-text-3 text-scale-xs font-mono w-24 flex-shrink-0">{row.label}</span>
                  <span className="text-text text-scale-sm">{row.value}</span>
                </div>
              ))}
            </div>

            {errors.submit && (
              <p className="text-red-400 text-scale-xs font-mono">{errors.submit}</p>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting…' : 'Submit for Mint Verification'}
            </button>
            <p className="text-text-3 text-scale-sm text-center">
              Your listing will be reviewed within 24 hours.
            </p>
          </div>
        )}

        {/* ── Navigation ───────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
          {step > 1 ? (
            <button type="button" onClick={back} className="btn-secondary">
              ← Back
            </button>
          ) : (
            <div />
          )}
          {step < 5 && (
            <button type="button" onClick={next} className="btn-primary">
              Continue →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
