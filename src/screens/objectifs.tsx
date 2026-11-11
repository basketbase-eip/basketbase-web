// Figma: 24:2277 "Desktop · Finances · Objectifs"
import { AppLayout } from '../components/AppLayout'
import { Breadcrumb } from '../components/ui'
import { CompactHeader, MetricGrid, SmallButton, SmallMetric } from '../components/finances/parts'

/** `pct` = Figma progress fill width / 236px track. */
const goals = [
  { title: 'Sponsors locaux', target: '20 000 €', secured: '14 500 € sécurisés', pct: 72, owner: 'Responsable · Claire' },
  { title: 'Tournoi d’automne', target: '12 000 €', secured: '6 800 € sécurisés', pct: 56, owner: 'Responsable · Marc' },
  { title: 'Campagne dons', target: '8 000 €', secured: '2 100 € sécurisés', pct: 26, owner: 'Responsable · Lina' },
  { title: 'Subventions', target: '25 000 €', secured: '21 000 € sécurisés', pct: 84, owner: 'Responsable · Trésorier' },
]

const next = [
  'Relancer 4 partenaires locaux avant vendredi',
  'Finaliser le dossier de subvention régionale',
  'Publier la campagne de dons aux licenciés',
]

export default function Objectifs() {
  return (
    <AppLayout>
      <Breadcrumb items={[{ label: 'Accueil', to: 'aujourdhui' }, { label: 'Finances', to: 'finances' }, { label: 'Objectifs' }]} />

      <CompactHeader title="Objectifs financiers" subtitle="Relier les objectifs aux actions, responsables et échéances.">
        <SmallButton primary requires="finances">
          Ajouter un objectif
        </SmallButton>
      </CompactHeader>

      <MetricGrid>
        <SmallMetric label="CIBLE ANNUELLE" value="142 000 €" hint="ressources" />
        <SmallMetric label="SÉCURISÉ" value="108 400 €" hint="76 %" />
        <SmallMetric label="À TROUVER" value="33 600 €" hint="24 %" />
        <SmallMetric label="ÉCHÉANCES PROCHES" value="3" hint="avant octobre" />
      </MetricGrid>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {goals.map((g) => (
          <section key={g.title} className="flex min-w-0 flex-col gap-3 rounded-lg border border-border-default bg-bg-surface p-[18px] xl:min-h-[220px]">
            <h2 className="text-base font-semibold">{g.title}</h2>
            <p className="text-[26px] font-semibold">{g.target}</p>
            <p className="text-xs text-text-secondary">{g.secured}</p>
            <div
              className="h-2.5 w-full overflow-hidden rounded-md bg-bg-subtle"
              role="progressbar"
              aria-valuenow={g.pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${g.title} : ${g.pct} %`}
            >
              <div className="h-full rounded-md bg-action-primary" style={{ width: `${g.pct}%` }} />
            </div>
            <p className="text-xs text-text-secondary">{g.owner}</p>
          </section>
        ))}
      </div>

      <section className="flex min-w-0 flex-col gap-3 rounded-lg border border-border-default bg-bg-surface p-5 xl:min-h-[180px]">
        <h2 className="text-base font-semibold">Prochaines actions</h2>
        <ul className="flex flex-col gap-3 text-[13px]">
          {next.map((n) => (
            <li key={n}>• {n}</li>
          ))}
        </ul>
      </section>
    </AppLayout>
  )
}
