import { notFound } from 'next/navigation'
import Link from 'next/link'
import * as Accordion from '@radix-ui/react-accordion'
import { ChevronDown, Star } from 'lucide-react'
import { AppLayout } from '@/components/layout/AppLayout'
import { MintVerifiedBadge } from '@/components/ui/MintVerifiedBadge'
import { CategoryBadge } from '@/components/ui/CategoryBadge'
import { PlatformBadge } from '@/components/ui/PlatformBadge'
import { SkillCard } from '@/components/ui/SkillCard'
import { PurchaseCard } from '../_components/PurchaseCard'
import { FIXTURE_LISTINGS } from '@/lib/fixtures/listings'
import { CATEGORY_LABELS } from '@/lib/categories'

const LEGAL_COMPLIANCE: (typeof FIXTURE_LISTINGS)[number] = {
  title: 'Legal Compliance Checker',
  slug: 'legal-compliance-checker',
  description: 'Scans contract drafts, privacy policies, and terms of service against GDPR, UK Data Protection Act 2018, and sector-specific regulations. Flags non-compliant clauses and suggests remediation.',
  price: 49,
  currency: 'GBP',
  category: 'cowork_compliance',
  tags: ['gdpr', 'legal', 'compliance', 'privacy'],
  platforms: ['claude-code', 'cowork'],
  creatorName: 'Isabelle Laurent',
  mintVerified: true,
  installCount: 734,
  rating: 4.9,
  deliveryModel: 'embed',
  isFree: false,
}

const VERIFICATION_STAGES = [
  {
    value: 'stage-1',
    trigger: 'Stage 1 — Static Analysis',
    content: 'Scanned for outbound network calls, credential reads, eval/exec. Clean.',
  },
  {
    value: 'stage-2',
    trigger: 'Stage 2 — Dependency Verification',
    content: 'All referenced packages verified against npm and pip registries. No known CVEs.',
  },
  {
    value: 'stage-3',
    trigger: 'Stage 3 — Content Hashing',
    content: 'SHA-256 hash stored at publication time. Tampering is detectable.',
  },
  {
    value: 'stage-4',
    trigger: 'Stage 4 — Similarity Analysis',
    content: 'No near-duplicate listings detected.',
  },
]

const REVIEWS = [
  {
    id: '1',
    name: 'Marcus Webb',
    initials: 'MW',
    rating: 5,
    date: '12 Apr 2026',
    comment: 'Cut our contract review time by 80%. The GDPR clause detection is especially accurate — flagged a data retention issue our legal team had missed.',
  },
  {
    id: '2',
    name: 'Priya Nair',
    initials: 'PN',
    rating: 5,
    date: '28 Mar 2026',
    comment: 'Works brilliantly with the Cowork platform. The suggested remediation copy is good enough to use almost verbatim.',
  },
  {
    id: '3',
    name: 'Tom Fielding',
    initials: 'TF',
    rating: 4,
    date: '15 Mar 2026',
    comment: 'Solid skill. Would benefit from support for US CCPA regulations — currently UK and EU focused. Still, exceptional for those jurisdictions.',
  },
]

function Stars({ count }: { count: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={12}
          className={i < count ? 'text-mint fill-mint' : 'text-text-3'}
        />
      ))}
    </span>
  )
}

function initials(name: string) {
  return name.split(' ').slice(0, 2).map(p => p[0]?.toUpperCase() ?? '').join('')
}

export default async function ListingPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  if (slug !== 'legal-compliance-checker') notFound()

  const listing = LEGAL_COMPLIANCE
  const categoryLabel = CATEGORY_LABELS[listing.category] ?? listing.category
  const relatedListings = FIXTURE_LISTINGS.filter(l => l.slug !== listing.slug).slice(0, 3)

  return (
    <AppLayout>
      {/* Breadcrumb */}
      <nav className="font-mono text-scale-xs text-text-3 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-text-2 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/browse" className="hover:text-text-2 transition-colors">Browse</Link>
        <span>/</span>
        <Link href={`/browse/${listing.category}`} className="hover:text-text-2 transition-colors">{categoryLabel}</Link>
        <span>/</span>
        <span className="text-text-2">{listing.title}</span>
      </nav>

      <div className="mt-8 flex flex-col lg:flex-row gap-10 items-start">
        {/* LEFT COLUMN */}
        <div className="flex-1 min-w-0">
          <h1 className="font-display font-bold text-scale-3xl text-text leading-tight">
            {listing.title}
          </h1>

          {/* Creator row */}
          <div className="flex items-center gap-3 mt-4">
            <span className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center text-text-3 text-scale-xs font-mono flex-shrink-0">
              {initials(listing.creatorName)}
            </span>
            <span className="text-text-2 text-scale-sm">{listing.creatorName}</span>
            {listing.mintVerified && <MintVerifiedBadge variant="full" size="sm" />}
          </div>

          {/* Description */}
          <div className="mt-6 text-text text-scale-base leading-relaxed max-w-prose">
            <p>{listing.description}</p>
            <p className="mt-4">
              The checker analyses document structure, identifies jurisdictional applicability, and maps each clause against a curated database of regulatory requirements. Output is a structured report with severity ratings — critical, advisory, and informational — alongside model remediation language.
            </p>
            <p className="mt-4">
              Tested against 200+ real-world contracts. Consistently outperforms generic LLM prompting on UK and EU compliance specificity. Designed for use by legal ops teams, startup founders, and compliance officers who need a first-pass review before engaging outside counsel.
            </p>
          </div>

          {/* Platforms */}
          <div className="flex flex-wrap gap-1.5 mt-4">
            {listing.platforms.map(p => (
              <PlatformBadge key={p} platform={p} />
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            <CategoryBadge category={listing.category} size="sm" />
            {listing.tags.map(tag => (
              <span key={tag} className="bg-surface-2 border border-border-faint text-text-3 text-scale-xs px-2 py-0.5 font-mono">
                {tag}
              </span>
            ))}
          </div>

          {/* Version */}
          <p className="font-mono text-scale-xs text-text-3 mt-3">
            v1.4.2 · Updated 14 Apr 2026
          </p>

          {/* Mint Verified Accordion */}
          <div className="mt-8">
            <p className="label-eyebrow mb-4">Mint Verified</p>
            <Accordion.Root type="multiple" className="flex flex-col gap-0">
              {VERIFICATION_STAGES.map(stage => (
                <Accordion.Item key={stage.value} value={stage.value} className="border-l-2 border-mint border-b border-border last:border-b-0">
                  <Accordion.Trigger className="group flex items-center justify-between w-full px-4 py-3 text-text text-scale-sm font-display text-left hover:text-mint transition-colors">
                    {stage.trigger}
                    <ChevronDown
                      size={14}
                      className="text-text-3 transition-transform group-data-[state=open]:rotate-180 flex-shrink-0"
                    />
                  </Accordion.Trigger>
                  <Accordion.Content className="overflow-hidden data-[state=open]:animate-[accordionDown_150ms_ease] data-[state=closed]:animate-[accordionUp_150ms_ease]">
                    <p className="text-text-2 text-scale-sm px-4 pb-3">
                      {stage.content}
                    </p>
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </div>

          {/* Reviews */}
          <div className="mt-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="font-display font-semibold text-scale-xl text-text">4.8</span>
              <Stars count={5} />
              <span className="text-text-3 text-scale-sm font-mono">23 reviews</span>
            </div>

            <div className="flex flex-col gap-5">
              {REVIEWS.map(review => (
                <div key={review.id} className="bg-surface border border-border p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center text-text-3 text-scale-xs font-mono flex-shrink-0">
                      {review.initials}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-text text-scale-sm font-semibold">{review.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Stars count={review.rating} />
                        <span className="text-text-3 text-scale-xs font-mono">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-text-2 text-scale-sm leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>

          {/* More from this creator */}
          <div className="mt-10">
            <p className="label-eyebrow mb-4">More from {listing.creatorName}</p>
            <div className="flex gap-5 overflow-x-auto pb-2 snap-x">
              {relatedListings.map(l => (
                <div key={l.slug} className="min-w-[280px] snap-start">
                  <SkillCard {...l} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 lg:sticky lg:top-24">
          <PurchaseCard
            basePrice={listing.price}
            slug={listing.slug}
            mintVerified={listing.mintVerified}
          />
        </div>
      </div>
    </AppLayout>
  )
}
