// Figma: 24:1090 "Desktop · Bénévoles · Historique"
import { AppLayout } from '../components/AppLayout'
import { Breadcrumb, ButtonPrimary, ButtonSecondary, Card, Metric, PageHeader, RowText } from '../components/ui'
import { SectionTitle } from '../components/benevoles/parts'
import { useFeedback } from '../components/feedback'

const log = [
  { name: 'Julie Martin', role: 'Responsable buvette', when: '14 sept. · 4 h' },
  { name: 'Marc Lopez', role: 'Transport U18', when: '14 sept. · 5 h' },
  { name: 'Claire Durand', role: 'Table de marque', when: '7 sept. · 2 h 30' },
  { name: 'Thomas Roche', role: 'Coaching U15', when: 'Semaine · 8 h' },
  { name: 'Sophie Martin', role: 'Traitement licences', when: 'Semaine · 3 h' },
]

export default function Historique() {
  const { toast } = useFeedback()
  return (
    <AppLayout>
      <Breadcrumb items={[{ label: 'Accueil', to: 'aujourdhui' }, { label: 'Bénévoles', to: 'planning' }, { label: 'Historique' }]} />

      <PageHeader title="Historique des contributions" subtitle="Suivi explicable, sans classement public">
        <ButtonSecondary onClick={() => toast({ message: `Export CSV prêt : ${log.length} contributions récentes.` })}>Exporter</ButtonSecondary>
        <ButtonPrimary onClick={() => toast({ message: 'Bilan de saison prêt (PDF).' })}>Exporter le bilan</ButtonPrimary>
      </PageHeader>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Metric label="Contributions" value="386" hint="cette saison" />
        <Metric label="Personnes actives" value="74" hint="sur 128" />
        <Metric label="Heures déclarées" value="812 h" hint="toutes responsabilités" />
        <Metric label="Missions annulées" value="9" hint="dont 7 remplacées" />
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[760fr_352fr]">
        <section className="flex min-w-0 flex-col overflow-hidden rounded-lg border border-border-default bg-bg-surface">
          {log.map((l) => (
            <div
              key={l.name}
              className="flex min-h-[62px] items-center justify-between gap-3 border-b border-border-default px-[18px] py-2.5 last:border-b-0"
            >
              <RowText title={l.name} meta={<span className="text-xs">{l.role}</span>} />
              <p className="shrink-0 text-xs font-semibold">{l.when}</p>
            </div>
          ))}
        </section>

        <Card padding="p-5 sm:p-[22px]" className="gap-2.5">
          <SectionTitle>Lecture responsable</SectionTitle>
          <p className="text-[13px] text-text-secondary">
            Ces données servent à repérer la surcharge et les besoins d’accompagnement. Elles ne produisent aucun
            classement public.
          </p>
          <div className="flex flex-col items-start gap-2.5">
            <ButtonPrimary to="personnes">Voir les personnes surchargées</ButtonPrimary>
            <ButtonSecondary>Configurer la comptabilisation</ButtonSecondary>
          </div>
        </Card>
      </div>
    </AppLayout>
  )
}
