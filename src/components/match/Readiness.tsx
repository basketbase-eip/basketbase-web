// Building blocks of the match "Préparation" tab (research report, « Préparer un
// match à domicile »): a global ready / not-ready banner and a readiness checklist
// grouped by severity. Each line = status badge + what + who + one action.
import type { ReactNode } from 'react'
import { UserRound } from 'lucide-react'
import { Badge, Progress, type Tone } from '../ui'

export type Severity = 'bloquant' | 'verifier' | 'pret'

export const SEVERITY: Record<Severity, { label: string; tone: Tone; hint: string }> = {
  bloquant: { label: 'Bloquant', tone: 'danger', hint: 'Le match ne peut pas se jouer en règle sans ces points.' },
  verifier: { label: 'À vérifier', tone: 'warning', hint: 'À suivre d’ici samedi, sans bloquer le match.' },
  pret: { label: 'Prêt', tone: 'success', hint: 'Rien à faire.' },
}

const plural = (n: number, one: string, many: string) => `${n} ${n > 1 ? many : one}`

/** Global banner: "Pas encore prêt · N points bloquants" / "Prêt pour le match". Updates live. */
export function ReadinessBanner({ blocking, toCheck, ready, total, children }: { blocking: number; toCheck: number; ready: number; total: number; children?: ReactNode }) {
  const state: Severity = blocking > 0 ? 'bloquant' : toCheck > 0 ? 'verifier' : 'pret'
  const title =
    state === 'bloquant'
      ? `Pas encore prêt · ${plural(blocking, 'point bloquant', 'points bloquants')}`
      : state === 'verifier'
        ? `Aucun point bloquant · ${plural(toCheck, 'point à vérifier', 'points à vérifier')}`
        : 'Prêt pour le match'
  const badge = state === 'bloquant' ? 'Pas prêt' : state === 'verifier' ? 'Presque prêt' : 'Prêt'
  return (
    <section
      aria-labelledby="readiness-title"
      className={`flex flex-col gap-4 rounded-lg border border-border-default bg-bg-surface px-5 py-5 sm:px-6 md:flex-row md:items-center md:justify-between`}
    >
      <div className="flex min-w-0 flex-col gap-2" aria-live="polite">
        <Badge tone={SEVERITY[state].tone} className="self-start">{badge}</Badge>
        <h2 id="readiness-title" className="text-xl font-bold">
          {title}
        </h2>
        <p className="text-[13px] text-text-secondary">
          {plural(ready, 'point prêt', 'points prêts')} sur {total}
          {state !== 'pret' && toCheck > 0 && blocking > 0 ? ` · ${plural(toCheck, 'point à vérifier', 'points à vérifier')}` : ''}
          {state !== 'pret' ? ' · repère : tout régler d’ici jeudi soir' : ' · bon match !'}
        </p>
        {children}
      </div>
      <div className="flex w-full flex-col gap-2 md:w-[240px] md:shrink-0">
        <p className="text-xs font-semibold">
          {ready} / {total} prêts
        </p>
        <Progress value={Math.round((ready / total) * 100)} />
      </div>
    </section>
  )
}

/** One severity group of the checklist ("Bloquant", "À vérifier", "Prêt"). */
export function ChecklistSection({ severity, count, empty, children }: { severity: Severity; count: number; empty?: string; children: ReactNode }) {
  const s = SEVERITY[severity]
  return (
    <section aria-labelledby={`sec-${severity}`} className="min-w-0 overflow-hidden rounded-lg border border-border-default bg-bg-surface">
      <header className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-border-default bg-bg-subtle/60 px-5 py-3 sm:px-6">
        <h2 id={`sec-${severity}`} className="text-base font-bold">
          {s.label} <span className="font-semibold text-text-secondary">· {count}</span>
        </h2>
        <p className="text-xs text-text-secondary">{s.hint}</p>
      </header>
      {count === 0 && empty ? <p className="px-5 py-4 text-[13px] text-text-secondary sm:px-6">{empty}</p> : <ul>{children}</ul>}
    </section>
  )
}

/** One checklist line: status badge + what + who + action(s). Stacks on mobile. */
export function CheckLine({
  status,
  tone,
  what,
  who,
  detail,
  actions,
  children,
}: {
  status: string
  tone: Tone
  what: string
  who: ReactNode
  detail?: ReactNode
  actions?: ReactNode
  /** Extra content under the line (sub-steps, inline picker…). */
  children?: ReactNode
}) {
  return (
    <li className="flex flex-col gap-3 border-b border-border-default px-5 py-4 last:border-b-0 sm:px-6 md:flex-row md:items-start md:gap-5">
      <div className="md:w-[150px] md:shrink-0 md:pt-0.5">
        <Badge tone={tone}>{status}</Badge>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <h3 className="text-[15px] font-semibold">{what}</h3>
        <p className="flex items-start gap-1.5 text-[13px]">
          <UserRound className="mt-0.5 size-3.5 shrink-0 text-text-secondary" aria-hidden />
          <span className="min-w-0">{who}</span>
        </p>
        {detail && <div className="text-xs leading-relaxed text-text-secondary">{detail}</div>}
        {children}
      </div>
      {actions && <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap md:max-w-[300px] md:shrink-0 md:flex-col md:items-end">{actions}</div>}
    </li>
  )
}
