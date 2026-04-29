import { DownloadsTable } from '../_components/DownloadsTable'

export default function DownloadsPage() {
  return (
    <div>
      <p className="label-eyebrow">Buyer dashboard</p>
      <h1 className="font-display font-semibold text-scale-2xl text-text mt-1 mb-8">Downloads</h1>
      <DownloadsTable />
    </div>
  )
}
