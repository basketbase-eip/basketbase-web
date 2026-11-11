// Figma: 24:2974 "Desktop · Documents partagés"
import { useState } from 'react'
import { AppLayout } from '../components/AppLayout'
import { Badge, Breadcrumb, ButtonPrimary, ButtonSecondary, Card } from '../components/ui'
import { DataTable, SimpleHeader, type Column, type TableRow } from '../components/divers/DataTable'

const folders = [
  { name: 'Bureau', count: '32 fichiers' },
  { name: 'Administratif', count: '48 fichiers' },
  { name: 'Équipes', count: '61 fichiers' },
  { name: 'Événements', count: '27 fichiers' },
]

const filters = ['Tous les documents', 'Partagés avec moi', 'À valider', 'Archivés']

const columns: Column[] = [
  { label: 'Document', fr: 320 },
  { label: 'Espace', fr: 160 },
  { label: 'Dernière modification', fr: 200 },
  { label: 'Propriétaire', fr: 150 },
  { label: 'Accès', fr: 110 },
  { label: 'État', fr: 130 },
]

type Doc = { name: string; space: string; modified: string; owner: string; access: string; state: string; shared?: boolean }

const docs: Doc[] = [
  { name: 'Règlement intérieur 2026', space: 'Bureau', modified: 'Aujourd’hui · 10:42', owner: 'Secrétaire', access: 'Bureau', state: 'Publié' },
  { name: 'Dossier subvention région', space: 'Administratif', modified: 'Hier · 17:12', owner: 'Président', access: 'Bureau', state: 'À valider', shared: true },
  { name: 'Feuille de match U15', space: 'Équipes', modified: '16 sept. · 19:05', owner: 'Coach U15', access: 'Équipe', state: 'Publié', shared: true },
  { name: 'Plan tournoi d’automne', space: 'Événements', modified: '15 sept. · 08:30', owner: 'Claire', access: 'Bénévoles', state: 'Brouillon' },
]

const matches = (d: Doc, filter: string) =>
  filter === 'Tous les documents' || (filter === 'Partagés avec moi' ? !!d.shared : filter === 'À valider' ? d.state === 'À valider' : false)

export default function Documents() {
  const [filter, setFilter] = useState(filters[0])
  const [folder, setFolder] = useState<string | null>(null)

  const shown = docs.filter((d) => matches(d, filter) && (!folder || d.space === folder))
  const rows: TableRow[] = shown.map((d) => ({
    cells: [d.name, d.space, d.modified, d.owner, d.access, <Badge size="sm">{d.state}</Badge>],
  }))
  const reset = () => {
    setFilter(filters[0])
    setFolder(null)
  }

  return (
    <AppLayout>
      <Breadcrumb items={[{ label: 'Accueil', to: 'aujourdhui' }, { label: 'Documents partagés' }]} />

      <SimpleHeader title="Documents partagés" subtitle="Un espace unique, versionné et accessible selon les responsabilités.">
        <ButtonPrimary>Importer un document</ButtonPrimary>
      </SimpleHeader>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {folders.map((f) => (
          <button
            key={f.name}
            type="button"
            aria-pressed={folder === f.name}
            onClick={() => setFolder(folder === f.name ? null : f.name)}
            className={`flex min-h-[130px] min-w-0 flex-col items-start gap-3 rounded-lg border p-[18px] text-left transition-colors ${
              folder === f.name ? 'border-action-primary bg-bg-subtle' : 'border-border-default bg-bg-surface hover:bg-bg-subtle/60'
            }`}
          >
            <span className="text-base font-semibold">{f.name}</span>
            <span className="text-xs text-text-secondary">{f.count}</span>
            <span className="text-xs text-text-secondary">Mis à jour aujourd’hui</span>
          </button>
        ))}
      </div>

      <div role="group" aria-label="Filtrer les documents" className="flex flex-wrap gap-3">
        {filters.map((f) => {
          const Btn = f === filter ? ButtonPrimary : ButtonSecondary
          return (
            <Btn key={f} onClick={() => setFilter(f)} wide={false} className="sm:min-w-[164px]">
              {f}
            </Btn>
          )
        })}
      </div>

      {(folder || filter !== filters[0]) && (
        <p className="text-xs text-text-secondary">
          {shown.length} document{shown.length > 1 ? 's' : ''} récent{shown.length > 1 ? 's' : ''}
          {folder ? ` dans « ${folder} »` : ''}
          {filter !== filters[0] ? ` · ${filter}` : ''}
        </p>
      )}

      {rows.length > 0 ? (
        <DataTable columns={columns} rows={rows} className="lg:min-h-[360px]" />
      ) : (
        <Card>
          <p className="text-sm font-semibold">
            {filter === 'Archivés' ? 'Aucun document archivé pour l’instant' : 'Aucun document ne correspond à ces filtres'}
          </p>
          <p className="text-xs text-text-secondary">Retirez les filtres pour revoir tous les documents récents.</p>
          <div>
            <ButtonSecondary onClick={reset}>Retirer les filtres</ButtonSecondary>
          </div>
        </Card>
      )}
    </AppLayout>
  )
}
