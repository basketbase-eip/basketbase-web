// Figma: 24:1777 "Desktop · Finances · Vue d’ensemble"
import { AppLayout } from '../components/AppLayout'
import { Badge, Breadcrumb, ButtonPrimary, ButtonSecondary, Card, Metric, PageHeader, Row, RowText } from '../components/ui'
import type { RouteKey } from '../routes'
import { useFeedback } from '../components/feedback'

/** Bar heights in px (of a 164px plot area). */
const months: { label: string; h: number }[] = [
  { label: 'Avr', h: 74 },
  { label: 'Mai', h: 108 },
  { label: 'Juin', h: 92 },
  { label: 'Juil', h: 132 },
  { label: 'Août', h: 116 },
  { label: 'Sept', h: 150 },
]

const actions: { title: string; meta: string; status: string; to?: RouteKey }[] = [
  { title: '7 remboursements', meta: '1 240 €', status: 'À contrôler', to: 'remboursement' },
  { title: '5 factures fournisseurs', meta: '2 630 €', status: 'À programmer', to: 'factures' },
  { title: '12 transactions non rapprochées', meta: '980 €', status: 'À rapprocher', to: 'transactions' },
  { title: 'Clôture buvette U15', meta: 'Recettes à vérifier', status: 'À clôturer', to: 'matchFinances' },
]

export default function Finances() {
  const { toast } = useFeedback()
  return (
    <AppLayout>
      <Breadcrumb items={[{ label: 'Accueil', to: 'aujourdhui' }, { label: 'Finances' }]} />

      <PageHeader title="Finances" subtitle="Saison 2026–2027 · dernière synchronisation bancaire il y a 2 h">
        <ButtonSecondary onClick={() => toast({ message: 'Export CSV prêt : opérations de la saison 2026–2027.' })}>Exporter</ButtonSecondary>
        <ButtonPrimary to="transactions" requires="finances">
          Ajouter une opération
        </ButtonPrimary>
      </PageHeader>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Metric label="Solde disponible" value="42 680 €" hint="+ 6 240 € ce mois" />
        <Metric label="À encaisser" value="8 420 €" hint="31 cotisations" />
        <Metric label="À payer" value="3 180 €" hint="12 opérations" />
        <Metric label="Budget consommé" value="38 %" hint="sur 96 000 €" />
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[552fr_560fr]">
        <Card padding="p-5 sm:p-[22px]">
          <h2 className="text-lg font-bold">Trésorerie</h2>
          <p className="text-xs text-text-secondary">Entrées et sorties · six derniers mois</p>
          <div className="grid h-[170px] grid-cols-6 items-end gap-2 sm:max-w-[482px] sm:gap-[22px]" role="img" aria-label="Trésorerie d’avril à septembre">
            {months.map((m) => (
              <div key={m.label} className="flex h-[164px] flex-col items-center justify-end gap-[7px]">
                <div className="w-full max-w-[38px] rounded-md bg-action-primary" style={{ height: m.h }} />
                <span className="text-xs text-text-secondary">{m.label}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card padding="p-5 sm:p-[22px]">
          <h2 className="text-lg font-bold">À traiter</h2>
          <div className="flex flex-col gap-3">
            {actions.map((a) => (
              <Row key={a.title} to={a.to} className="min-h-14" right={<Badge>{a.status}</Badge>}>
                <RowText title={a.title} meta={a.meta} />
              </Row>
            ))}
          </div>
        </Card>
      </div>

      <section className="flex flex-col gap-4 rounded-lg border border-border-default bg-bg-surface p-[18px] sm:min-h-[100px] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-col gap-[3px]">
          <h2 className="text-sm font-semibold">Résultat des événements</h2>
          <p className="text-xs text-text-secondary">Buvette, achats et remboursements sont rapprochés avec l’événement concerné.</p>
        </div>
        <div>
          <ButtonSecondary to="matchFinances">Voir les bilans</ButtonSecondary>
        </div>
      </section>
    </AppLayout>
  )
}
