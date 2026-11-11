// Figma: 24:356 "Desktop · Événements · Calendrier"
import { useState } from 'react'
import { RLink as Link } from '../components/RLink'
import { AppLayout } from '../components/AppLayout'
import { Breadcrumb, ButtonPrimary, ButtonSecondary, PageHeader } from '../components/ui'
import { FilterChips } from '../components/evenements/local'
import { useFeedback } from '../components/feedback'
import { canOpen } from '../nav'
import { useRole } from '../roles'
import { to, type RouteKey } from '../routes'

const VIEWS = ['Mois', 'Semaine', 'Liste'] as const
const DAYS = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM']
const DAY_NAMES = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
const KINDS = ['Tout', 'Matchs et tournois', 'Entraînements', 'Autres'] as const
type Kind = (typeof KINDS)[number]

/** Events of the reference week (Monday 9 September 2026), by weekday index. */
const WEEK_EVENTS: string[][] = [
  ['18:00 · U11 entraînement'],
  ['19:30 · Seniors entraînement'],
  ['17:00 · U9 entraînement', '20:00 · Réunion bureau'],
  ['18:30 · U15 entraînement'],
  ['19:00 · Installation tournoi'],
  ['10:00 · U11 match', '18:30 · U15 match', '20:30 · Seniors match'],
  ['09:00 · Tournoi U9', '14:00 · U18 déplacement'],
]

const REF_MONDAY = new Date(2026, 8, 9)

function addDays(d: Date, n: number) {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}

function weekLabel(monday: Date) {
  const sunday = addDays(monday, 6)
  if (monday.getMonth() === sunday.getMonth())
    return `${monday.getDate()}–${sunday.getDate()} ${MONTHS[monday.getMonth()]} ${monday.getFullYear()}`
  return `${monday.getDate()} ${MONTHS[monday.getMonth()]} – ${sunday.getDate()} ${MONTHS[sunday.getMonth()]} ${sunday.getFullYear()}`
}

function kindOf(ev: string): Kind {
  if (/match|tournoi u/i.test(ev)) return 'Matchs et tournois'
  if (/entraînement/i.test(ev)) return 'Entraînements'
  return 'Autres'
}

/** Where an event's detail lives, when the prototype has a page for it. */
function targetOf(ev: string): RouteKey | undefined {
  if (ev.includes('U15 match')) return 'matchPreparation'
  if (ev.includes('Réunion bureau')) return 'reunions'
  if (/match/i.test(ev)) return 'weekEnd'
  return undefined
}

const eventsFor = (offset: number, kind: Kind) =>
  DAYS.map((_, i) => (offset === 0 ? WEEK_EVENTS[i] : []).filter((ev) => kind === 'Tout' || kindOf(ev) === kind))

function EventCard({ ev }: { ev: string }) {
  const { role, can } = useRole()
  const { comingSoon } = useFeedback()
  const target = targetOf(ev)
  const cls = 'flex w-full flex-col gap-2.5 rounded-md border border-border-default bg-bg-subtle p-2.5 text-left'
  if (target && canOpen(target, role, can))
    return (
      <Link to={to(target)} className={`${cls} transition-colors hover:border-text-secondary`}>
        <span className="text-xs font-semibold">{ev}</span>
        <span className="text-xs text-text-secondary">Voir le détail →</span>
      </Link>
    )
  if (target)
    return (
      <div className={cls}>
        <span className="text-xs font-semibold">{ev}</span>
      </div>
    )
  return (
    <button type="button" onClick={() => comingSoon('Détail de l’événement')} className={`${cls} transition-colors hover:border-text-secondary`}>
      <span className="text-xs font-semibold">{ev}</span>
      <span className="text-xs text-text-secondary">Voir le détail →</span>
    </button>
  )
}

export default function Calendrier() {
  const [view, setView] = useState<(typeof VIEWS)[number]>('Semaine')
  const [offset, setOffset] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [kind, setKind] = useState<Kind>('Tout')
  const monday = addDays(REF_MONDAY, offset * 7)
  const week = eventsFor(offset, kind)
  const step = view === 'Mois' ? 4 : 1
  const navLabel =
    view === 'Mois' ? `4 semaines à partir du ${monday.getDate()} ${MONTHS[monday.getMonth()]} ${monday.getFullYear()}` : weekLabel(monday)

  return (
    <AppLayout>
      <Breadcrumb items={[{ label: 'Accueil', to: 'aujourdhui' }, { label: 'Calendrier' }]} />

      <PageHeader title="Calendrier" subtitle="Tous les matchs, entraînements, réunions et indisponibilités">
        <ButtonSecondary onClick={() => setShowFilters((v) => !v)}>
          {showFilters ? 'Masquer les filtres' : kind === 'Tout' ? 'Filtres' : 'Filtres (1)'}
        </ButtonSecondary>
        <ButtonPrimary to="evModeles" requires="matchPrep">
          Créer un événement
        </ButtonPrimary>
      </PageHeader>

      {showFilters && <FilterChips label="Type d’événement" options={KINDS} value={kind} onChange={setKind} />}

      {/* Toolbar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-1 text-[15px] font-semibold">
          <button
            type="button"
            aria-label={view === 'Mois' ? 'Période précédente' : 'Semaine précédente'}
            onClick={() => setOffset((o) => o - step)}
            className="inline-flex size-11 items-center justify-center rounded-lg hover:bg-bg-subtle"
          >
            ‹
          </button>
          <span>{navLabel}</span>
          <button
            type="button"
            aria-label={view === 'Mois' ? 'Période suivante' : 'Semaine suivante'}
            onClick={() => setOffset((o) => o + step)}
            className="inline-flex size-11 items-center justify-center rounded-lg hover:bg-bg-subtle"
          >
            ›
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2 md:flex" role="group" aria-label="Affichage">
          {VIEWS.map((v) => {
            const Btn = v === view ? ButtonPrimary : ButtonSecondary
            return (
              <Btn key={v} onClick={() => setView(v)}>
                {v}
              </Btn>
            )
          })}
        </div>
      </div>

      {view === 'Semaine' && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-7">
          {DAYS.map((d, i) => (
            <section
              key={d}
              className="flex min-w-0 flex-col gap-2.5 rounded-lg border border-border-default bg-bg-surface p-3 xl:min-h-[590px]"
            >
              <p className="text-xs font-semibold text-text-secondary">
                {d} {addDays(monday, i).getDate()}
              </p>
              {week[i].map((ev) => (
                <EventCard key={ev} ev={ev} />
              ))}
            </section>
          ))}
        </div>
      )}

      {view === 'Liste' && (
        <section className="flex min-w-0 flex-col rounded-lg border border-border-default bg-bg-surface px-[18px] py-2">
          {week.every((evs) => evs.length === 0) && (
            <p className="py-4 text-[13px] text-text-secondary">Aucun événement cette semaine{kind === 'Tout' ? '' : ` pour « ${kind} »`}.</p>
          )}
          {DAY_NAMES.map((d, i) =>
            week[i].length === 0 ? null : (
              <div key={d} className="flex flex-col gap-2 border-b border-border-default py-3 last:border-b-0 sm:flex-row sm:gap-6">
                <p className="w-40 shrink-0 text-[13px] font-semibold">
                  {d} {addDays(monday, i).getDate()} {MONTHS[addDays(monday, i).getMonth()]}
                </p>
                <div className="grid min-w-0 flex-1 grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
                  {week[i].map((ev) => (
                    <EventCard key={ev} ev={ev} />
                  ))}
                </div>
              </div>
            ),
          )}
        </section>
      )}

      {view === 'Mois' && (
        <section className="flex min-w-0 flex-col rounded-lg border border-border-default bg-bg-surface px-[18px] py-2">
          {[0, 1, 2, 3].map((w) => {
            const o = offset + w
            const evs = eventsFor(o, kind).flat()
            return (
              <button
                key={o}
                type="button"
                onClick={() => {
                  setOffset(o)
                  setView('Semaine')
                }}
                className="flex min-h-14 flex-col gap-1 border-b border-border-default py-3 text-left transition-colors last:border-b-0 hover:bg-bg-subtle/60 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
              >
                <span className="text-[13px] font-semibold">Semaine du {weekLabel(addDays(REF_MONDAY, o * 7))}</span>
                <span className="text-xs text-text-secondary">
                  {evs.length === 0 ? 'Aucun événement saisi' : `${evs.length} événements · ${evs.slice(0, 2).join(' · ')}…`}
                </span>
              </button>
            )
          })}
        </section>
      )}
    </AppLayout>
  )
}
