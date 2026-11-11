import { useState, type ReactNode } from 'react'

/* Small building blocks shared by the "Bénévoles" screens. */

/** Label (small caps, secondary) + value (semibold), as in "Demande" / profile cards. */
export function Field({ label, value, size = 'md' }: { label: string; value: string; size?: 'md' | 'sm' }) {
  return (
    <>
      <p className={`font-semibold text-text-secondary uppercase ${size === 'md' ? 'text-xs' : 'text-xs'}`}>{label}</p>
      <p className={`font-semibold ${size === 'md' ? 'text-[13px]' : 'text-xs'}`}>{value}</p>
    </>
  )
}

/** Key figure row: label left, bold number right (Figma "Insight row", h 44). */
export function InsightRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-h-11 items-center justify-between gap-3 border-b border-border-default">
      <p className="text-xs text-text-secondary">{label}</p>
      <p className="text-sm font-bold">{value}</p>
    </div>
  )
}

/** Card title at 18px (most cards of this section use 18 rather than 19). */
export function SectionTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <h2 className={`text-lg font-bold ${className}`}>{children}</h2>
}

/** Filter pill ("Ce week-end ▾"): a real <select> styled like the Figma filter. */
export function FilterSelect({
  options,
  label,
  className = '',
  onChange,
}: {
  options: string[]
  label: string
  className?: string
  /** Called with the chosen option, so the screen can actually filter its content. */
  onChange?: (v: string) => void
}) {
  const [value, setValue] = useState(options[0])
  return (
    <label className={`relative flex h-10 items-center justify-center rounded-md border border-border-default bg-bg-surface px-4 ${className}`}>
      <span className="sr-only">{label}</span>
      <span aria-hidden className="pointer-events-none text-xs font-semibold whitespace-nowrap">
        {value}&nbsp;&nbsp;▾
      </span>
      <select
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          onChange?.(e.target.value)
        }}
        className="absolute inset-0 cursor-pointer opacity-0"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  )
}
