// Figma: 24:1695 "Desktop · Administration · Responsabilités"
import { AppLayout } from '../components/AppLayout'
import { Badge, Breadcrumb, ButtonPrimary, ButtonSecondary, Card, PageHeader } from '../components/ui'
import { useFeedback } from '../components/feedback'

const roles = [
  { role: 'Présidence', scope: 'Tous les modules', person: 'Camille Martin', status: 'Actif' },
  { role: 'Trésorerie', scope: 'Finances · documents', person: 'Alex Bernard', status: 'Actif' },
  { role: 'Secrétariat', scope: 'Licences · communications', person: 'Sophie Martin', status: 'Actif' },
  { role: 'Responsable bénévoles', scope: 'Missions · personnes', person: 'Julie Durand', status: 'Actif' },
  { role: 'Responsable buvette', scope: 'Événements · bilan buvette', person: 'Marc Lopez', status: 'À confirmer' },
]

export default function Responsabilites() {
  const { toast } = useFeedback()
  return (
    <AppLayout>
      <Breadcrumb
        items={[{ label: 'Accueil', to: 'aujourdhui' }, { label: 'Administration', to: 'reunions' }, { label: 'Responsabilités' }]}
      />

      <PageHeader title="Responsabilités" subtitle="Droits, délégations et passations">
        <ButtonSecondary onClick={() => toast({ message: `Export CSV prêt : ${roles.length} responsabilités.` })}>Exporter</ButtonSecondary>
        <ButtonPrimary requires="settings">Attribuer une responsabilité</ButtonPrimary>
      </PageHeader>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[760fr_352fr]">
        <section className="flex min-w-0 flex-col overflow-hidden rounded-lg border border-border-default bg-bg-surface">
          {roles.map((r) => (
            <div
              key={r.role}
              className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 border-b border-border-default px-[18px] py-3 sm:min-h-[66px] sm:grid-cols-[1fr_1fr_auto] sm:py-2"
            >
              <div className="flex min-w-0 flex-col gap-[3px]">
                <p className="text-[13px] font-semibold">{r.role}</p>
                <p className="text-xs text-text-secondary">{r.scope}</p>
              </div>
              <p className="col-start-1 text-xs font-semibold sm:col-start-auto sm:text-center">{r.person}</p>
              <div className="col-start-2 row-span-2 row-start-1 sm:col-start-auto sm:row-auto">
                <Badge>{r.status}</Badge>
              </div>
            </div>
          ))}
        </section>

        <Card padding="p-5 sm:p-[22px]" className="gap-2.5">
          <h2 className="text-lg font-bold">Passations</h2>
          <p className="text-[13px] text-text-secondary">
            4 dossiers et 6 documents doivent être transmis au prochain responsable buvette.
          </p>
          <div>
            <ButtonPrimary>Préparer la passation</ButtonPrimary>
          </div>
          <p className="text-xs text-text-secondary">
            Chaque transfert conserve les droits précédents jusqu’à confirmation du successeur.
          </p>
        </Card>
      </div>
    </AppLayout>
  )
}
