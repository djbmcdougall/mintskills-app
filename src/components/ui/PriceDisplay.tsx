interface PriceDisplayProps {
  amount: number
  currency?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClass = {
  sm: 'text-scale-sm',
  md: 'text-scale-md',
  lg: 'text-scale-xl',
} as const

export function PriceDisplay({ amount, currency = 'GBP', size = 'md' }: PriceDisplayProps) {
  // Always renders £ — other currencies added in a future iteration
  void currency
  const formatted = amount.toLocaleString('en-GB', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

  return (
    <span className={`text-mint font-display font-semibold ${sizeClass[size]}`}>
      £{formatted}
    </span>
  )
}
