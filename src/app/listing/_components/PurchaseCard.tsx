'use client'

import { useState } from 'react'
import * as RadioGroup from '@radix-ui/react-radio-group'
import { ShieldCheck } from 'lucide-react'
import { MintVerifiedBadge } from '@/components/ui/MintVerifiedBadge'
import { PriceDisplay } from '@/components/ui/PriceDisplay'

interface PurchaseCardProps {
  basePrice: number
  slug: string
  mintVerified: boolean
}

const LICENCES = [
  {
    value: 'embed',
    label: 'Embed Licence',
    description: 'Rendered output only. No source code.',
    multiplier: 1,
  },
  {
    value: 'source',
    label: 'Source Licence',
    description: 'Obfuscated source download.',
    multiplier: 2.5,
  },
  {
    value: 'extended',
    label: 'Extended Commercial',
    description: 'Clean source. Client work permitted.',
    multiplier: 7,
  },
] as const

export function PurchaseCard({ basePrice, slug, mintVerified }: PurchaseCardProps) {
  const [selected, setSelected] = useState<string>('source')

  const licence = LICENCES.find(l => l.value === selected) ?? LICENCES[1]
  const price = Math.round(basePrice * licence.multiplier)

  return (
    <div className="bg-surface-2 border border-border p-6 flex flex-col gap-4">
      <PriceDisplay amount={price} size="lg" />

      <RadioGroup.Root value={selected} onValueChange={setSelected} className="flex flex-col gap-2">
        {LICENCES.map(lic => (
          <RadioGroup.Item
            key={lic.value}
            value={lic.value}
            className={`group w-full text-left border p-3 transition-colors focus:outline-none ${
              selected === lic.value
                ? 'border-mint bg-mint-dim'
                : 'border-border hover:border-border'
            }`}
          >
            <div className="flex items-start gap-2">
              <div className={`mt-0.5 w-3 h-3 rounded-full border flex-shrink-0 flex items-center justify-center ${
                selected === lic.value ? 'border-mint' : 'border-border'
              }`}>
                {selected === lic.value && (
                  <div className="w-1.5 h-1.5 rounded-full bg-mint" />
                )}
              </div>
              <div>
                <p className={`text-scale-sm font-display font-semibold ${selected === lic.value ? 'text-mint' : 'text-text'}`}>
                  {lic.label}
                </p>
                <p className="text-text-3 text-scale-xs font-mono mt-0.5">{lic.description}</p>
              </div>
              <span className="ml-auto text-text-3 text-scale-xs font-mono flex-shrink-0">
                £{Math.round(basePrice * lic.multiplier).toLocaleString('en-GB')}
              </span>
            </div>
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>

      <button className="btn-primary w-full mt-0 text-center">
        Buy — £{price.toLocaleString('en-GB')}
      </button>

      <div className="bg-bg border border-border-faint p-3 mt-0">
        <p className="text-text-3 text-scale-xs font-mono mb-1.5">
          Install command — available after purchase
        </p>
        <p className="text-text-2 text-scale-xs font-mono">
          mintskills install {slug}
        </p>
      </div>

      <div className="flex items-center gap-2 mt-0">
        <ShieldCheck size={12} className="text-text-3 flex-shrink-0" />
        <span className="text-text-3 text-scale-xs font-mono">48-hour refund window</span>
      </div>

      {mintVerified && <MintVerifiedBadge variant="full" size="sm" />}
    </div>
  )
}
