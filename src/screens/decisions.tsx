// Figma: 24:1624 "Desktop · Administration · Décisions"
import { useState } from 'react'
import { AppLayout } from '../components/AppLayout'
import { Badge, Breadcrumb, ButtonPrimary, ButtonSecondary, PageHeader } from '../components/ui'
import { ActionPanel, DataTable, type TableRow } from '../components/administration/DataTable'
import { useFeedback } from '../components/feedback'

const rows: TableRow[] = [
  { cells: ['Renouveler le contrat équipementier', 'Présidence', '30 septembre'], status: 'En cours' },
  { cells: ['Créer une formation OTM', 'Commission sportive', '12 octobre'], status: 'Planifiée' },
  { cells: ['Réviser le règlement intérieur', 'Secrétariat', '20 octobre'], status: 'À démarrer', tone: 'warning' },
  { cells: ['Acheter un terminal de paiement', 'Trésorerie', '15 septembre'], status: 'Terminée' },
]

export default function Decisions() {
  const { toast, confirm } = useFeedback()
  const [reminded, setReminded] = useState(false)

  const remind = () =>
    confirm({
      title: 'Relancer 3 responsables de décisions ?',
      body: 'Présidence, Commission sportive et Secrétariat recevront un message leur demandant une mise à jour.',
      confirmLabel: 'Envoyer 3 relances',
      cancelLabel: 'Ne pas envoyer',
      onConfirm: () => {
        setReminded(true)
        toast({ message: '3 relances envoyées aux responsables.' })
      },
    })

  return (
    <AppLayout>
      <Breadcrumb
        items={[{ label: 'Accueil', to: 'aujourdhui' }, { label: 'Administration', to: 'reunions' }, { label: 'Décisions' }]}
      />

      <PageHeader title="Décisions" subtitle="Décisions adoptées, responsables et échéances">
        <ButtonSecondary onClick={() => toast({ message: `Export CSV prêt : ${rows.length} décisions.` })}>Exporter</ButtonSecondary>
        <ButtonPrimary>Ajouter une décision</ButtonPrimary>
      </PageHeader>

      <ActionPanel
        action={
          reminded ? (
            <Badge>Relances envoyées</Badge>
          ) : (
            <ButtonPrimary requires="communicate" onClick={remind}>
              Relancer
            </ButtonPrimary>
          )
        }
      >
        <p className="text-sm font-semibold">3 décisions n’ont pas de mise à jour récente</p>
        <p className="text-xs text-text-secondary">
          {reminded
            ? 'Relance envoyée aujourd’hui aux responsables concernés.'
            : 'Une relance peut être envoyée aux responsables concernés.'}
        </p>
      </ActionPanel>

      <DataTable cols="md:grid-cols-[400fr_220fr_200fr_280fr]" rows={rows} />
    </AppLayout>
  )
}
