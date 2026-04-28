import Link from 'next/link'

const PAYOUT_HISTORY = [
  { date: '1 Apr 2026', amount: '£680',  status: 'Paid',    stripeId: 'po_1Pxx...a3b2' },
  { date: '1 Mar 2026', amount: '£925',  status: 'Paid',    stripeId: 'po_1Pww...c7d4' },
  { date: '1 Feb 2026', amount: '£742',  status: 'Paid',    stripeId: 'po_1Pvv...e9f1' },
  { date: '1 Jan 2026', amount: '£500',  status: 'Paid',    stripeId: 'po_1Puu...b5a8' },
]

const MCP_SKILLS = [
  { title: 'GitHub PR Reviewer',       slug: 'github-pr-reviewer' },
  { title: 'Supabase Schema Migrator', slug: 'supabase-schema-migrator' },
  { title: 'SQL Query Optimiser',      slug: 'sql-query-optimiser' },
]

export default function EarningsPage() {
  return (
    <div>
      <p className="label-eyebrow">Earnings</p>
      <h1 className="font-display font-semibold text-scale-2xl text-text mt-1 mb-8">Earnings &amp; Payouts</h1>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total earned',    value: '£2,847' },
          { label: 'Pending payout',  value: '£340' },
          { label: 'Next payout',     value: '2 May 2026' },
        ].map(item => (
          <div key={item.label} className="bg-surface border border-border p-5">
            <p className="text-text-3 text-scale-xs font-mono uppercase tracking-wider">{item.label}</p>
            <p className="font-display text-scale-xl text-text mt-2">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Connect Stripe card */}
      <div className="bg-surface-2 border border-mint p-6 text-center mb-8">
        <p className="font-display font-semibold text-scale-md text-text">Connect Stripe to receive payouts</p>
        <p className="text-text-2 text-scale-sm mt-2 max-w-md mx-auto">
          Connect your Stripe account to receive payouts. 80% of every sale is yours — paid out on the 1st of each month.
        </p>
        <button className="btn-primary mt-5">
          Connect Stripe
        </button>
        <p className="text-text-3 text-scale-xs font-mono mt-3">
          {/* TODO: Alain wires Stripe Connect OAuth here */}
          Stripe Connect OAuth — Alain to implement
        </p>
      </div>

      {/* Payout history */}
      <div className="mb-8">
        <p className="text-text-3 text-scale-xs font-mono uppercase tracking-wider mb-4">Payout history</p>
        <div className="bg-surface border border-border overflow-x-auto">
          <table className="w-full text-scale-sm">
            <thead>
              <tr className="border-b border-border">
                {['Date', 'Amount', 'Status', 'Stripe ID'].map(col => (
                  <th key={col} className="text-left text-text-3 text-scale-xs font-mono uppercase px-4 py-3">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PAYOUT_HISTORY.map((row, i) => (
                <tr key={i} className="border-b border-border-faint last:border-b-0">
                  <td className="px-4 py-3 text-text-2 font-mono text-scale-xs">{row.date}</td>
                  <td className="px-4 py-3 text-mint font-display font-semibold">{row.amount}</td>
                  <td className="px-4 py-3">
                    <span className="badge-verified">{row.status}</span>
                  </td>
                  <td className="px-4 py-3 text-text-3 font-mono text-scale-xs">{row.stripeId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MCP Pool */}
      <div className="bg-surface border border-border p-6">
        <p className="label-eyebrow mb-1">MintPro Pool</p>
        <p className="font-display font-semibold text-scale-md text-text mt-2">
          Earn passively when MintPro subscribers use your skills.
        </p>
        <p className="text-text-2 text-scale-sm mt-2">
          Coming in V2 — early opt-in available at launch.
        </p>
        <div className="mt-5 flex flex-col gap-2 opacity-40 pointer-events-none select-none">
          {MCP_SKILLS.map(skill => (
            <div key={skill.slug} className="flex items-center justify-between py-2 border-b border-border-faint">
              <span className="text-text text-scale-sm">{skill.title}</span>
              <label className="flex items-center gap-2">
                <span className="text-text-3 text-scale-xs font-mono">Include in pool</span>
                <div className="w-8 h-4 bg-border rounded-full" />
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
