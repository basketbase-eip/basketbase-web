// Figma: 24:1553 "Desktop · Administration · Réunions"
import { AppLayout } from '../components/AppLayout'
import { Breadcrumb, ButtonPrimary, ButtonSecondary, PageHeader } from '../components/ui'
import { ActionPanel, DataTable, type TableRow } from '../components/administration/DataTable'
import { useFeedback } from '../components/feedback'

const rows: TableRow[] = [
  { cells: ['Bureau mensuel', '20 sept. 19:30', 'Ordre du jour prêt'], status: 'À venir' },
  { cells: ['Commission sportive', '25 sept. 18:30', '3 sujets proposés'], status: 'À préparer' },
  { cells: ['Assemblée générale', '18 oct. 20:00', 'Convocation envoyée'], status: 'Planifiée' },
  { cells: ['Bureau août', '23 août 19:30', 'Compte rendu publié'], status: 'Terminée' },
]

export default function Reunions() {
  const { toast } = useFeedback()
  return (
    <AppLayout>
      <Breadcrumb items={[{ label: 'Accueil', to: 'aujourdhui' }, { label: 'Administration' }, { label: 'Réunions' }]} />

      <PageHeader title="Réunions" subtitle="Ordres du jour, présences et comptes rendus">
        <ButtonSecondary onClick={() => toast({ message: `Export CSV prêt : ${rows.length} réunions.` })}>Exporter</ButtonSecondary>
        <ButtonPrimary>Planifier une réunion</ButtonPrimary>
      </PageHeader>

      <ActionPanel padding="p-5 sm:p-[22px]" action={<ButtonPrimary>Préparer la réunion</ButtonPrimary>}>
        <div className="flex flex-col gap-1">
          <p className="text-[19px] font-bold">Bureau mensuel · 20 septembre · 19:30</p>
          <p className="text-xs text-text-secondary">
            6 participants · 5 points à l’ordre du jour · 2 documents préparatoires
          </p>
        </div>
      </ActionPanel>

      <DataTable cols="md:grid-cols-[340fr_220fr_350fr_190fr]" rows={rows} />
    </AppLayout>
  )
}
