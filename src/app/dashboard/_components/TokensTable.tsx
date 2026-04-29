'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { FIXTURE_TOKENS } from '@/lib/fixtures/purchases'

type TokenStatus = 'active' | 'revoked'

interface TokenRow {
  id: string
  tokenId: string
  skill: string
  slug: string
  domains: string[]
  status: TokenStatus
  lastUsed: string
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  async function copy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <button onClick={copy} className="text-text-3 hover:text-mint transition-colors">
      {copied ? <Check size={11} className="text-mint" /> : <Copy size={11} />}
    </button>
  )
}

function DomainsCell({ domains: initial }: { domains: string[] }) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(initial.join(', '))

  if (editing) {
    return (
      <input
        autoFocus
        value={value}
        onChange={e => setValue(e.target.value)}
        onBlur={() => setEditing(false)}
        onKeyDown={e => e.key === 'Enter' && setEditing(false)}
        className="bg-bg border border-mint text-text-2 text-scale-xs font-mono px-2 py-0.5 focus:outline-none min-w-[160px]"
      />
    )
  }
  return (
    <button
      onClick={() => setEditing(true)}
      title="Click to edit domains"
      className="text-text-2 text-scale-xs font-mono hover:text-text hover:underline text-left"
    >
      {value}
    </button>
  )
}

export function TokensTable() {
  const [tokens, setTokens] = useState<TokenRow[]>(FIXTURE_TOKENS)

  function revoke(id: string) {
    setTokens(prev =>
      prev.map(t => t.id === id ? { ...t, status: 'revoked' as const } : t),
    )
    // TODO: POST /api/tokens/[id] DELETE
  }

  return (
    <div className="bg-surface border border-border overflow-x-auto">
      <table className="w-full text-scale-sm">
        <thead>
          <tr className="border-b border-border">
            {['Skill', 'Token ID', 'Domains', 'Status', 'Last Used', 'Actions'].map(col => (
              <th key={col} className="text-left text-text-3 text-scale-xs font-mono uppercase px-4 py-3 whitespace-nowrap">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tokens.map(tok => (
            <tr key={tok.id} className="border-b border-border-faint last:border-b-0 hover:bg-surface-2 transition-colors">
              <td className="px-4 py-3 text-text font-display font-semibold whitespace-nowrap">{tok.skill}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-text-2 font-mono text-scale-xs">
                    {tok.tokenId.slice(0, 8)}…
                  </span>
                  <CopyButton text={tok.tokenId} />
                </div>
              </td>
              <td className="px-4 py-3 max-w-[200px]">
                {tok.status === 'revoked' ? (
                  <span className="text-text-3 text-scale-xs font-mono">{tok.domains.join(', ')}</span>
                ) : (
                  <DomainsCell domains={tok.domains} />
                )}
              </td>
              <td className="px-4 py-3">
                {tok.status === 'active' ? (
                  <span className="badge-verified">Active</span>
                ) : (
                  <span className="text-text-3 text-scale-xs font-mono line-through">Revoked</span>
                )}
              </td>
              <td className="px-4 py-3 text-text-3 font-mono text-scale-xs whitespace-nowrap">{tok.lastUsed}</td>
              <td className="px-4 py-3">
                {tok.status === 'active' && (
                  <button
                    onClick={() => revoke(tok.id)}
                    className="text-red-400 text-scale-xs font-mono border border-red-900 px-2 py-0.5 hover:bg-red-950/30 transition-colors"
                  >
                    Revoke
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
