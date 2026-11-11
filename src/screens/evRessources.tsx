// Figma: 24:536 "Desktop · Événements · Ressources"
import { AppLayout } from '../components/AppLayout'
import { useState } from 'react'
import { Badge, Breadcrumb, ButtonPrimary, ButtonSecondary, Card, Metric, PageHeader, Row, RowText, type Tone } from '../components/ui'
import { FilterChips } from '../components/evenements/local'

const resources: { name: string; meta: string; status: string; tone?: Tone }[] = [
  { name: 'Gymnase des Berges', meta: 'U15 · Sam. 17:30–21:00', status: 'Confirmé' },
  { name: 'Minibus 1', meta: 'U18 · Dim. 07:30–17:00', status: 'Confirmé' },
  { name: 'Clés gymnase principal', meta: 'Seniors · Sam. 19:30', status: 'À retirer', tone: 'warning' },
  { name: 'Maillots blancs U15', meta: 'U15 · Sam. 17:45', status: 'Attribué', tone: 'success' },
  { name: 'Terminal de paiement', meta: 'Buvette · Sam. 17:30', status: 'À vérifier' },
]

const FILTERS = ['Toutes', 'À traiter', 'Prêtes'] as const
const ready = (tone: Tone | undefined, status: string) => (tone ?? (status === 'Confirmé' ? 'success' : 'warning')) === 'success'

export default function EvRessources() {
  const [showFilters, setShowFilters] = useState(false)
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('Toutes')
  const shown = resources.filter((r) => filter === 'Toutes' || (filter === 'Prêtes') === ready(r.tone, r.status))
  return (
    <AppLayout>
      <Breadcrumb items={[{ label: 'Accueil', to: 'aujourdhui' }, { label: 'Événements', to: 'weekEnd' }, { label: 'Ressources' }]} />

      <PageHeader title="Ressources" subtitle="Gymnases, véhicules, équipements et clés">
        <ButtonSecondary onClick={() => setShowFilters((v) => !v)}>{showFilters ? 'Masquer les filtres' : 'Filtres'}</ButtonSecondary>
        <ButtonPrimary>Ajouter une ressource</ButtonPrimary>
      </PageHeader>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Metric label="Gymnases" value="3" />
        <Metric label="Véhicules" value="2" />
        <Metric label="Lots de maillots" value="8" />
        <Metric label="Clés et badges" value="12" />
      </div>

      {showFilters && <FilterChips label="État des ressources" options={FILTERS} value={filter} onChange={setFilter} />}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[760fr_352fr]">
        <section className="min-w-0 overflow-hidden rounded-lg border border-border-default bg-bg-surface">
          {shown.map((r) => (
            <Row
              key={r.name}
              className="min-h-[62px] px-[18px] last:border-b-0"
              right={
                <Badge size="sm" tone={r.tone}>
                  {r.status}
                </Badge>
              }
            >
              <RowText title={r.name} meta={<span className="text-xs">{r.meta}</span>} />
            </Row>
          ))}
        </section>

        <Card padding="p-5 sm:p-[22px]" className="gap-2.5">
          <h2 className="text-lg font-bold">Conflits et contrôles</h2>
          <p className="text-[13px] font-semibold">1 ressource demande une action</p>
          <p className="text-xs text-text-secondary">Le terminal de paiement n’a pas été contrôlé depuis 30 jours.</p>
          <div className="flex flex-col items-start gap-2.5">
            <ButtonPrimary to="calendrier">Planifier le contrôle</ButtonPrimary>
            <ButtonSecondary>Voir l’historique</ButtonSecondary>
          </div>
        </Card>
      </div>
    </AppLayout>
  )
}
