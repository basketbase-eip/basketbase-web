// Figma: 24:2770 "Desktop · Communications · Préférences"
import { useState } from 'react'
import { AppLayout } from '../components/AppLayout'
import { SubPageHeader } from '../components/communications/SubPageHeader'
import { Badge, Breadcrumb, ButtonPrimary, ButtonSecondary, Card } from '../components/ui'
import { useFeedback } from '../components/feedback'
import { useRole } from '../roles'

type Channel = { name: string; hint: string; state: 'on' | 'off' | 'setup' }

const initial: Channel[] = [
  { name: 'Application', hint: 'Canal principal', state: 'on' },
  { name: 'Email', hint: 'Documents et annonces', state: 'on' },
  { name: 'SMS', hint: 'Urgences uniquement', state: 'on' },
  { name: 'WhatsApp', hint: 'Lien de partage vers les groupes existants', state: 'setup' },
]

const STATUS = {
  on: <Badge size="sm">Activé</Badge>,
  off: <Badge size="sm">Désactivé</Badge>,
  setup: (
    <Badge size="sm" tone="warning">
      Non connecté
    </Badge>
  ),
} as const

const rules = [
  { title: 'Heures calmes', text: 'Ne pas envoyer de notification entre 21 h et 8 h.' },
  { title: 'Escalade', text: 'Basculer vers SMS seulement si une action urgente reste sans réponse.' },
  { title: 'Consentements', text: 'Respecter les préférences individuelles et conserver la preuve du consentement.' },
]

const ctl =
  'inline-flex h-10 min-w-[104px] shrink-0 items-center justify-center rounded-lg border border-border-default bg-bg-surface px-3 text-xs font-semibold whitespace-nowrap transition-colors hover:bg-bg-subtle disabled:cursor-not-allowed disabled:opacity-45'

export default function Preferences() {
  const { toast, comingSoon } = useFeedback()
  const { can } = useRole()
  const editable = can('settings')
  const [channels, setChannels] = useState(initial)
  const [saved, setSaved] = useState(initial)
  const dirty = channels.some((c, i) => c.state !== saved[i].state)

  const toggle = (i: number) => {
    const c = channels[i]
    if (c.state === 'setup') return comingSoon(`Connecter ${c.name}`)
    const next = c.state === 'on' ? 'off' : 'on'
    setChannels((cs) => cs.map((x, j) => (j === i ? { ...x, state: next } : x)))
    toast({
      message: `${c.name} ${next === 'on' ? 'activé' : 'désactivé'} — pensez à enregistrer.`,
      undo: () => setChannels((cs) => cs.map((x, j) => (j === i ? { ...x, state: c.state } : x))),
    })
  }

  return (
    <AppLayout>
      <Breadcrumb items={[{ label: 'Accueil', to: 'aujourdhui' }, { label: 'Communications', to: 'aEnvoyer' }, { label: 'Préférences' }]} />

      <SubPageHeader title="Préférences de communication" subtitle="Définir canaux, consentements et règles de sollicitation.">
        <ButtonPrimary
          requires="settings"
          onClick={() => {
            setSaved(channels)
            toast({ message: dirty ? 'Préférences de communication enregistrées.' : 'Aucune modification à enregistrer.' })
          }}
        >
          Enregistrer
        </ButtonPrimary>
      </SubPageHeader>

      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[552fr_560fr]">
        <Card padding="p-5" className="rounded-lg lg:min-h-[470px]">
          <h2 className="text-base font-semibold">Canaux du club</h2>
          {dirty && <p className="text-xs font-semibold text-warning-fg">Modifications non enregistrées</p>}
          {channels.map((c, i) => (
            <div key={c.name} className="flex min-h-[58px] flex-wrap items-center justify-between gap-3 border-b border-border-default py-2 last:border-b-0">
              <div className="flex min-w-[140px] flex-1 flex-col gap-0.5">
                <p className="text-[13px] font-semibold">{c.name}</p>
                <p className="text-xs text-text-secondary">{c.hint}</p>
              </div>
              <div className="flex items-center gap-2">
                {STATUS[c.state]}
                <button
                  type="button"
                  disabled={!editable}
                  title={editable ? undefined : 'Les paramètres sont réservés au bureau.'}
                  onClick={() => toggle(i)}
                  aria-label={`${c.state === 'setup' ? 'Configurer' : c.state === 'on' ? 'Désactiver' : 'Activer'} ${c.name}`}
                  className={ctl}
                >
                  {c.state === 'setup' ? 'Configurer' : c.state === 'on' ? 'Désactiver' : 'Activer'}
                </button>
              </div>
            </div>
          ))}
        </Card>

        <Card padding="p-5" className="items-start rounded-lg lg:min-h-[470px]">
          <h2 className="text-base font-semibold">Règles intelligentes</h2>
          {rules.map((r) => (
            <div key={r.title} className="flex flex-col gap-3">
              <p className="text-[13px] font-semibold">{r.title}</p>
              <p className="text-xs text-text-secondary">{r.text}</p>
            </div>
          ))}
          <ButtonSecondary wide={false} className="min-w-[166px]">
            Gérer les consentements
          </ButtonSecondary>
        </Card>
      </div>
    </AppLayout>
  )
}
