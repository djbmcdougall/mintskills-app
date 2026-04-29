'use client'

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, CheckCircle } from 'lucide-react'
import { CATEGORY_LABELS } from '@/lib/categories'

type QueueStatus = 'pending' | 'approved' | 'rejected'

interface QueueItem {
  id: string
  title: string
  creator: string
  category: string
  submitted: string
  status: QueueStatus
}

const INITIAL_QUEUE: QueueItem[] = [
  { id: 'mod-001', title: 'SQL Query Optimiser',           creator: 'Elena Torres',    category: 'backend',   submitted: '27 Apr 2026', status: 'pending' },
  { id: 'mod-002', title: 'Dependency Vulnerability Scanner', creator: 'Amir Hassan', category: 'security',  submitted: '26 Apr 2026', status: 'pending' },
  { id: 'mod-003', title: 'Technical Debt Radar',           creator: 'Isabelle Laurent', category: 'skill',  submitted: '25 Apr 2026', status: 'pending' },
  { id: 'mod-004', title: 'Docker Compose Builder',         creator: 'Lena Fischer',  category: 'devops',    submitted: '24 Apr 2026', status: 'pending' },
  { id: 'mod-005', title: 'React Component Auditor',        creator: 'Marcus Webb',   category: 'frontend',  submitted: '23 Apr 2026', status: 'rejected' },
]

const VERIFICATION_STAGES = [
  { stage: 'Stage 1 — Static Analysis',      result: 'Scanned for outbound network calls, credential reads, eval/exec. Clean.' },
  { stage: 'Stage 2 — Dependency Verification', result: 'All packages verified against npm registry. No known CVEs.' },
  { stage: 'Stage 3 — Content Hashing',       result: 'SHA-256 hash stored. Tampering detectable.' },
  { stage: 'Stage 4 — Similarity Analysis',   result: 'No near-duplicate listings detected.' },
]

const FILE_LIST = [
  { name: 'index.md',    hash: 'sha256:a3f8c2d1e5b7094f' },
  { name: 'schema.json', hash: 'sha256:b2e9d4c6f1a8037e' },
  { name: 'README.md',   hash: 'sha256:c7f3a1b5d9e2048c' },
]

function StatusBadge({ status }: { status: QueueStatus }) {
  if (status === 'approved') return <span className="badge-verified">Approved</span>
  if (status === 'rejected') return <span className="inline-flex items-center px-2 py-0.5 text-scale-xs font-mono border border-red-800 text-red-400">Rejected</span>
  return <span className="inline-flex items-center px-2 py-0.5 text-scale-xs font-mono border border-amber-600 text-amber-400">Pending</span>
}

function ReviewSheet({ item, onClose, onApprove, onReject }: {
  item: QueueItem
  onClose: () => void
  onApprove: () => void
  onReject: (note: string) => void
}) {
  const [showReject, setShowReject] = useState(false)
  const [note, setNote] = useState('')

  return (
    <Dialog.Root open onOpenChange={open => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-bg/60 z-50" />
        <Dialog.Content className="fixed right-0 top-0 h-full w-96 bg-surface border-l border-border z-50 overflow-y-auto flex flex-col focus:outline-none">
          <div className="flex items-start justify-between p-6 border-b border-border">
            <div>
              <Dialog.Title className="font-display font-semibold text-scale-md text-text leading-tight">
                {item.title}
              </Dialog.Title>
              <p className="text-text-3 text-scale-xs font-mono mt-1">{item.creator}</p>
            </div>
            <Dialog.Close asChild>
              <button className="text-text-3 hover:text-text transition-colors mt-0.5">
                <X size={16} />
              </button>
            </Dialog.Close>
          </div>

          <div className="flex-1 p-6 flex flex-col gap-6">
            {/* Verification stages */}
            <div>
              <p className="label-eyebrow mb-3">Verification</p>
              <div className="flex flex-col gap-3">
                {VERIFICATION_STAGES.map(s => (
                  <div key={s.stage} className="flex items-start gap-3">
                    <CheckCircle size={14} className="text-mint flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-text text-scale-sm font-display font-semibold">{s.stage}</p>
                      <p className="text-text-3 text-scale-xs font-mono mt-0.5">{s.result}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* File list */}
            <div>
              <p className="label-eyebrow mb-3">Files</p>
              <div className="flex flex-col gap-2">
                {FILE_LIST.map(f => (
                  <div key={f.name} className="bg-bg border border-border-faint p-2">
                    <p className="text-text-2 text-scale-xs font-mono">{f.name}</p>
                    <p className="text-text-3 text-scale-xs font-mono mt-0.5 break-all">{f.hash}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Rejection note */}
            {showReject && (
              <div>
                <label className="label-eyebrow block mb-2">Rejection note</label>
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  rows={3}
                  placeholder="Explain why this listing is being rejected…"
                  className="w-full bg-bg border border-border text-text p-2 text-scale-xs font-mono focus:outline-none focus:border-mint transition-colors resize-none"
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-6 border-t border-border flex flex-col gap-2">
            {!showReject ? (
              <div className="flex gap-2">
                <button onClick={onApprove} className="btn-primary flex-1 text-center">
                  Approve
                </button>
                <button
                  onClick={() => setShowReject(true)}
                  className="flex-1 border border-red-800 text-red-400 font-display font-semibold text-scale-sm px-4 py-2.5 hover:bg-red-950/30 transition-colors"
                >
                  Reject
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => onReject(note)}
                  className="flex-1 border border-red-800 text-red-400 font-display font-semibold text-scale-sm px-4 py-2.5 hover:bg-red-950/30 transition-colors"
                >
                  Confirm Reject
                </button>
                <button onClick={() => setShowReject(false)} className="btn-secondary flex-1 text-center">
                  Cancel
                </button>
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export function ModerationQueue() {
  const [queue, setQueue] = useState<QueueItem[]>(INITIAL_QUEUE)
  const [reviewing, setReviewing] = useState<QueueItem | null>(null)

  function approve() {
    if (!reviewing) return
    setQueue(q => q.map(i => i.id === reviewing.id ? { ...i, status: 'approved' as const } : i))
    setReviewing(null)
  }

  function reject(note: string) {
    if (!reviewing) return
    void note
    setQueue(q => q.map(i => i.id === reviewing.id ? { ...i, status: 'rejected' as const } : i))
    setReviewing(null)
  }

  return (
    <>
      <div className="bg-surface border border-border overflow-x-auto">
        <table className="w-full text-scale-sm">
          <thead>
            <tr className="border-b border-border">
              {['Skill', 'Creator', 'Category', 'Submitted', 'Status', 'Action'].map(col => (
                <th key={col} className="text-left text-text-3 text-scale-xs font-mono uppercase px-4 py-3 whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {queue.map(item => (
              <tr key={item.id} className="border-b border-border-faint last:border-b-0 hover:bg-surface-2 transition-colors">
                <td className="px-4 py-3 text-text font-display font-semibold whitespace-nowrap">{item.title}</td>
                <td className="px-4 py-3 text-text-2 text-scale-sm whitespace-nowrap">{item.creator}</td>
                <td className="px-4 py-3 text-text-3 font-mono text-scale-xs whitespace-nowrap">
                  {CATEGORY_LABELS[item.category] ?? item.category}
                </td>
                <td className="px-4 py-3 text-text-3 font-mono text-scale-xs whitespace-nowrap">{item.submitted}</td>
                <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                <td className="px-4 py-3">
                  {item.status === 'pending' && (
                    <button
                      onClick={() => setReviewing(item)}
                      className="text-mint text-scale-xs font-mono border border-mint px-2 py-0.5 hover:bg-mint-dim transition-colors"
                    >
                      Review
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {reviewing && (
        <ReviewSheet
          item={reviewing}
          onClose={() => setReviewing(null)}
          onApprove={approve}
          onReject={reject}
        />
      )}
    </>
  )
}
