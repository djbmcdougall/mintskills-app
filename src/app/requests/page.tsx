import Link from 'next/link'
import * as Tabs from '@radix-ui/react-tabs'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageHeader } from '@/components/ui/PageHeader'
import { RequestCard } from '@/components/ui/RequestCard'
import { FIXTURE_REQUESTS } from '@/lib/fixtures/requests'

type SortKey = 'all' | 'upvoted' | 'newest' | 'fulfilled'

const TAB_LABELS: { value: SortKey; label: string }[] = [
  { value: 'all',       label: 'All' },
  { value: 'upvoted',  label: 'Most Upvoted' },
  { value: 'newest',   label: 'Newest' },
  { value: 'fulfilled', label: 'Fulfilled' },
]

function sortedRequests(key: SortKey) {
  const all = FIXTURE_REQUESTS
  if (key === 'upvoted')  return [...all].sort((a, b) => b.upvoteCount - a.upvoteCount)
  if (key === 'newest')   return [...all].reverse()
  if (key === 'fulfilled') return all.filter(r => r.status === 'fulfilled')
  return all
}

export default function RequestsPage() {
  return (
    <AppLayout>
      <PageHeader
        eyebrow="Community"
        title="What skill do you need?"
        description="Post a request. Creators build to demand."
        actions={
          <Link href="/requests/new" className="btn-primary">
            Post a Request
          </Link>
        }
      />

      <Tabs.Root defaultValue="all" className="mt-8">
        <Tabs.List className="flex border-b border-border mb-6">
          {TAB_LABELS.map(tab => (
            <Tabs.Trigger
              key={tab.value}
              value={tab.value}
              className="px-4 py-2.5 text-scale-sm font-mono text-text-2 -mb-px border-b-2 border-transparent data-[state=active]:text-mint data-[state=active]:border-mint transition-colors"
            >
              {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {TAB_LABELS.map(tab => (
          <Tabs.Content key={tab.value} value={tab.value}>
            {(() => {
              const requests = sortedRequests(tab.value)
              if (requests.length === 0) {
                return (
                  <p className="text-text-3 text-scale-sm font-mono py-12 text-center">
                    No fulfilled requests yet.
                  </p>
                )
              }
              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {requests.map(req => (
                    <RequestCard key={req.id} {...req} />
                  ))}
                </div>
              )
            })()}
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </AppLayout>
  )
}
