// Figma: 24:1473 "Desktop · Administration · Documents"
import { useState } from 'react'
import { AppLayout } from '../components/AppLayout'
import { Breadcrumb, ButtonPrimary, ButtonSecondary, Card, PageHeader } from '../components/ui'
import { DataTable, type TableRow } from '../components/administration/DataTable'
import { useFeedback } from '../components/feedback'

const spaces = [
  { name: 'Club', count: 24 },
  { name: 'Équipes', count: 38 },
  { name: 'Gouvernance', count: 16 },
  { name: 'Finances', count: 22 },
  { name: 'Événements', count: 31 },
  { name: 'Modèles', count: 12 },
]

const rows: TableRow[] = [
  { cells: ['Règlement intérieur.pdf', 'Club', 'v4 · 2 sept.'], status: 'Publié' },
  { cells: ['Compte rendu septembre.docx', 'Gouvernance', 'v2 · hier'], status: 'À valider' },
  { cells: ['Convention gymnase.pdf', 'Club', 'v3 · 10 sept.'], status: 'Publié' },
  { cells: ['Budget prévisionnel.xlsx', 'Finances', 'v8 · aujourd’hui'], status: 'Interne' },
  { cells: ['Guide table de marque.pdf', 'Équipes', 'v1 · 6 sept.'], status: 'Publié' },
]

export default function AdminDocuments() {
  const [space, setSpace] = useState<string | null>(null)
  const { toast } = useFeedback()
  const shown = space ? rows.filter((r) => r.cells[1] === space) : rows

  return (
    <AppLayout>
      <Breadcrumb
        items={[{ label: 'Accueil', to: 'aujourdhui' }, { label: 'Administration', to: 'reunions' }, { label: 'Documents officiels' }]}
      />

      <PageHeader title="Documents officiels" subtitle="Bibliothèque partagée, modèles et versions">
        <ButtonSecondary onClick={() => toast({ message: `Export CSV prêt : ${shown.length} documents.` })}>Exporter</ButtonSecondary>
        <ButtonPrimary>Ajouter un document</ButtonPrimary>
      </PageHeader>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[296fr_816fr]">
        <Card padding="p-5 sm:p-[22px]" className="gap-2.5">
          <h2 className="text-lg font-bold">Espaces</h2>
          <ul className="flex flex-col gap-1">
            {spaces.map((s) => (
              <li key={s.name}>
                <button
                  type="button"
                  aria-pressed={space === s.name}
                  onClick={() => setSpace(space === s.name ? null : s.name)}
                  className={`-mx-2 flex min-h-10 w-[calc(100%+1rem)] items-center rounded-md px-2 text-left text-[13px] font-semibold transition-colors hover:bg-bg-subtle ${
                    space === s.name ? 'bg-bg-subtle' : ''
                  }`}
                >
                  {s.name} · {s.count}
                </button>
              </li>
            ))}
          </ul>
        </Card>

        <div className="flex min-w-0 flex-col gap-3">
          {space && (
            <p className="text-xs text-text-secondary">
              Espace « {space} » · {shown.length} document{shown.length > 1 ? 's' : ''} récent{shown.length > 1 ? 's' : ''} ·{' '}
              <button type="button" onClick={() => setSpace(null)} className="font-semibold text-text-primary underline underline-offset-2">
                Voir tous les espaces
              </button>
            </p>
          )}
          {shown.length > 0 ? (
            <DataTable cols="md:grid-cols-[340fr_170fr_180fr_110fr]" rows={shown} />
          ) : (
            <Card>
              <p className="text-sm font-semibold">Aucun document récent dans l’espace « {space} »</p>
              <p className="text-xs text-text-secondary">Les documents plus anciens restent consultables depuis la bibliothèque complète.</p>
              <div>
                <ButtonSecondary onClick={() => setSpace(null)}>Voir tous les espaces</ButtonSecondary>
              </div>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
