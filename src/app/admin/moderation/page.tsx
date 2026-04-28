import { ModerationQueue } from '../_components/ModerationQueue'

export default function ModerationPage() {
  return (
    <div>
      <p className="label-eyebrow">Admin</p>
      <h1 className="font-display font-semibold text-scale-2xl text-text mt-1 mb-8">Moderation Queue</h1>
      <ModerationQueue />
    </div>
  )
}
