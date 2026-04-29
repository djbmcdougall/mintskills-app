const STATS = [
  { label: 'Total listings',  value: '247' },
  { label: 'Pending review',  value: '12' },
  { label: 'Open violations', value: '3' },
  { label: 'Total GMV',       value: '£14,230' },
]

const ACTIVITY = [
  { time: '14:52', event: 'New listing submitted — SQL Query Optimiser by Elena Torres' },
  { time: '13:41', event: 'Violation reported — GitHub PR Reviewer by reporter_***@gmail.com' },
  { time: '12:05', event: 'Listing approved — Playwright Test Writer by James Okafor' },
  { time: '11:38', event: 'New user registered — buyer_***@hotmail.com' },
  { time: '10:17', event: 'Violation resolved — React Component Auditor — no infringement found' },
  { time: '09:44', event: 'Listing submitted — Dependency Vulnerability Scanner by Amir Hassan' },
  { time: '09:12', event: 'Stripe payout processed — £680 to Alain Dupont' },
  { time: '08:55', event: 'New listing submitted — Technical Debt Radar by Isabelle Laurent' },
]

export default function AdminOverviewPage() {
  return (
    <div>
      <p className="label-eyebrow">Admin</p>
      <h1 className="font-display font-semibold text-scale-2xl text-text mt-1 mb-8">Overview</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {STATS.map(stat => (
          <div key={stat.label} className="bg-surface border border-border p-5">
            <p className="text-text-3 text-scale-xs font-mono uppercase tracking-wider">{stat.label}</p>
            <p className="font-display text-scale-2xl text-text mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      <div>
        <p className="text-text-3 text-scale-xs font-mono uppercase tracking-wider mb-4">Recent activity</p>
        <ul className="bg-surface border border-border divide-y divide-border-faint">
          {ACTIVITY.map((item, i) => (
            <li key={i} className="flex items-start gap-4 px-4 py-3">
              <span className="text-text-3 text-scale-xs font-mono w-12 flex-shrink-0 pt-0.5">{item.time}</span>
              <span className="text-text-2 text-scale-sm">{item.event}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
