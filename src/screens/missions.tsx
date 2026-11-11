// Figma: 24:623 "Desktop · Missions bénévoles"
import { RLink as Link } from '../components/RLink'
import { AppLayout } from '../components/AppLayout'
import { Badge, Breadcrumb, ButtonPrimary, ButtonSecondary, Card, PageHeader } from '../components/ui'
import { FilterSelect, InsightRow, SectionTitle } from '../components/benevoles/parts'
import { MySlots } from '../components/flows/MySlots'
import { SLOTS, useSlots } from '../components/flows/slots'
import { to, type RouteKey } from '../routes'

// `slotId` links a mission to the shared weekend slots, so a replacement or a
// « Je ne peux plus venir » elsewhere is reflected here.
const missions: { title: string; slot: string; filled: number; total: number; slotId?: string; to?: RouteKey }[] = [
  { title: 'Table de marque · U15', slot: '18:15–20:45', filled: 1, total: 2, slotId: 'sam-1815-table', to: 'remplacement' },
  { title: 'Buvette · U15', slot: '18:00–20:30', filled: 1, total: 2, slotId: 'sam-1800-buvette' },
  { title: 'Ouverture gymnase', slot: '17:45–18:00', filled: 1, total: 1, slotId: 'sam-1730-ouverture' },
  { title: 'Accueil joueurs', slot: '18:15–18:30', filled: 2, total: 2 },
  { title: 'Clôture et rangement', slot: '20:40–21:00', filled: 2, total: 2 },
  { title: 'Transport U18', slot: 'Dim. 08:00', filled: 3, total: 3 },
]

const insights = [
  { label: 'Disponibles ce week-end', value: '43' },
  { label: 'Compétents table de marque', value: '12' },
  { label: 'Sans mission depuis 30 jours', value: '18' },
  { label: 'Limite personnelle atteinte', value: '4' },
]

// Figma column widths: 300 / 140 / 150 / 120 (of a 760px table)
const cols = 'md:grid md:grid-cols-[300fr_140fr_150fr_134fr] md:items-center md:gap-0'

function MissionRow({ m }: { m: (typeof missions)[number] }) {
  const { filledOf } = useSlots()
  const shared = m.slotId ? SLOTS.find((s) => s.id === m.slotId) : undefined
  const filled = shared ? filledOf(shared) : m.filled
  const coverage = `${filled} / ${m.total}`
  const open = filled < m.total
  const inner = (
    <>
      <p className="text-[13px] font-semibold md:col-auto">{m.title}</p>
      <p className="text-[13px] text-text-secondary">
        <span className="md:hidden">{m.slot} · {coverage}</span>
        <span className="hidden md:inline">{m.slot}</span>
      </p>
      <p className="hidden text-[13px] text-text-secondary md:block">{coverage}</p>
      <div className="col-start-2 row-span-2 row-start-1 md:col-auto md:row-auto">
        <Badge size="sm">{open ? 'À pourvoir' : 'Pourvue'}</Badge>
      </div>
      {m.to && open && (
        <p className="col-span-2 text-xs font-semibold underline underline-offset-2 md:hidden">Trouver un remplaçant</p>
      )}
    </>
  )
  const cls = `grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 border-b border-border-default px-[18px] py-3 last:border-b-0 md:min-h-16 ${cols}`
  return m.to && open ? (
    <Link to={to(m.to)} className={`${cls} transition-colors hover:bg-bg-subtle/60`}>
      {inner}
    </Link>
  ) : (
    <div className={cls}>{inner}</div>
  )
}

export default function Missions() {
  return (
    <AppLayout>
      <Breadcrumb items={[{ label: 'Accueil', to: 'aujourdhui' }, { label: 'Bénévoles' }]} />

      <PageHeader title="Bénévoles" subtitle="Missions, disponibilités et reconnaissance des contributions">
        <ButtonSecondary>Importer</ButtonSecondary>
        <ButtonPrimary>Créer une mission</ButtonPrimary>
      </PageHeader>

      <div className="flex flex-wrap gap-2.5">
        <FilterSelect label="Période" options={['Ce week-end', 'Cette semaine', 'Ce mois']} className="w-[160px]" />
        <FilterSelect label="Équipe" options={['Toutes les équipes', 'U11', 'U15', 'U18', 'Seniors']} className="w-[160px]" />
        <FilterSelect label="Statut" options={['Tous les statuts', 'À pourvoir', 'Pourvue']} className="w-[160px]" />
        <FilterSelect
          label="Compétence"
          options={['Compétence requise', 'Table de marque', 'Buvette', 'Transport', 'Premiers secours']}
          className="w-[190px]"
        />
      </div>

      <MySlots hideWhenEmpty />

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[760fr_352fr]">
        <section className="flex min-w-0 flex-col overflow-hidden rounded-lg border border-border-default bg-bg-surface">
          <div className={`hidden h-11 bg-bg-subtle px-[18px] text-xs font-semibold text-text-secondary ${cols}`}>
            <p>Mission</p>
            <p>Créneau</p>
            <p>Couverture</p>
            <p aria-hidden />
          </div>
          {missions.map((m) => (
            <MissionRow key={m.title} m={m} />
          ))}
        </section>

        <Card padding="p-5 sm:p-[22px]">
          <SectionTitle>Charge et disponibilités</SectionTitle>
          <p className="text-xs text-text-secondary">Aide à la décision · jamais une affectation automatique</p>
          <div>
            {insights.map((i) => (
              <InsightRow key={i.label} {...i} />
            ))}
          </div>
          <div>
            <ButtonSecondary to="personnes">Voir les personnes adaptées</ButtonSecondary>
          </div>
        </Card>
      </div>

      <Card padding="p-[18px]" className="sm:min-h-[100px] sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <p className="text-[13px] font-semibold">
          Les contributions de coach, trésorerie, transport et organisation sont comptabilisées avec les mêmes règles
          explicites.
        </p>
        <div className="shrink-0">
          <ButtonSecondary to="historique">Configurer les règles</ButtonSecondary>
        </div>
      </Card>
    </AppLayout>
  )
}
