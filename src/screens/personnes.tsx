// Figma: 24:916 "Desktop · Bénévoles · Personnes"
import { useState } from 'react'
import { AppLayout } from '../components/AppLayout'
import { Badge, Breadcrumb, ButtonPrimary, ButtonSecondary, Card, PageHeader, type Tone } from '../components/ui'
import { Field } from '../components/benevoles/parts'
import { useFeedback } from '../components/feedback'

type Person = {
  name: string
  meta: string
  missions: string
  status: string
  tone?: Tone
  bio: string
  prefs: string
  limit: string
  unavailable: string
  channel: string
  last: string
}

const people: Person[] = [
  { name: 'Claire Durand', meta: 'OTM · Buvette', missions: '12 missions', status: 'Disponible', bio: 'Bénévole régulière · parent U15', prefs: 'Table de marque', limit: '2 missions / mois', unavailable: 'Dimanche matin', channel: 'Email', last: '7 septembre' },
  { name: 'Marc Lopez', meta: 'OTM · Transport', missions: '8 missions', status: 'Disponible', bio: 'Bénévole régulier · OTM club', prefs: 'Transport, table', limit: '3 missions / mois', unavailable: 'Vendredi soir', channel: 'SMS', last: '14 septembre' },
  { name: 'Sonia Brun', meta: 'Accueil · Buvette', missions: '5 missions', status: 'À former', tone: 'warning', bio: 'Bénévole occasionnelle · parent U11', prefs: 'Accueil', limit: '1 mission / mois', unavailable: 'Samedi matin', channel: 'Application', last: '31 août' },
  { name: 'Julie Martin', meta: 'Responsable buvette', missions: '18 missions', status: 'Limitée', tone: 'warning', bio: 'Responsable buvette · proche de sa limite', prefs: 'Buvette', limit: '4 missions / mois', unavailable: 'Aucune', channel: 'Application', last: '14 septembre' },
  { name: 'Alex Petit', meta: 'Transport', missions: '4 missions', status: 'Indisponible', bio: 'Bénévole occasionnel · absent jusqu’au 30 sept.', prefs: 'Transport', limit: '2 missions / mois', unavailable: 'Jusqu’au 30 septembre', channel: 'Email', last: '24 août' },
  { name: 'Thomas Roche', meta: 'Coach · Matériel', missions: '16 missions', status: 'Disponible', bio: 'Entraîneur U15 · matériel', prefs: 'Matériel', limit: '4 missions / mois', unavailable: 'Mercredi', channel: 'Application', last: '14 septembre' },
]

export default function Personnes() {
  const { toast } = useFeedback()
  const [selected, setSelected] = useState(0)
  const p = people[selected]

  return (
    <AppLayout>
      <Breadcrumb items={[{ label: 'Accueil', to: 'aujourdhui' }, { label: 'Bénévoles', to: 'planning' }, { label: 'Personnes' }]} />

      <PageHeader title="Personnes" subtitle="Bénévoles réguliers, occasionnels et responsables">
        <ButtonSecondary onClick={() => toast({ message: `Export CSV prêt : ${people.length} personnes.` })}>Exporter</ButtonSecondary>
        <ButtonPrimary>Ajouter une personne</ButtonPrimary>
      </PageHeader>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[760fr_352fr]">
        <section aria-label="Liste des bénévoles" className="flex min-w-0 flex-col overflow-hidden rounded-lg border border-border-default bg-bg-surface">
          {people.map((x, i) => (
            <button
              key={x.name}
              type="button"
              aria-pressed={i === selected}
              onClick={() => setSelected(i)}
              className={`grid min-h-[66px] grid-cols-[1fr_auto] items-center gap-x-3 border-b border-border-default px-[18px] py-2.5 text-left transition-colors last:border-b-0 sm:grid-cols-[1fr_1fr_auto] ${
                i === selected ? 'bg-bg-subtle' : 'hover:bg-bg-subtle/60'
              }`}
            >
              <span className="flex min-w-0 flex-col gap-[3px]">
                <span className="text-[13px] font-semibold">{x.name}</span>
                <span className="text-xs text-text-secondary">
                  {x.meta}
                  <span className="sm:hidden"> · {x.missions}</span>
                </span>
              </span>
              <span className="hidden text-xs text-text-secondary sm:block">{x.missions}</span>
              <Badge size="sm" tone={x.tone}>
                {x.status}
              </Badge>
            </button>
          ))}
        </section>

        <Card padding="p-5 sm:p-[22px]" className="gap-2.5">
          <h2 className="text-[19px] font-bold">{p.name}</h2>
          <p className="text-xs text-text-secondary">{p.bio}</p>
          <div>
            <Badge tone={p.tone}>{p.status}</Badge>
          </div>
          <Field size="sm" label="Préférences" value={p.prefs} />
          <Field size="sm" label="Limite" value={p.limit} />
          <Field size="sm" label="Indisponible" value={p.unavailable} />
          <Field size="sm" label="Canal" value={p.channel} />
          <Field size="sm" label="Dernière mission" value={p.last} />
          <div>
            <ButtonPrimary>Ouvrir le profil</ButtonPrimary>
          </div>
        </Card>
      </div>
    </AppLayout>
  )
}
