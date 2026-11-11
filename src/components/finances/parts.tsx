import { PageHeader } from '../ui'
import { useState, type ReactNode } from 'react'
import { RLink as Link } from '../RLink'
import { Lock } from 'lucide-react'
import { to, type RouteKey } from '../../routes'
import { PERM_REASON, useRole, type Perm } from '../../roles'
import { useFeedback } from '../feedback'

/* Building blocks specific to the Finances sub-screens (Transactions, Budget,
 * Factures, Objectifs). These Figma screens use a compact variant of the page
 * header / buttons / metrics (24px title, 40px buttons, radius 8–12), which the
 * shared ui.tsx components don't express. */

/** Compact page header: 24px semibold title + subtitle, actions on the right. */
export function CompactHeader({ title, subtitle, children }: { title: string; subtitle?: string; children?: ReactNode }) {
  // Unified header: every screen uses the same PageHeader (research report, consistency).
  return <PageHeader title={title} subtitle={subtitle}>{children}</PageHeader>
}

/** Compact Button/Primary or Button/Secondary (h 40, radius 8, 13px). */
export function SmallButton({
  primary = false,
  to: target,
  onClick,
  pressed,
  requires,
  className = '',
  children,
}: {
  primary?: boolean
  to?: RouteKey
  onClick?: () => void
  pressed?: boolean
  /** Permission required: without it the button is disabled and the reason is shown. */
  requires?: Perm
  className?: string
  children: ReactNode
}) {
  const { can } = useRole()
  const { comingSoon } = useFeedback()
  const cls = `inline-flex h-11 items-center justify-center rounded-lg px-4 text-[13px] font-semibold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary ${
    primary
      ? 'bg-action-primary text-text-inverse hover:bg-action-primary-hover sm:min-w-[172px]'
      : 'border border-border-default bg-bg-surface text-text-primary hover:bg-bg-subtle sm:min-w-[156px]'
  } ${className}`
  if (requires && !can(requires)) {
    const reason = PERM_REASON[requires] ?? 'Votre rôle ne permet pas cette action.'
    return (
      <span className="inline-flex flex-col gap-1">
        <button type="button" disabled title={reason} className={`${cls} cursor-not-allowed opacity-45`}>
          <Lock className="mr-2 size-4" aria-hidden />
          {children}
        </button>
        <span className="max-w-[240px] text-xs text-text-secondary">{reason}</span>
      </span>
    )
  }
  if (target)
    return (
      <Link to={to(target)} className={cls}>
        {children}
      </Link>
    )
  return (
    <button
      type="button"
      onClick={onClick ?? (() => comingSoon(typeof children === 'string' ? children : undefined))}
      aria-pressed={pressed}
      className={cls}
    >
      {children}
    </button>
  )
}

/** Metric tile of the sub-screens: uppercase 11px label, 28px semibold value. */
export function SmallMetric({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-3 rounded-lg border border-border-default bg-bg-surface p-[18px] xl:min-h-28">
      <p className="text-xs font-semibold text-text-secondary">{label}</p>
      <p className="text-2xl font-semibold sm:text-[28px]">{value}</p>
      {hint && <p className="text-xs text-text-secondary">{hint}</p>}
    </div>
  )
}

export function MetricGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">{children}</div>
}

/** Row of filter buttons: the selected one is rendered as Button/Primary.
 *  Pass `onChange` to actually filter the content below. */
export function FilterTabs({ options, initial, onChange }: { options: string[]; initial: string; onChange?: (v: string) => void }) {
  const [current, setCurrent] = useState(initial)
  return (
    <div className="flex flex-wrap gap-3" role="group" aria-label="Filtres">
      {options.map((o) => (
        <SmallButton
          key={o}
          primary={o === current}
          pressed={o === current}
          onClick={() => {
            setCurrent(o)
            onChange?.(o)
          }}
        >
          {o}
        </SmallButton>
      ))}
    </div>
  )
}

export type TableRow = { cells: ReactNode[]; to?: RouteKey }

/** "Table row" pattern: grey header row, 56px rows, first column semibold.
 *  `cols` are the Figma column widths, used as `fr`. Scrolls horizontally on
 *  narrow screens instead of squeezing. */
export function DataTable({
  cols,
  head,
  rows,
  minWidth = 640,
  className = '',
}: {
  cols: number[]
  head: string[]
  rows: TableRow[]
  minWidth?: number
  className?: string
}) {
  const grid = { gridTemplateColumns: cols.map((c) => `${c}fr`).join(' ') }
  const rowCls = 'grid min-h-14 items-center gap-4 border-b border-border-default px-4 py-2 text-[13px]'
  return (
    <div className={`min-w-0 overflow-x-auto rounded-lg border border-border-default bg-bg-surface ${className}`}>
      <div role="table" style={{ minWidth }}>
        <div role="row" className={`${rowCls} bg-bg-subtle`} style={grid}>
          {head.map((h, i) => (
            <span role="columnheader" key={h} className={i === 0 ? 'font-semibold' : ''}>
              {h}
            </span>
          ))}
        </div>
        {rows.map((r, ri) => {
          const cells = r.cells.map((c, i) => (
            <span role="cell" key={i} className={i === 0 ? 'font-semibold' : ''}>
              {c}
            </span>
          ))
          return r.to ? (
            <Link key={ri} role="row" to={to(r.to)} className={`${rowCls} transition-colors hover:bg-bg-subtle/60`} style={grid}>
              {cells}
            </Link>
          ) : (
            <div key={ri} role="row" className={rowCls} style={grid}>
              {cells}
            </div>
          )
        })}
      </div>
    </div>
  )
}
