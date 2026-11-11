// Figma: 24:2079 "Desktop · Finances · Budget"
import { AppLayout } from '../components/AppLayout'
import { Badge, Breadcrumb } from '../components/ui'
import { CompactHeader, DataTable, MetricGrid, SmallButton, SmallMetric, type TableRow } from '../components/finances/parts'

const rows: TableRow[] = [
  { cells: ['Licences', '24 000 €', '23 420 €', '580 €'], to: 'licences' },
  { cells: ['Équipements', '18 000 €', '14 780 €', '3 220 €'] },
  { cells: ['Déplacements', '12 500 €', '9 960 €', '2 540 €'] },
  { cells: ['Arbitrage', '16 000 €', '12 420 €', '3 580 €'] },
  { cells: ['Événements', '8 000 €', '5 120 €', '2 880 €'] },
]

export default function Budget() {
  return (
    <AppLayout>
      <Breadcrumb items={[{ label: 'Accueil', to: 'aujourdhui' }, { label: 'Finances', to: 'finances' }, { label: 'Budget' }]} />

      <CompactHeader title="Budget" subtitle="Comparer le prévu, le réel et l’atterrissage de saison.">
        <SmallButton primary requires="finances">
          Réviser le budget
        </SmallButton>
      </CompactHeader>

      <MetricGrid>
        <SmallMetric label="BUDGET ANNUEL" value="118 000 €" hint="approuvé" />
        <SmallMetric label="ENGAGÉ" value="72 340 €" hint="61 %" />
        <SmallMetric label="DISPONIBLE" value="45 660 €" hint="39 %" />
        <SmallMetric label="PROJECTION" value="− 2 800 €" hint="écart estimé" />
      </MetricGrid>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[744fr_368fr]">
        <DataTable
          cols={[300, 150, 150, 120]}
          head={['Poste', 'Prévu', 'Réel', 'Reste']}
          rows={rows}
          minWidth={520}
          className="xl:min-h-[430px]"
        />

        <section className="flex min-w-0 flex-col items-start gap-3 rounded-lg border border-border-default bg-bg-surface p-5">
          <h2 className="text-base font-semibold">Points d’attention</h2>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[13px] font-semibold">Équipements</p>
            <Badge size="sm">À confirmer</Badge>
          </div>
          <p className="text-xs text-text-secondary">82 % consommés — confirmer les achats d’octobre.</p>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[13px] font-semibold">Projection déficitaire</p>
            <Badge size="sm" tone="danger">
              Dépassement
            </Badge>
          </div>
          <p className="text-xs text-text-secondary">Le transport senior dépasse le scénario de 2 800 €.</p>
          <SmallButton>Ouvrir les hypothèses</SmallButton>
        </section>
      </div>
    </AppLayout>
  )
}
