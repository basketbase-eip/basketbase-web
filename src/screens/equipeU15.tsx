// Figma: 24:2461 "Desktop · Équipe U15"
import { RLink as Link } from '../components/RLink'
import { AppLayout } from '../components/AppLayout'
import { Badge, Breadcrumb, ButtonPrimary, ButtonSecondary, Card, PageHeader, Row, RowText, type Tone } from '../components/ui'
import { useFeedback } from '../components/feedback'
import { to, type RouteKey } from '../routes'

// Explicit tones where the label alone is ambiguous: "Peut-être" is a pending answer,
// "Absente" is a valid answer, not an error.
const roster: { name: string; role: string; status: string; tone?: Tone }[] = [
  { name: 'Emma Roche', role: 'Joueuse', status: 'Présente' },
  { name: 'Nina Martin', role: 'Joueuse', status: 'Présente' },
  { name: 'Léa Thomas', role: 'Joueuse', status: 'Peut-être', tone: 'warning' },
  { name: 'Zoé Bernard', role: 'Joueuse', status: 'Sans réponse' },
  { name: 'Inès Durand', role: 'Joueuse', status: 'Absente', tone: 'neutral' },
  { name: 'Lucas Morel', role: 'Coach', status: 'Confirmé' },
]

const alerts: { text: string; status: string; tone: Tone; to: RouteKey }[] = [
  { text: '1 licence non validée parmi les convoqués (Hugo Lopez)', status: 'Bloquée', tone: 'danger', to: 'matchPreparation' },
  { text: '3 réponses manquent pour samedi', status: 'À relancer', tone: 'warning', to: 'matchEquipe' },
  { text: '1 certificat médical expire bientôt', status: 'À renouveler', tone: 'warning', to: 'dossiers' },
  { text: 'Le déplacement U18 crée un conflit coach', status: 'Conflit', tone: 'danger', to: 'calendrier' },
  { text: '3 tailles de maillot restent inconnues', status: 'À compléter', tone: 'warning', to: 'matchEquipe' },
]

const resources: { label: string; to?: RouteKey }[] = [
  { label: 'Planning de la saison', to: 'calendrier' },
  { label: 'Contacts responsables légaux' },
  { label: 'Projet sportif U15', to: 'documents' },
  { label: 'Dossier tournoi régional', to: 'documents' },
]

export default function EquipeU15() {
  const { comingSoon } = useFeedback()
  const linkCls = 'flex min-h-11 items-center text-left text-xs font-semibold hover:underline'
  return (
    <AppLayout>
      <Breadcrumb items={[{ label: 'Accueil', to: 'aujourdhui' }, { label: 'Équipes', to: 'equipes' }, { label: 'Équipe U15' }]} />

      <PageHeader title="Équipe U15" subtitle="22 joueurs · 3 encadrants · saison 2026–2027">
        <ButtonSecondary>Modèles</ButtonSecondary>
        <ButtonPrimary>Ajouter une personne</ButtonPrimary>
      </PageHeader>

      <section className="flex flex-col gap-4 rounded-lg border border-border-default bg-bg-surface px-5 py-5 sm:px-6 md:min-h-[112px] md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-[5px]">
          <h2 className="text-lg font-bold">Prochain match · LLC vs USV</h2>
          <p className="text-[13px] text-text-secondary">Samedi 14 sept. · 18:30 · 10 convoqués · 6 confirmés · 3 sans réponse</p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            <Badge size="sm" tone="danger">
              2 bloquants
            </Badge>
            <Badge size="sm" tone="danger">
              1 licence non validée
            </Badge>
          </div>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <ButtonSecondary to="aEnvoyer">Envoyer un rappel</ButtonSecondary>
          <ButtonPrimary to="matchPreparation">Préparer le match</ButtonPrimary>
        </div>
      </section>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[616fr_496fr]">
        <section className="min-w-0 overflow-hidden rounded-lg border border-border-default bg-bg-surface">
          {roster.map((p) => (
            <div key={p.name} className="flex min-h-[60px] items-center justify-between gap-3 border-b border-border-default px-[18px] py-2 last:border-b-0">
              <RowText title={p.name} meta={p.role} />
              <Badge tone={p.tone}>{p.status}</Badge>
            </div>
          ))}
        </section>

        <div className="flex min-w-0 flex-col gap-4">
          <Card padding="p-[22px]">
            <h2 className="text-lg font-bold">À vérifier</h2>
            <div>
              {alerts.map((a) => (
                <Row
                  key={a.text}
                  to={a.to}
                  className="min-h-12"
                  right={
                    <Badge size="sm" tone={a.tone}>
                      {a.status}
                    </Badge>
                  }
                >
                  <p className="text-xs">{a.text}</p>
                </Row>
              ))}
            </div>
            <div>
              <ButtonPrimary to="matchPreparation">Traiter les alertes</ButtonPrimary>
            </div>
          </Card>

          <Card padding="p-[22px]">
            <h2 className="text-lg font-bold">Documents et ressources</h2>
            <ul className="flex flex-col">
              {resources.map((r) => (
                <li key={r.label}>
                  {r.to ? (
                    <Link to={to(r.to)} className={linkCls}>
                      {r.label}&nbsp;&nbsp;→
                    </Link>
                  ) : (
                    <button type="button" onClick={() => comingSoon(r.label)} className={linkCls}>
                      {r.label}&nbsp;&nbsp;→
                    </button>
                  )}
                </li>
              ))}
            </ul>
            <div>
              <ButtonSecondary to="documents">Gérer les documents</ButtonSecondary>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
