import { TokensTable } from '../_components/TokensTable'

export default function TokensPage() {
  return (
    <div>
      <p className="label-eyebrow">Buyer dashboard</p>
      <h1 className="font-display font-semibold text-scale-2xl text-text mt-1 mb-8">Embed Tokens</h1>
      <p className="text-text-2 text-scale-sm mb-6 max-w-2xl">
        Embed tokens allow your purchased skills to be called from specific domains without exposing your API key.
        Revoke a token immediately if a domain is compromised.
      </p>
      <TokensTable />
    </div>
  )
}
