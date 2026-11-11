// Figma: 24:1182 "Desktop · Dossiers administratifs"
import { useState } from 'react'
import { AppLayout } from '../components/AppLayout'
import { Breadcrumb, ButtonPrimary, ButtonSecondary, Card, Metric, PageHeader } from '../components/ui'
import { ActionPanel, DataTable, type TableRow } from '../components/administration/DataTable'
import { LicenceRelance } from '../components/flows/LicenceRelance'

// Other dossiers (licence dossiers are handled in « Licences à relancer » above).
const rows: (TableRow & { views: string[] })[] = [
  { cells: ['Convention gymnase 2026', 'Présidence', 'Valider la version'], status: 'À valider', views: ['Mes dossiers', 'À transmettre'] },
  { cells: ['Inscription championnat U15', 'Secrétariat', 'Payer les droits'], status: 'À traiter', views: ['Mes dossiers', 'Bloqués depuis 7 jours'] },
  { cells: ['Subvention municipale', 'Trésorerie', 'Joindre le budget'], status: 'En cours', views: ['Pièces manquantes', 'À transmettre'] },
  { cells: ['Réunion bureau · septembre', 'Présidence', 'Publier le CR'], status: 'À traiter', views: ['Mes dossiers'] },
  { cells: ['Assurance tournoi U9', 'Marc', 'Aucune'], status: 'Terminé', views: [] },
]

const views = ['Mes dossiers', 'Bloqués depuis 7 jours', 'Pièces manquantes', 'À transmettre']

export default function Dossiers() {
  const [view, setView] = useState<string | null>(null)
  return (
    <AppLayout>
      <Breadcrumb items={[{ label: 'Accueil', to: 'aujourdhui' }, { label: 'Membres & licences' }]} />

      <PageHeader title="Dossiers" subtitle="Licences à relancer, dossiers administratifs et passations">
        <ButtonSecondary to="licences">Toutes les licences</ButtonSecondary>
        <ButtonPrimary requires="editLicences">Créer un dossier</ButtonPrimary>
      </PageHeader>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Metric label="À démarrer" value="8" hint="nouveaux" />
        <Metric label="En attente" value="12" hint="action externe" />
        <Metric label="À valider" value="6" hint="décision requise" />
        <Metric label="Terminés" value="84" hint="cette saison" />
      </div>

      <LicenceRelance title="Licences à relancer" titlePrefix="Licence · " />

      <h2 className="pt-2 text-[19px] font-bold">Autres dossiers</h2>
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[816fr_296fr]">
        <div className="flex min-w-0 flex-col gap-3">
          <DataTable
            cols="md:grid-cols-[300fr_150fr_220fr_130fr]"
            header={['Dossier', 'Responsable', 'Prochaine étape', 'Statut']}
            rows={view ? rows.filter((r) => r.views.includes(view)) : rows}
          />
          {view && (
            <p className="text-xs text-text-secondary">
              Vue « {view} » ·{' '}
              <button type="button" onClick={() => setView(null)} className="min-h-11 font-semibold underline underline-offset-2">
                Voir tous les dossiers
              </button>
            </p>
          )}
        </div>

        <Card padding="p-5 sm:p-[22px]">
          <h2 className="text-lg font-bold">Vues enregistrées</h2>
          <div>
            {views.map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={view === v}
                onClick={() => setView(view === v ? null : v)}
                className={`flex h-11 w-full items-center justify-between border-b border-border-default px-1 text-left text-xs font-semibold transition-colors hover:bg-bg-subtle/60 ${
                  view === v ? 'bg-bg-subtle' : ''
                }`}
              >
                {v}
                <span className="text-text-secondary">{rows.filter((r) => r.views.includes(v)).length}</span>
              </button>
            ))}
          </div>
          <div>
            <ButtonSecondary>Créer une vue</ButtonSecondary>
          </div>
        </Card>
      </div>

      <ActionPanel action={<ButtonPrimary to="responsabilites">Préparer la passation</ButtonPrimary>}>
        <p className="text-sm font-semibold">Passation à préparer</p>
        <p className="text-xs text-text-secondary">
          4 responsabilités contiennent des dossiers ou documents sans successeur confirmé.
        </p>
      </ActionPanel>
    </AppLayout>
  )
}
