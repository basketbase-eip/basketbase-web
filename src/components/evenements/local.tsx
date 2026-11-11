import { Badge, PageHeader } from '../ui'
import type { ReactNode } from 'react'

/* Small building blocks local to the "evenements" group (À traiter, espaces,
 * Événements screens) that the shared ui.tsx doesn't express exactly. */

/** Compact header used on "À traiter" / "Changer d’espace" (Figma: title 24px semibold). */
export function CompactHeader({ title, subtitle, children }: { title: string; subtitle: string; children?: ReactNode }) {
  // Unified header: every screen uses the same PageHeader (research report, consistency).
  return <PageHeader title={title} subtitle={subtitle}>{children}</PageHeader>
}

/** Compact status pill (Figma "Status · …": 11px semibold, padding 7/10, radius 14, no min width). */
export function Pill({ children }: { children: ReactNode }) {
  return <Badge size="sm">{children}</Badge>
}

/** Segmented filter chips (active: bg-subtle semibold; idle: border-default regular). */
export function FilterChips<T extends string>({
  options,
  value,
  onChange,
  label = 'Filtres',
}: {
  label?: string
  options: readonly T[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
      {options.map((o) => {
        const active = o === value
        return (
          <button
            key={o}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o)}
            className={`min-h-10 rounded-lg px-3.5 py-2 text-xs whitespace-nowrap transition-colors ${
              active ? 'bg-action-primary font-semibold text-text-inverse' : 'border border-border-default bg-bg-surface hover:bg-bg-subtle'
            }`}
          >
            {o}
          </button>
        )
      })}
    </div>
  )
}
