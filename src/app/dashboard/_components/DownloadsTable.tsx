'use client'

import { useState } from 'react'
import Link from 'next/link'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { FIXTURE_PURCHASES } from '@/lib/fixtures/purchases'

function makeReceipt(purchase: (typeof FIXTURE_PURCHASES)[number]) {
  return JSON.stringify({
    version: 1,
    purchase_id: `pur_01H${purchase.id.replace('pur-', '').toUpperCase()}XYZ`,
    listing_id: `lst_01HABC${purchase.id.slice(-3).toUpperCase()}`,
    listing_slug: purchase.slug,
    listing_version: '1.4.2',
    buyer_id: 'usr_01HDEF000',
    installed_at: '2026-04-10T14:22:00Z',
    content_hash: 'sha256:a3f8c2d1e5b7094f2c6a8d3e1b9f4c7a',
    signature: 'ed25519:pending-security-review',
  }, null, 2)
}

function ReceiptDialog({ purchase }: { purchase: (typeof FIXTURE_PURCHASES)[number] }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="text-text-3 text-scale-xs font-mono border border-border-faint px-2 py-0.5 hover:border-border hover:text-text-2 transition-colors">
          View Receipt
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-bg/70 z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-surface border border-border z-50 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <Dialog.Title className="font-display font-semibold text-scale-md text-text">
                Purchase Receipt
              </Dialog.Title>
              <p className="text-text-3 text-scale-xs font-mono mt-0.5">{purchase.title}</p>
            </div>
            <Dialog.Close asChild>
              <button className="text-text-3 hover:text-text transition-colors">
                <X size={16} />
              </button>
            </Dialog.Close>
          </div>

          <pre className="bg-bg border border-border-faint p-4 text-scale-xs font-mono text-text-2 overflow-x-auto">
            {makeReceipt(purchase)}
          </pre>

          <p className="text-text-3 text-scale-xs font-mono mt-3">
            Cryptographic signing pending security review — see{' '}
            <Link href="/docs/INSTALL-HOOK-SPEC.md" className="text-mint hover:underline">
              /docs/INSTALL-HOOK-SPEC.md
            </Link>
          </p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export function DownloadsTable() {
  return (
    <div className="bg-surface border border-border overflow-x-auto">
      <table className="w-full text-scale-sm">
        <thead>
          <tr className="border-b border-border">
            {['Skill', 'Creator', 'Licence', 'Date', 'Actions'].map(col => (
              <th key={col} className="text-left text-text-3 text-scale-xs font-mono uppercase px-4 py-3 whitespace-nowrap">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {FIXTURE_PURCHASES.map(row => (
            <tr key={row.id} className="border-b border-border-faint last:border-b-0 hover:bg-surface-2 transition-colors">
              <td className="px-4 py-3">
                <Link href={`/listing/${row.slug}`} className="text-text font-display font-semibold hover:text-mint transition-colors whitespace-nowrap">
                  {row.title}
                </Link>
              </td>
              <td className="px-4 py-3 text-text-2 text-scale-sm whitespace-nowrap">{row.creator}</td>
              <td className="px-4 py-3 text-text-3 font-mono text-scale-xs">{row.licence}</td>
              <td className="px-4 py-3 text-text-3 font-mono text-scale-xs whitespace-nowrap">{row.date}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <a
                    href={`/api/purchases/${row.id}/download`}
                    className="btn-secondary text-scale-xs px-2 py-0.5"
                  >
                    Download
                  </a>
                  <ReceiptDialog purchase={row} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
