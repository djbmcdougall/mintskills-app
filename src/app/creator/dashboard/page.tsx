import { RevenueChart } from './_components/RevenueChart'

const STATS = [
  { label: 'Total Revenue',  value: '£2,847' },
  { label: 'This Month',     value: '£340' },
  { label: 'Downloads',      value: '127' },
  { label: 'Listings',       value: '8' },
]

const RECENT_SALES = [
  { skill: 'GitHub PR Reviewer',       buyer: 'buyer_***@gmail.com',   licence: 'Source',   amount: '£73',  date: '27 Apr 2026', status: 'Paid' },
  { skill: 'Terraform Plan Explainer', buyer: 'buyer_***@hotmail.com', licence: 'Embed',    amount: '£24',  date: '26 Apr 2026', status: 'Paid' },
  { skill: 'SQL Query Optimiser',      buyer: 'buyer_***@yahoo.com',   licence: 'Extended', amount: '£154', date: '25 Apr 2026', status: 'Paid' },
  { skill: 'Supabase Schema Migrator', buyer: 'buyer_***@gmail.com',   licence: 'Source',   amount: '£48',  date: '24 Apr 2026', status: 'Pending' },
  { skill: 'OpenAPI Spec Generator',   buyer: 'buyer_***@icloud.com',  licence: 'Embed',    amount: '£18',  date: '23 Apr 2026', status: 'Paid' },
]

export default function CreatorDashboardOverview() {
  return (
    <div>
      <p className="label-eyebrow">Creator dashboard</p>
      <h1 className="font-display font-semibold text-scale-2xl text-text mt-1 mb-8">Overview</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(stat => (
          <div key={stat.label} className="bg-surface border border-border p-5">
            <p className="text-text-3 text-scale-xs font-mono uppercase tracking-wider">{stat.label}</p>
            <p className="font-display text-scale-2xl text-text mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="mt-8 bg-surface border border-border p-5">
        <p className="text-text-3 text-scale-xs font-mono uppercase tracking-wider mb-4">Revenue — last 30 days</p>
        <RevenueChart />
      </div>

      {/* Recent sales */}
      <div className="mt-8">
        <p className="text-text-3 text-scale-xs font-mono uppercase tracking-wider mb-4">Recent sales</p>
        <div className="bg-surface border border-border overflow-x-auto">
          <table className="w-full text-scale-sm">
            <thead>
              <tr className="border-b border-border">
                {['Skill', 'Buyer', 'Licence', 'Amount', 'Date', 'Status'].map(col => (
                  <th key={col} className="text-left text-text-3 text-scale-xs font-mono uppercase px-4 py-3 whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT_SALES.map((row, i) => (
                <tr key={i} className="border-b border-border-faint last:border-b-0 hover:bg-surface-2 transition-colors">
                  <td className="px-4 py-3 text-text font-display font-semibold whitespace-nowrap">{row.skill}</td>
                  <td className="px-4 py-3 text-text-2 font-mono text-scale-xs whitespace-nowrap">{row.buyer}</td>
                  <td className="px-4 py-3 text-text-3 font-mono text-scale-xs">{row.licence}</td>
                  <td className="px-4 py-3 text-mint font-display font-semibold whitespace-nowrap">{row.amount}</td>
                  <td className="px-4 py-3 text-text-3 font-mono text-scale-xs whitespace-nowrap">{row.date}</td>
                  <td className="px-4 py-3">
                    {row.status === 'Paid' ? (
                      <span className="badge-verified">{row.status}</span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 text-scale-xs font-mono border border-amber-600 text-amber-400">
                        {row.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
