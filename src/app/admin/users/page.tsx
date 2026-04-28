const USERS = [
  { id: 'usr-001', email: 'elena.torres@example.com',   role: 'creator', joined: '12 Jan 2026', listings: 4,  purchases: 0  },
  { id: 'usr-002', email: 'amir.hassan@example.com',    role: 'creator', joined: '18 Jan 2026', listings: 7,  purchases: 0  },
  { id: 'usr-003', email: 'buyer_***@gmail.com',        role: 'buyer',   joined: '24 Jan 2026', listings: 0,  purchases: 11 },
  { id: 'usr-004', email: 'lena.fischer@example.com',   role: 'creator', joined: '02 Feb 2026', listings: 2,  purchases: 3  },
  { id: 'usr-005', email: 'marcus.webb@example.com',    role: 'creator', joined: '09 Feb 2026', listings: 5,  purchases: 1  },
  { id: 'usr-006', email: 'buyer2_***@hotmail.com',     role: 'buyer',   joined: '14 Feb 2026', listings: 0,  purchases: 6  },
  { id: 'usr-007', email: 'alain.dupont@example.com',   role: 'creator', joined: '20 Feb 2026', listings: 12, purchases: 0  },
  { id: 'usr-008', email: 'isabelle.l@example.com',     role: 'creator', joined: '01 Mar 2026', listings: 3,  purchases: 2  },
]

function RoleBadge({ role }: { role: string }) {
  if (role === 'creator') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 text-scale-xs font-mono border border-mint text-mint">
        Creator
      </span>
    )
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 text-scale-xs font-mono border border-border text-text-3">
      Buyer
    </span>
  )
}

export default function UsersPage() {
  return (
    <div>
      <p className="label-eyebrow">Admin</p>
      <h1 className="font-display font-semibold text-scale-2xl text-text mt-1 mb-8">Users</h1>

      <div className="bg-surface border border-border overflow-x-auto">
        <table className="w-full text-scale-sm">
          <thead>
            <tr className="border-b border-border">
              {['Email', 'Role', 'Joined', 'Listings', 'Purchases'].map(col => (
                <th key={col} className="text-left text-text-3 text-scale-xs font-mono uppercase px-4 py-3 whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {USERS.map(user => (
              <tr key={user.id} className="border-b border-border-faint last:border-b-0 hover:bg-surface-2 transition-colors">
                <td className="px-4 py-3 text-text-2 font-mono text-scale-xs whitespace-nowrap">{user.email}</td>
                <td className="px-4 py-3"><RoleBadge role={user.role} /></td>
                <td className="px-4 py-3 text-text-3 font-mono text-scale-xs whitespace-nowrap">{user.joined}</td>
                <td className="px-4 py-3 text-text-2 text-scale-xs font-mono">{user.listings}</td>
                <td className="px-4 py-3 text-text-2 text-scale-xs font-mono">{user.purchases}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
