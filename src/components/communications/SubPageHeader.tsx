import { PageHeader } from '../ui'
import type { ReactNode } from 'react'

/** Header of the secondary Communications screens: Figma uses a 24px semibold
 *  title (vs. 30px bold in the shared PageHeader) with the action on the right. */
export function SubPageHeader({ title, subtitle, children }: { title: string; subtitle?: string; children?: ReactNode }) {
  // Unified header: every screen uses the same PageHeader (research report, consistency).
  return <PageHeader title={title} subtitle={subtitle}>{children}</PageHeader>
}

/** Small uppercase-ish field label + value used in the settings panel. */
export function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold text-text-secondary">{label}</p>
      <p className="text-[13px] font-semibold">{value}</p>
    </div>
  )
}
