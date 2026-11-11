// Figma: 24:1012 "Desktop · Bénévoles · Compétences"
import { AppLayout } from '../components/AppLayout'
import { Badge, Breadcrumb, ButtonPrimary, ButtonSecondary, Card, PageHeader } from '../components/ui'
import { SectionTitle } from '../components/benevoles/parts'
import { useFeedback } from '../components/feedback'

const skills = [
  { name: 'Table de marque', count: '12 personnes', note: '2 expirent bientôt', alert: true },
  { name: 'Buvette', count: '28 personnes', note: '4 responsables', alert: false },
  { name: 'Transport', count: '18 personnes', note: '9 véhicules', alert: false },
  { name: 'Premiers secours', count: '7 personnes', note: '1 recyclage requis', alert: true },
]

const trainings = [
  { name: 'Formation OTM niveau 1', date: '12 octobre', seats: '8 inscrits / 12' },
  { name: 'Hygiène et buvette', date: '5 novembre', seats: '4 inscrits / 10' },
  { name: 'Premiers secours recyclage', date: '18 novembre', seats: '2 inscrits / 6' },
]

export default function Competences() {
  const { toast } = useFeedback()
  return (
    <AppLayout>
      <Breadcrumb items={[{ label: 'Accueil', to: 'aujourdhui' }, { label: 'Bénévoles', to: 'planning' }, { label: 'Compétences' }]} />

      <PageHeader title="Compétences" subtitle="Qualifications, formations et besoins du club">
        <ButtonSecondary onClick={() => toast({ message: 'Export CSV prêt : compétences et formations.' })}>Exporter</ButtonSecondary>
        <ButtonPrimary>Créer une formation</ButtonPrimary>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {skills.map((s) => (
          <Card key={s.name} padding="p-[18px]" className="gap-2.5">
            <h2 className="text-base font-bold">{s.name}</h2>
            <p className="text-[13px] font-semibold">{s.count}</p>
            {s.alert ? (
              <div>
                <Badge size="sm" tone="warning">
                  {s.note}
                </Badge>
              </div>
            ) : (
              <p className="text-xs text-text-secondary">{s.note}</p>
            )}
            <div>
              <ButtonSecondary to="personnes">Voir les personnes</ButtonSecondary>
            </div>
          </Card>
        ))}
      </div>

      <Card padding="p-5 sm:p-[22px]" className="gap-2.5">
        <SectionTitle>Plan de formation</SectionTitle>
        <div>
          {trainings.map((t) => (
            <div
              key={t.name}
              className="grid min-h-[54px] grid-cols-[1fr_auto] items-center gap-x-3 border-b border-border-default py-2 sm:grid-cols-[1fr_1fr_auto]"
            >
              <div className="flex min-w-0 flex-col gap-[3px]">
                <p className="text-[13px] font-semibold">{t.name}</p>
                <p className="text-xs text-text-secondary sm:hidden">{t.date}</p>
              </div>
              <p className="hidden text-xs text-text-secondary sm:block">{t.date}</p>
              <p className="text-xs font-semibold whitespace-nowrap">{t.seats}</p>
            </div>
          ))}
        </div>
      </Card>
    </AppLayout>
  )
}
