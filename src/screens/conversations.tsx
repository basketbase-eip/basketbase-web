// Figma: 24:2625 "Desktop · Communications · Conversations"
import { useState } from 'react'
import { AppLayout } from '../components/AppLayout'
import { SubPageHeader } from '../components/communications/SubPageHeader'
import { Badge, Breadcrumb, ButtonPrimary, ButtonSecondary, type Tone } from '../components/ui'
import { useFeedback } from '../components/feedback'
import { useRole } from '../roles'

type Msg = { from: 'in' | 'out'; text: string }
type Conv = { name: string; topic: string; status: string; tone?: Tone; subject: string; messages: Msg[] }

const initial: Conv[] = [
  {
    name: 'Parents U15',
    topic: 'Horaire du match',
    status: '3 nouveaux',
    tone: 'info',
    subject: 'Changement d’horaire du match',
    messages: [
      { from: 'in', text: 'Le nouvel horaire est-il définitif ? Nous devons organiser le transport.' },
      { from: 'out', text: 'Oui, coup d’envoi confirmé à 18 h 30. Rendez-vous à 17 h 45.' },
    ],
  },
  { name: 'Bénévoles tournoi', topic: 'Missions à couvrir', status: '7 réponses', tone: 'info', subject: 'Missions à couvrir', messages: [] },
  { name: 'Bureau', topic: 'Budget transport', status: 'À décider', tone: 'warning', subject: 'Budget transport', messages: [] },
  { name: 'Emma Roche', topic: 'Licence incomplète', status: '1 réponse', tone: 'info', subject: 'Licence incomplète', messages: [] },
]

export default function Conversations() {
  const { toast } = useFeedback()
  const { can } = useRole()
  const [convs, setConvs] = useState(initial)
  const [active, setActive] = useState(0)
  const [replying, setReplying] = useState(false)
  const [draft, setDraft] = useState('')
  const c = convs[active]

  const send = () => {
    const text = draft.trim()
    if (!text) {
      toast({ tone: 'info', message: 'Écrivez votre réponse avant de l’envoyer.' })
      return
    }
    setConvs((cs) => cs.map((x, i) => (i === active ? { ...x, messages: [...x.messages, { from: 'out', text }] } : x)))
    setDraft('')
    setReplying(false)
    toast({ message: `Réponse envoyée à « ${c.name} ».` })
  }

  const open = (i: number) => {
    setActive(i)
    setReplying(false)
    // Opening a conversation marks its new messages as read.
    setConvs((cs) => cs.map((x, j) => (j === i && /nouveau/.test(x.status) ? { ...x, status: 'Lu', tone: 'success' } : x)))
  }

  return (
    <AppLayout>
      <Breadcrumb items={[{ label: 'Accueil', to: 'aujourdhui' }, { label: 'Communications', to: 'aEnvoyer' }, { label: 'Conversations' }]} />

      <SubPageHeader title="Conversations" subtitle="Traiter les réponses sans perdre le contexte du club.">
        <ButtonPrimary requires="communicate">Démarrer une conversation</ButtonPrimary>
      </SubPageHeader>

      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[392fr_720fr]">
        <nav
          aria-label="Conversations"
          className="flex flex-col overflow-hidden rounded-lg border border-border-default bg-bg-surface lg:min-h-[560px]"
        >
          {convs.map((x, i) => (
            <button
              key={x.name}
              type="button"
              aria-current={i === active ? 'true' : undefined}
              onClick={() => open(i)}
              className={`flex min-h-[84px] items-center justify-between gap-3 border-b border-border-default p-4 text-left transition-colors ${
                i === active ? 'bg-bg-subtle' : 'bg-bg-surface hover:bg-bg-subtle/60'
              }`}
            >
              <span className="flex min-w-0 flex-col gap-1">
                <span className="text-[13px] font-semibold">{x.name}</span>
                <span className="text-xs text-text-secondary">{x.topic}</span>
              </span>
              <Badge size="sm" tone={x.tone}>
                {x.status}
              </Badge>
            </button>
          ))}
        </nav>

        <section className="flex min-w-0 flex-col items-start gap-3 rounded-lg border border-border-default bg-bg-surface p-5 lg:min-h-[560px]">
          <h2 className="text-lg font-semibold">{c.name}</h2>
          <p className="text-xs text-text-secondary">Objet · {c.subject}</p>
          {c.messages.length === 0 && (
            <p className="text-[13px] text-text-secondary">Aucun message affiché pour cette conversation dans le prototype.</p>
          )}
          {c.messages.map((m, i) => (
            <div
              key={i}
              className={`w-full max-w-[500px] rounded-lg border border-border-default p-3.5 text-[13px] sm:min-h-[90px] ${
                m.from === 'in' ? 'bg-bg-subtle' : 'self-end bg-action-primary text-text-inverse'
              }`}
            >
              {m.text}
            </div>
          ))}
          {replying && (
            <textarea
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              aria-label="Votre réponse"
              placeholder="Votre réponse…"
              className="min-h-[90px] w-full max-w-[500px] rounded-lg border border-border-default p-3.5 text-[13px] outline-none focus:border-text-primary"
            />
          )}
          <div className="flex flex-wrap gap-3">
            <ButtonPrimary requires="communicate" onClick={replying ? send : () => setReplying(true)}>
              {replying ? 'Envoyer la réponse' : 'Répondre'}
            </ButtonPrimary>
            {replying && can('communicate') && (
              <ButtonSecondary
                onClick={() => {
                  setReplying(false)
                  setDraft('')
                }}
              >
                Annuler
              </ButtonSecondary>
            )}
          </div>
        </section>
      </div>
    </AppLayout>
  )
}
