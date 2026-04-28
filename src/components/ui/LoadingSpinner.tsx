interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
}

const dimensions = {
  sm: 'w-4 h-4 border-2',
  md: 'w-7 h-7 border-2',
  lg: 'w-10 h-10 border-[3px]',
} as const

export function LoadingSpinner({ size = 'md' }: LoadingSpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`${dimensions[size]} inline-block rounded-full border-mint border-t-transparent animate-spin`}
    />
  )
}
