import { PurchasesTable } from './_components/PurchasesTable'

export default function PurchasesPage() {
  return (
    <div>
      <p className="label-eyebrow">Buyer dashboard</p>
      <h1 className="font-display font-semibold text-scale-2xl text-text mt-1 mb-8">Purchases</h1>
      <PurchasesTable />
    </div>
  )
}
