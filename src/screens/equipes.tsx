// Figma: 24:2849 "Desktop · Équipes"
import { AppLayout } from '../components/AppLayout'
import { Badge, Breadcrumb, ButtonPrimary } from '../components/ui'
import { DataTable, SimpleHeader, type Column, type TableRow } from '../components/divers/DataTable'

const metrics = [
  { value: '12', label: 'équipes actives' },
  { value: '184', label: 'licenciés' },
  { value: '26', label: 'encadrants' },
  { value: '5', label: 'alertes à traiter' },
]

const columns: Column[] = [
  { label: 'Équipe', fr: 280 },
  { label: 'Catégorie', fr: 160 },
  { label: 'Encadrement', fr: 220 },
  { label: 'Effectif', fr: 140 },
  { label: 'Prochaine action', fr: 240 },
]

const rows: TableRow[] = [
  { cells: ['U15 Masculins', 'U15', '2 coachs', '18 / 20', <Badge size="sm">Match à préparer</Badge>], to: 'equipeU15' },
  { cells: ['Senior 1', 'Senior', '3 coachs', '21 / 22', <Badge size="sm" tone="danger">2 présences manquantes</Badge>] },
  { cells: ['U18 Féminines', 'U18', '2 coachs', '16 / 18', <Badge size="sm" tone="warning">Responsable à nommer</Badge>] },
  { cells: ['Loisirs', 'Adultes', '1 référent', '24 / 30', <Badge size="sm">Cotisations à relancer</Badge>] },
]

export default function Equipes() {
  return (
    <AppLayout>
      <Breadcrumb items={[{ label: 'Accueil', to: 'aujourdhui' }, { label: 'Équipes' }]} />

      <SimpleHeader title="Équipes" subtitle="Piloter les effectifs, encadrants, calendriers et alertes.">
        <ButtonPrimary>Créer une équipe</ButtonPrimary>
      </SimpleHeader>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="flex min-h-[110px] min-w-0 flex-col gap-3 rounded-lg border border-border-default bg-bg-surface p-[18px]">
            <p className="text-[28px] font-semibold">{m.value}</p>
            <p className="text-xs text-text-secondary">{m.label}</p>
          </div>
        ))}
      </div>

      <DataTable columns={columns} rows={rows} className="lg:min-h-[410px]" />
    </AppLayout>
  )
}
