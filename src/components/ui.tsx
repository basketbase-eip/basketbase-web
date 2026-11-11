import type { ReactNode } from 'react'
import { RLink as Link } from './RLink'
import { AlertTriangle, Check, Circle, Clock3, Lock, XCircle } from 'lucide-react'
import { to, type RouteKey } from '../routes'
import { PERM_REASON, useRole, type Perm } from '../roles'
import { useFeedback } from './feedback'

/* ------------------------------------------------------------------ *
 * Shared building blocks, mapped 1:1 to the Figma components
 * (02 — Components): Button/Primary, Button/Secondary, Status/Badge,
 * Navigation/Item, plus the recurring cards/rows used on every screen.
 * Every component that navigates takes `to` (a route key) and renders a
 * real link; without `to` it renders a button.
 * ------------------------------------------------------------------ */

type Clickable = {
  to?: RouteKey
  onClick?: () => void
  className?: string
  children: ReactNode
  /** Permission required. Without it the control is shown disabled with the reason. */
  requires?: Perm
  /** Toast shown when the action has no destination yet (instead of a dead button). */
  soonLabel?: string
}

function Clickable({ to: target, onClick, className, children, requires, soonLabel }: Clickable) {
  const { can } = useRole()
  const { comingSoon } = useFeedback()
  if (requires && !can(requires)) {
    const reason = PERM_REASON[requires] ?? 'Votre rôle ne permet pas cette action.'
    return (
      <span className="inline-flex flex-col gap-1">
        <button type="button" disabled aria-describedby={undefined} title={reason} className={`${className} cursor-not-allowed opacity-45`}>
          <Lock className="mr-2 size-4" aria-hidden />
          {children}
        </button>
        <span className="max-w-[240px] text-xs text-text-secondary">{reason}</span>
      </span>
    )
  }
  if (target)
    return (
      <Link to={to(target)} className={className}>
        {children}
      </Link>
    )
  const label = soonLabel ?? (typeof children === 'string' ? children : undefined)
  return (
    <button type="button" onClick={onClick ?? (() => comingSoon(label))} className={className}>
      {children}
    </button>
  )
}

const btnBase =
  'inline-flex h-12 items-center justify-center rounded-md px-4 text-[15px] font-medium whitespace-nowrap transition-[background-color,transform] duration-150 active:scale-[0.98] lg:h-10 lg:text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary'

type BtnProps = Omit<Clickable, 'className'> & { wide?: boolean; className?: string }

/** Button/Primary — action of highest priority, one per decision area. */
export function ButtonPrimary({ wide = true, ...p }: BtnProps) {
  return (
    <Clickable
      {...p}
      className={`${btnBase} bg-action-primary text-text-inverse hover:bg-action-primary-hover ${wide ? 'sm:min-w-[160px]' : ''} ${p.className ?? ''}`}
    />
  )
}

/** Button/Secondary — complementary action or local navigation. */
export function ButtonSecondary({ wide = true, ...p }: BtnProps) {
  return (
    <Clickable
      {...p}
      className={`${btnBase} border border-border-strong bg-bg-surface text-text-primary hover:bg-bg-subtle ${wide ? 'sm:min-w-[160px]' : ''} ${p.className ?? ''}`}
    />
  )
}

/* ---------------------------- Status system ---------------------------- *
 * One status component for the whole club (research report, Carbon pattern):
 * icon + text label + colour tone — never colour alone.
 * Tone is inferred from the label when not given, so every screen gets it. */

export type Tone = 'success' | 'info' | 'warning' | 'danger' | 'neutral'

const norm = (t: string) => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
const KEYWORDS: [Tone, string[]][] = [
  ['danger', ['urgent', 'bloque', 'bloquant', 'blocage', 'manque', 'manquent', 'expire', 'refuse', 'en retard', 'retard', 'absent', 'impaye', 'a pourvoir', 'conflit', 'critique', 'non conforme', 'annule', 'echec', 'depasse', 'surcharge']],
  ['warning', ['a confirmer', 'a verifier', 'a completer', 'incomplet', 'en attente', 'a relancer', 'relance', 'a renouveler', 'attention', 'a traiter', 'partiel', 'a valider', 'a programmer', 'sans reponse', 'non confirme', 'a signer', 'a preparer', 'a planifier', 'a controler', 'a rapprocher', 'a payer', 'piece', 'a envoyer', 'non lu', 'a cloturer', 'bientot', 'faible', 'a revoir']],
  ['info', ['en cours', 'propose', 'soumis', 'planifie', 'programme', 'prevu', 'en preparation', 'brouillon', 'nouveau', 'invite', 'reserve', 'a venir']],
  ['success', ['pret', 'confirme', 'valide', 'paye', 'rembourse', 'pourvu', 'a jour', 'complet', 'envoye', 'approuve', 'present', 'actif', 'conforme', 'signe', 'termine', 'publie', 'disponible', 'recu', 'active', 'ok', 'regle', 'encaisse', 'atteint', 'lu', 'fait', 'couvert', 'adopte']],
]

export function toneOf(label: ReactNode): Tone {
  if (typeof label !== 'string') return 'neutral'
  const t = norm(label)
  for (const [tone, words] of KEYWORDS) if (words.some((w) => new RegExp(`(^|[^a-z])${w}e?s?(?![a-z])`).test(t))) return tone
  return 'neutral'
}

const TONE_STYLE: Record<Tone, { cls: string; Icon: typeof Check }> = {
  success: { cls: 'bg-success-bg text-success-fg', Icon: Check },
  info: { cls: 'bg-info-bg text-info-fg', Icon: Clock3 },
  warning: { cls: 'bg-warning-bg text-warning-fg', Icon: AlertTriangle },
  danger: { cls: 'bg-danger-bg text-danger-fg', Icon: XCircle },
  neutral: { cls: 'bg-bg-subtle text-text-secondary', Icon: Circle },
}

/** Status/Badge — icon + label + tone. `inverse` = white pill on dark panels. */
export function Badge({
  children,
  tone,
  inverse = false,
  size = 'md',
  className = '',
}: {
  children: ReactNode
  tone?: Tone
  inverse?: boolean
  size?: 'md' | 'sm'
  className?: string
}) {
  const t = tone ?? toneOf(children)
  const { cls, Icon } = TONE_STYLE[t]
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-sm px-2 font-medium whitespace-nowrap ${
        size === 'md' ? 'h-[26px] min-w-[108px] text-[13px]' : 'h-6 text-xs'
      } ${inverse ? 'bg-bg-surface text-text-primary' : cls} ${className}`}
    >
      <Icon className={size === 'md' ? 'size-3.5' : 'size-3'} strokeWidth={2.4} aria-hidden />
      {children}
    </span>
  )
}

/** Page header — the same everywhere: title, optional subtitle, 1–2 actions. */
export function PageHeader({ title, subtitle, children }: { title: string; subtitle?: string; children?: ReactNode }) {
  return (
    <header className="flex w-full flex-col gap-4 sm:min-h-16 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-col gap-1">
        <h1 className="text-[22px] leading-7 font-semibold tracking-[-0.015em] lg:text-2xl lg:leading-8">{title}</h1>
        {subtitle && <p className="text-[15px] text-text-secondary lg:text-sm">{subtitle}</p>}
      </div>
      {children && <div className="flex flex-wrap items-start gap-3">{children}</div>}
    </header>
  )
}

/** Breadcrumb used on secondary screens ("Accueil › Événements › …"). */
export function Breadcrumb({ items }: { items: { label: string; to?: RouteKey }[] }) {
  return (
    <nav aria-label="Fil d’Ariane" className="flex flex-wrap items-center gap-2 text-[13px] text-text-secondary">
      {items.map((it, i) => {
        const last = i === items.length - 1
        return (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden>›</span>}
            {it.to ? (
              <Link to={to(it.to)} className="font-medium hover:text-text-primary hover:underline">
                {it.label}
              </Link>
            ) : (
              <span className={`font-medium ${last ? 'text-text-primary' : ''}`} aria-current={last ? 'page' : undefined}>
                {it.label}
              </span>
            )}
          </span>
        )
      })}
    </nav>
  )
}

/** Flat white surface, 1px border, radius 8 — no shadow (only floating layers get shadows). */
export function Card({ children, className = '', padding = 'p-5 sm:p-6' }: { children: ReactNode; className?: string; padding?: string }) {
  return (
    <section className={`flex min-w-0 flex-col gap-3 rounded-lg border border-border-default bg-bg-surface ${padding} ${className}`}>
      {children}
    </section>
  )
}

export function CardTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <>
      <h2 className="text-lg leading-[26px] font-semibold">{title}</h2>
      {subtitle && <p className="text-sm text-text-secondary">{subtitle}</p>}
    </>
  )
}

/** Metric tile: label, big value, hint. */
export function Metric({ label, value, hint, className = '' }: { label: string; value: string; hint?: string; className?: string }) {
  return (
    <div className={`flex min-w-0 flex-col gap-2 rounded-lg border border-border-default bg-bg-surface p-4 ${className}`}>
      <p className="text-[13px] font-medium text-text-secondary">{label}</p>
      <p className="text-2xl leading-8 font-semibold tracking-[-0.01em] tabular-nums">{value}</p>
      {hint && <p className="text-[13px] text-text-secondary">{hint}</p>}
    </div>
  )
}

/** Progress bar (Figma "Progress": h 8, radius 4). `value` 0–100; omit to show the empty track only. */
export function Progress({ value, className = '' }: { value?: number; className?: string }) {
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-bg-subtle ${className}`}>
      {value !== undefined && <div className="h-full rounded-full bg-action-primary" style={{ width: `${value}%` }} />}
    </div>
  )
}

/** Row with a label on the left and something on the right, separated by a bottom border. */
export function Row({
  to: target,
  children,
  right,
  className = 'min-h-[42px]',
}: {
  to?: RouteKey
  children: ReactNode
  right?: ReactNode
  className?: string
}) {
  const cls = `flex w-full items-center justify-between gap-3 border-b border-border-default py-2.5 text-left ${className} ${
    target ? 'cursor-pointer transition-colors hover:bg-bg-subtle/60' : ''
  }`
  const inner = (
    <>
      <div className="min-w-0">{children}</div>
      {right}
    </>
  )
  return target ? (
    <Link to={to(target)} className={cls}>
      {inner}
    </Link>
  ) : (
    <div className={cls}>{inner}</div>
  )
}

/** Two-line text used inside rows: bold title + secondary line. */
export function RowText({ title, meta }: { title: ReactNode; meta?: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-[3px]">
      <p className="font-medium">{title}</p>
      {meta && <p className="text-sm text-text-secondary">{meta}</p>}
    </div>
  )
}

/** Small uppercase label (e.g. "PRIORITÉ DU JOUR"). */
export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`text-[13px] font-medium ${className}`}>{children}</p>
}

/** Dark highlight panel (Figma "Priority": bg action-primary, radius 16, padding 28). */
export function DarkPanel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={`flex w-full flex-col gap-5 rounded-xl bg-action-primary p-6 text-text-inverse sm:p-7 md:flex-row md:items-center md:justify-between ${className}`}
    >
      {children}
    </section>
  )
}
