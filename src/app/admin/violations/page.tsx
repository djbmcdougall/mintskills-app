import { ViolationsTable } from '../_components/ViolationsTable'

export default function ViolationsPage() {
  return (
    <div>
      <p className="label-eyebrow">Admin</p>
      <h1 className="font-display font-semibold text-scale-2xl text-text mt-1 mb-8">Violations</h1>
      <ViolationsTable />
    </div>
  )
}
