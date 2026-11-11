import { PageHeader } from '../ui'
import type { CSSProperties, ReactNode } from 'react'
import { RLink as Link } from '../RLink'
import { to, type RouteKey } from '../../routes'

/* Local components for the "divers" screens (Équipes, Documents, Paramètres).
 * The Figma tables ("Teams table", "Documents table") are a header row on
 * bg-subtle + 58px rows with fixed column widths. Here the widths become `fr`
 * tracks from md up; below md each row is stacked as a labelled card. */

export type Column = { label: string; fr: number }
export type TableRow = { cells: ReactNode[]; to?: RouteKey }

export function DataTable({ columns, rows, className = '' }: { columns: Column[]; rows: TableRow[]; className?: string }) {
  const template = { gridTemplateColumns: columns.map((c) => `${c.fr}fr`).join(' ') }
  const rowCls = 'grid min-h-[58px] items-center gap-4 border-b border-border-default px-4 py-3'

  return (
    <div className={`overflow-hidden rounded-lg border border-border-default bg-bg-surface text-[13px] ${className}`}>
      {/* Desktop header */}
      <div role="row" className={`${rowCls} hidden bg-bg-subtle font-semibold text-text-secondary md:grid`} style={template}>
        {columns.map((c) => (
          <p key={c.label} role="columnheader">
            {c.label}
          </p>
        ))}
      </div>

      {rows.map((r, i) => {
        const desktop = (
          <>
            {r.cells.map((cell, j) => (
              <p key={j} className={j === 0 ? 'font-semibold' : ''}>
                {cell}
              </p>
            ))}
          </>
        )
        const mobile = (
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold">{r.cells[0]}</p>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs">
              {r.cells.slice(1).map((cell, j) => (
                <div key={j} className="contents">
                  <dt className="text-text-secondary">{columns[j + 1].label}</dt>
                  <dd>{cell}</dd>
                </div>
              ))}
            </dl>
          </div>
        )
        const body = (
          <>
            <div className="hidden md:contents">{desktop}</div>
            <div className="md:hidden">{mobile}</div>
          </>
        )
        const cls = `${rowCls} grid-cols-1 md:[grid-template-columns:var(--cols)] ${
          r.to ? 'cursor-pointer transition-colors hover:bg-bg-subtle/60' : ''
        }`
        const style = { '--cols': template.gridTemplateColumns } as CSSProperties
        return r.to ? (
          <Link key={i} to={to(r.to)} className={cls} style={style}>
            {body}
          </Link>
        ) : (
          <div key={i} className={cls} style={style}>
            {body}
          </div>
        )
      })}
    </div>
  )
}

/** Header variant used by Équipes / Documents / Paramètres (Figma: title 24px semibold). */
export function SimpleHeader({ title, subtitle, children }: { title: string; subtitle: string; children?: ReactNode }) {
  // Unified header: every screen uses the same PageHeader (research report, consistency).
  return <PageHeader title={title} subtitle={subtitle}>{children}</PageHeader>
}
