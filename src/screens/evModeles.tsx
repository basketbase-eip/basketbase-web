// Figma: 24:451 "Desktop · Événements · Modèles"
import { AppLayout } from '../components/AppLayout'
import { useState } from 'react'
import { Breadcrumb, ButtonPrimary, ButtonSecondary, Card, PageHeader } from '../components/ui'
import { FilterChips } from '../components/evenements/local'

const templates = [
  { kind: 'BASKET', title: 'Match à domicile', meta: '7 missions · 4 contrôles · 3 messages' },
  { kind: 'BASKET', title: 'Match à l’extérieur', meta: '4 missions · transport · convocations' },
  { kind: 'ÉVÉNEMENT', title: 'Tournoi jeunes', meta: '12 missions · buvette · fournisseurs' },
  { kind: 'GOUVERNANCE', title: 'Réunion du bureau', meta: 'Ordre du jour · décisions · compte rendu' },
]

const presets = [
  { title: 'Organisation', items: ['Déroulé', 'Lieux et ressources', 'Équipe concernée'] },
  { title: 'Bénévoles', items: ['Missions et quotas', 'Compétences requises', 'Délais de réponse'] },
  { title: 'Communication', items: ['Convocation', 'Rappels ciblés', 'Message de changement'] },
  { title: 'Finances', items: ['Budget prévisionnel', 'Catégories de dépenses', 'Clôture de buvette'] },
]

const KINDS = ['Tous', 'Basket', 'Événement', 'Gouvernance'] as const

export default function EvModeles() {
  const [showFilters, setShowFilters] = useState(false)
  const [kind, setKind] = useState<(typeof KINDS)[number]>('Tous')
  const shown = templates.filter((t) => kind === 'Tous' || t.kind === kind.toUpperCase())
  return (
    <AppLayout>
      <Breadcrumb items={[{ label: 'Accueil', to: 'aujourdhui' }, { label: 'Événements', to: 'weekEnd' }, { label: 'Modèles' }]} />

      <PageHeader title="Modèles d’événements" subtitle="Réutiliser les besoins, le déroulé et les communications">
        <ButtonSecondary onClick={() => setShowFilters((v) => !v)}>{showFilters ? 'Masquer les filtres' : 'Filtres'}</ButtonSecondary>
        <ButtonPrimary>Créer un modèle</ButtonPrimary>
      </PageHeader>

      {showFilters && <FilterChips label="Type de modèle" options={KINDS} value={kind} onChange={setKind} />}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {shown.map((t) => (
          <Card key={t.title} padding="p-5" className="gap-2.5">
            <p className="text-xs font-semibold text-text-secondary">{t.kind}</p>
            <h2 className="text-[17px] font-bold">{t.title}</h2>
            <p className="text-xs text-text-secondary">{t.meta}</p>
            <div className="mt-auto">
              <ButtonSecondary to="weekEnd">Utiliser le modèle</ButtonSecondary>
            </div>
          </Card>
        ))}
      </div>

      <Card padding="p-5 sm:p-[22px]" className="gap-2.5">
        <h2 className="text-lg font-bold">Ce qu’un modèle peut préconfigurer</h2>
        <div className="grid grid-cols-2 gap-x-11 gap-y-5 md:flex md:flex-wrap">
          {presets.map((p) => (
            <div key={p.title} className="flex flex-col gap-[7px]">
              <p className="text-[13px] font-semibold">{p.title}</p>
              {p.items.map((it) => (
                <p key={it} className="text-xs text-text-secondary">
                  • {it}
                </p>
              ))}
            </div>
          ))}
        </div>
      </Card>
    </AppLayout>
  )
}
