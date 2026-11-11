// Figma: 24:129 "Desktop · Préparer le week-end"
import { RLink as Link } from '../components/RLink'
import { AppLayout } from '../components/AppLayout'
import { Badge, Breadcrumb, ButtonPrimary, ButtonSecondary, Card, Metric, PageHeader, Row, type Tone } from '../components/ui'
import { to, type RouteKey } from '../routes'

const events: { name: string; coverage: string; blocker: string; status: string; to?: RouteKey }[] = [
  { name: 'U11 · LLC vs Montélier', coverage: '8 / 8', blocker: 'Aucun', status: 'Prêt' },
  { name: 'U13 · Entraînement', coverage: '2 / 2', blocker: 'Aucun', status: 'Prêt' },
  { name: 'U15 · LLC vs USV', coverage: '5 / 7', blocker: 'Délégué + table', status: '2 bloquants', to: 'matchPreparation' },
  { name: 'Seniors · LLC vs Romans', coverage: '7 / 8', blocker: 'Clés gymnase', status: 'À confirmer' },
  { name: 'Tournoi U9', coverage: '10 / 10', blocker: 'Aucun', status: 'Prêt' },
  { name: 'U18 · Déplacement', coverage: '4 / 4', blocker: 'Aucun', status: 'Prêt' },
]

// Same facts as the match "Préparation" tab: délégué and table are blocking,
// the missing buvette volunteer is only to be checked.
const checks: { label: string; value: string; tone?: Tone }[] = [
  { label: 'Délégué de club', value: 'Non désigné', tone: 'danger' },
  { label: 'Table de marque', value: '1 personne manque', tone: 'danger' },
  { label: 'Buvette 20:00–21:00', value: '1 personne manque', tone: 'warning' },
  { label: 'Maillots', value: 'Confirmé' },
  { label: 'Gymnase et clés', value: 'Confirmé' },
  { label: 'Communication parents', value: 'Envoyée' },
]

const cols = 'grid grid-cols-[260fr_150fr_200fr_110px] items-center gap-x-3 px-[18px]'

export default function WeekEnd() {
  return (
    <AppLayout>
      <Breadcrumb items={[{ label: 'Accueil', to: 'aujourdhui' }, { label: 'Événements' }]} />

      <PageHeader title="Événements" subtitle="Coordination sportive et opérationnelle">
        <ButtonSecondary>Exporter</ButtonSecondary>
        <ButtonPrimary to="evModeles">Créer un événement</ButtonPrimary>
      </PageHeader>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Metric label="Événements" value="6" hint="samedi et dimanche" />
        <Metric label="Prêts" value="4" hint="aucun blocage" />
        <Metric label="À compléter" value="2" hint="3 blocages" />
        <Metric label="Missions" value="28 / 32" hint="4 places ouvertes" />
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[744fr_368fr]">
        {/* Event readiness table */}
        <section className="min-w-0 overflow-hidden rounded-lg border border-border-default bg-bg-surface">
          <div className="overflow-x-auto">
            <div className="min-w-[620px]">
              <div className={`${cols} h-11 bg-bg-subtle text-xs font-semibold text-text-secondary`}>
                <p>Événement</p>
                <p>Couverture</p>
                <p>Blocage</p>
                <span />
              </div>
              {events.map((e) => {
                const cells = (
                  <>
                    <p className="text-[13px] font-semibold">{e.name}</p>
                    <p className="text-[13px] text-text-secondary">{e.coverage}</p>
                    <p className="text-[13px] text-text-secondary">{e.blocker}</p>
                    <Badge>{e.status}</Badge>
                  </>
                )
                const cls = `${cols} min-h-16 py-2 border-b border-border-default last:border-b-0`
                return e.to ? (
                  <Link key={e.name} to={to(e.to)} className={`${cls} transition-colors hover:bg-bg-subtle/60`}>
                    {cells}
                  </Link>
                ) : (
                  <div key={e.name} className={cls}>
                    {cells}
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Selected blocker */}
        <Card>
          <h2 className="text-lg font-bold">U15 · LLC vs USV</h2>
          <p className="text-xs text-text-secondary">Samedi · 18:30 · Gymnase des Berges</p>
          <div>
            <Badge tone="danger">2 bloquants</Badge>
          </div>
          <div>
            {checks.map((c) => (
              <Row
                key={c.label}
                className="min-h-11"
                right={
                  <Badge size="sm" tone={c.tone}>
                    {c.value}
                  </Badge>
                }
              >
                <p className="text-xs font-semibold">{c.label}</p>
              </Row>
            ))}
          </div>
          <div>
            <ButtonPrimary to="matchPreparation">Ouvrir et résoudre</ButtonPrimary>
          </div>
        </Card>
      </div>
    </AppLayout>
  )
}
