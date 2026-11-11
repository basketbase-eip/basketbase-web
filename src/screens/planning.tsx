// Figma: 24:824 "Desktop · Bénévoles · Planning"
import { RLink as Link } from '../components/RLink'
import { AppLayout } from '../components/AppLayout'
import { Badge, Breadcrumb, ButtonPrimary, ButtonSecondary, PageHeader } from '../components/ui'
import { useFeedback } from '../components/feedback'
import { MySlots } from '../components/flows/MySlots'
import { CAN_OFFER, MY_SLOTS, SLOTS, slotStore, useSlots, type Slot } from '../components/flows/slots'
import { canOpen } from '../nav'
import { useRole } from '../roles'
import { to } from '../routes'

// Figma column widths: 180 / 260 / 250 / 170 / 180 + action column
const cols = 'md:grid md:grid-cols-[130fr_200fr_190fr_110fr_170fr_200fr] md:items-center md:gap-0'

export default function Planning() {
  const { role, can } = useRole()
  const { toast } = useFeedback()
  const { state, filledOf } = useSlots()
  const organiser = canOpen('remplacement', role, can)

  const offer = (s: Slot) => {
    const on = state.offered.includes(s.id)
    slotStore.toggleOffer(s.id)
    if (!on)
      toast({
        message: `Proposition envoyée pour ${s.mission.toLowerCase()} (${s.when}). ${s.organiser} vous confirmera le créneau.`,
        undo: () => slotStore.toggleOffer(s.id),
      })
    else toast({ tone: 'info', message: 'Proposition retirée.' })
  }

  return (
    <AppLayout>
      <Breadcrumb items={[{ label: 'Accueil', to: 'aujourdhui' }, { label: 'Bénévoles', to: 'missions' }, { label: 'Planning' }]} />

      <PageHeader title="Planning bénévoles" subtitle="Vue chronologique des besoins et disponibilités">
        <ButtonSecondary>Exporter</ButtonSecondary>
        {organiser && <ButtonPrimary>Ouvrir des créneaux</ButtonPrimary>}
      </PageHeader>

      <MySlots />

      <section className="flex min-w-0 flex-col overflow-hidden rounded-lg border border-border-default bg-bg-surface" aria-label="Créneaux du week-end">
        <div className={`hidden h-12 bg-bg-subtle px-[18px] text-xs font-semibold text-text-secondary ${cols}`}>
          <p>Créneau</p>
          <p>Événement</p>
          <p>Mission</p>
          <p>Couverture</p>
          <p>État</p>
          <p className="sr-only">Action</p>
        </div>
        {SLOTS.map((s) => {
          const filled = filledOf(s)
          const open = filled < s.total
          const mine = MY_SLOTS[role].includes(s.id)
          const offered = state.offered.includes(s.id)
          const canOffer = open && !mine && CAN_OFFER[role]?.includes(s.id)
          let action = null
          if (open && organiser && s.id === 'sam-1815-table')
            action = (
              <Link to={to('remplacement')} className="text-[13px] font-semibold underline underline-offset-2 hover:no-underline">
                Trouver un remplaçant
              </Link>
            )
          else if (canOffer)
            action = (
              <button
                type="button"
                onClick={() => offer(s)}
                className="inline-flex h-11 items-center justify-center rounded-md border border-border-default bg-bg-surface px-4 text-[13px] font-semibold hover:bg-bg-subtle"
              >
                {offered ? 'Retirer ma proposition' : 'Je me propose'}
              </button>
            )
          return (
            <div
              key={s.id}
              className={`grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 border-b border-border-default px-[18px] py-3 text-[13px] last:border-b-0 md:min-h-[62px] md:py-2 ${cols}`}
            >
              <p className="text-text-secondary md:col-auto">
                <span className="md:hidden">
                  {s.when} · {s.event} · {filled} / {s.total}
                </span>
                <span className="hidden md:inline">{s.when}</span>
              </p>
              <p className="hidden font-semibold md:block">{s.event}</p>
              <p className="font-semibold">
                {s.mission}
                {mine && <span className="ml-2 text-xs font-normal text-text-secondary">(vous)</span>}
              </p>
              <p className="hidden text-text-secondary md:block">
                {filled} / {s.total}
              </p>
              <div className="col-start-2 row-span-2 row-start-1 flex justify-end md:col-auto md:row-auto md:justify-start">
                {offered && open ? <Badge size="sm">Proposé</Badge> : <Badge size="sm">{open ? 'À pourvoir' : 'Pourvu'}</Badge>}
              </div>
              {action && <div className="col-span-2 pt-1 md:col-auto md:pt-0">{action}</div>}
            </div>
          )
        })}
      </section>
    </AppLayout>
  )
}
