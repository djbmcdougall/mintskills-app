'use client'

import { useState } from 'react'

type ViolationStatus = 'open' | 'investigating' | 'resolved'

interface Violation {
  id: string
  skill: string
  reporter: string
  evidence: string
  watermarkMatch: boolean
  fingerprintMatch: boolean
  status: ViolationStatus
  date: string
}

const INITIAL_VIOLATIONS: Violation[] = [
  {
    id: 'vio-001',
    skill: 'GitHub PR Reviewer',
    reporter: 'reporter_***@gmail.com',
    evidence: 'https://github.com/example/stolen-skill',
    watermarkMatch: true,
    fingerprintMatch: true,
    status: 'open',
    date: '26 Apr 2026',
  },
  {
    id: 'vio-002',
    skill: 'Playwright Test Writer',
    reporter: 'abuse_***@proton.me',
    evidence: 'https://pastebin.com/example123',
    watermarkMatch: false,
    fingerprintMatch: true,
    status: 'investigating',
    date: '24 Apr 2026',
  },
  {
    id: 'vio-003',
    skill: 'React Component Auditor',
    reporter: 'user_***@hotmail.com',
    evidence: 'https://npmjs.com/package/rca-clone',
    watermarkMatch: true,
    fingerprintMatch: false,
    status: 'resolved',
    date: '22 Apr 2026',
  },
  {
    id: 'vio-004',
    skill: 'Docker Compose Builder',
    reporter: 'reporter2_***@outlook.com',
    evidence: 'https://gist.github.com/example/abcdef',
    watermarkMatch: false,
    fingerprintMatch: false,
    status: 'open',
    date: '21 Apr 2026',
  },
  {
    id: 'vio-005',
    skill: 'SQL Query Optimiser',
    reporter: 'legal_***@corp.com',
    evidence: 'https://github.com/example/sql-tool',
    watermarkMatch: true,
    fingerprintMatch: true,
    status: 'investigating',
    date: '19 Apr 2026',
  },
]

function StatusBadge({ status }: { status: ViolationStatus }) {
  if (status === 'open') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 text-scale-xs font-mono border border-red-800 text-red-400">
        Open
      </span>
    )
  }
  if (status === 'investigating') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 text-scale-xs font-mono border border-amber-600 text-amber-400">
        Investigating
      </span>
    )
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 text-scale-xs font-mono border border-border text-text-3">
      Resolved
    </span>
  )
}

function MatchCell({ match }: { match: boolean }) {
  if (match) {
    return <span className="text-mint text-scale-xs font-mono">Yes</span>
  }
  return <span className="text-text-3 text-scale-xs font-mono">No</span>
}

export function ViolationsTable() {
  const [violations, setViolations] = useState<Violation[]>(INITIAL_VIOLATIONS)

  function resolve(id: string) {
    setViolations(v =>
      v.map(item => item.id === id ? { ...item, status: 'resolved' as const } : item)
    )
  }

  return (
    <div className="bg-surface border border-border overflow-x-auto">
      <table className="w-full text-scale-sm">
        <thead>
          <tr className="border-b border-border">
            {['Skill', 'Reporter', 'Evidence', 'Watermark', 'Fingerprint', 'Status', 'Date', 'Actions'].map(col => (
              <th key={col} className="text-left text-text-3 text-scale-xs font-mono uppercase px-4 py-3 whitespace-nowrap">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {violations.map(item => (
            <tr key={item.id} className="border-b border-border-faint last:border-b-0 hover:bg-surface-2 transition-colors">
              <td className="px-4 py-3 text-text font-display font-semibold whitespace-nowrap">{item.skill}</td>
              <td className="px-4 py-3 text-text-2 text-scale-xs font-mono whitespace-nowrap">{item.reporter}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                <a
                  href={item.evidence}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-mint text-scale-xs font-mono hover:underline"
                >
                  View &rarr;
                </a>
              </td>
              <td className="px-4 py-3"><MatchCell match={item.watermarkMatch} /></td>
              <td className="px-4 py-3"><MatchCell match={item.fingerprintMatch} /></td>
              <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
              <td className="px-4 py-3 text-text-3 font-mono text-scale-xs whitespace-nowrap">{item.date}</td>
              <td className="px-4 py-3">
                {item.status !== 'resolved' && (
                  <button
                    onClick={() => resolve(item.id)}
                    className="text-scale-xs font-mono border border-border text-text-2 px-2 py-0.5 hover:border-mint hover:text-mint transition-colors"
                  >
                    Mark Resolved
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
