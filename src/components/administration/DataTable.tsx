import type { ReactNode } from 'react'
import { RLink as Link } from '../RLink'
import { Badge, type Tone } from '../ui'
import { to, type RouteKey } from '../../routes'

/* Administration list tables ("Table", "Dossiers", "Files"): a white card of
 * 64px rows — bold first cell, secondary cells, then a status badge.
 * ≥768px: a CSS grid whose column template comes from the Figma column
 * widths (as `fr`). Below: each row stacks into a small card-like block. */

export type TableRow = {
  cells: string[]
  status: string
  /** Explicit status tone when the label alone is ambiguous. */
  tone?: Tone
  to?: RouteKey
}

export function DataTable({
  cols,
  header,
  rows,
  className = '',
}: {
  /** Tailwind grid template for ≥md, e.g. `md:grid-cols-[300fr_150fr_220fr_110fr]` (cells + status). */
  cols: string
  header?: string[]
  rows: TableRow[]
  className?: string
}) {
  const grid = `md:grid md:items-center md:gap-0 ${cols}`
  return (
    <section
      className={`flex min-w-0 flex-col overflow-hidden rounded-lg border border-border-default bg-bg-surface ${className}`}
    >
      {header && (
        <div className={`hidden h-11 bg-bg-subtle px-[18px] text-xs font-semibold text-text-secondary ${grid}`}>
          {header.map((h) => (
            <p key={h}>{h}</p>
          ))}
        </div>
      )}
      {rows.map((r) => {
        const cls = `flex flex-col gap-1.5 border-b border-border-default px-[18px] py-3.5 text-left md:min-h-16 md:py-2 ${grid} ${
          r.to ? 'cursor-pointer transition-colors hover:bg-bg-subtle/60' : ''
        }`
        const inner: ReactNode = (
          <>
            {r.cells.map((c, i) =>
              i === 0 ? (
                <p key={i} className="pr-3 text-[13px] font-semibold text-text-primary">
                  {c}
                </p>
              ) : (
                <p key={i} className="pr-3 text-[13px] text-text-secondary">
                  {c}
                </p>
              ),
            )}
            <div className="pt-1 md:pt-0">
              <Badge tone={r.tone}>{r.status}</Badge>
            </div>
          </>
        )
        return r.to ? (
          <Link key={r.cells[0]} to={to(r.to)} className={cls}>
            {inner}
          </Link>
        ) : (
          <div key={r.cells[0]} className={cls}>
            {inner}
          </div>
        )
      })}
    </section>
  )
}

/** Wide white panel: bold text block on the left, one action on the right (Governance / Upcoming meeting / Decision alert). */
export function ActionPanel({ children, action, padding = 'p-[18px]' }: { children: ReactNode; action: ReactNode; padding?: string }) {
  return (
    <section
      className={`flex flex-col gap-4 rounded-lg border border-border-default bg-bg-surface sm:min-h-[100px] sm:flex-row sm:items-center sm:justify-between ${padding}`}
    >
      <div className="flex min-w-0 flex-col gap-[3px]">{children}</div>
      <div className="shrink-0">{action}</div>
    </section>
  )
}
