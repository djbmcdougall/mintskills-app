'use client'

import { useState } from 'react'
import Link from 'next/link'
import * as Popover from '@radix-ui/react-popover'
import { Copy, Check } from 'lucide-react'
import { FIXTURE_PURCHASES } from '@/lib/fixtures/purchases'

function InstallPopover({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false)
  const cmd = `mintskills install ${slug}`

  async function copy() {
    await navigator.clipboard.writeText(cmd)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="text-mint text-scale-xs font-mono border border-mint px-2 py-0.5 hover:bg-mint-dim transition-colors">
          Install
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="start"
          sideOffset={6}
          className="bg-surface border border-border shadow-lg z-50 p-3 min-w-[280px]"
        >
          <p className="text-text-3 text-scale-xs font-mono mb-2">Install command</p>
          <div className="flex items-center gap-2 bg-bg border border-border-faint p-2">
            <code className="text-text-2 text-scale-xs font-mono flex-1 select-all">{cmd}</code>
            <button onClick={copy} className="text-text-3 hover:text-mint transition-colors flex-shrink-0">
              {copied ? <Check size={12} className="text-mint" /> : <Copy size={12} />}
            </button>
          </div>
          <Popover.Arrow className="fill-border" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

export function PurchasesTable() {
  return (
    <div className="bg-surface border border-border overflow-x-auto">
      <table className="w-full text-scale-sm">
        <thead>
          <tr className="border-b border-border">
            {['Skill', 'Creator', 'Amount', 'Licence', 'Date', 'Actions'].map(col => (
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
                <Link
                  href={`/listing/${row.slug}`}
                  className="text-text font-display font-semibold hover:text-mint transition-colors whitespace-nowrap"
                >
                  {row.title}
                </Link>
              </td>
              <td className="px-4 py-3 text-text-2 text-scale-sm whitespace-nowrap">{row.creator}</td>
              <td className="px-4 py-3 text-mint font-display font-semibold whitespace-nowrap">{row.amount}</td>
              <td className="px-4 py-3 text-text-3 font-mono text-scale-xs">{row.licence}</td>
              <td className="px-4 py-3 text-text-3 font-mono text-scale-xs whitespace-nowrap">{row.date}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <InstallPopover slug={row.slug} />
                  {row.refundable ? (
                    <Link
                      href="/api/refund"
                      className="text-text-3 text-scale-xs font-mono border border-border px-2 py-0.5 hover:border-border hover:text-text-2 transition-colors"
                    >
                      Refund
                    </Link>
                  ) : (
                    <span title="Refund window closed — 48-hour limit passed">
                      <button
                        disabled
                        className="text-text-3 text-scale-xs font-mono border border-border-faint px-2 py-0.5 opacity-40 cursor-not-allowed"
                      >
                        Refund
                      </button>
                    </span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
