// Figma: 24:731 "Desktop · Centre de remplacement"
// Flow (research report, « Remplacer un bénévole »): eligible people are listed
// with why they are eligible, the organiser invites them in one gesture, the
// first to accept takes the slot — no full-page confirmation, toasts with undo.
import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { AppLayout } from '../components/AppLayout'
import { Badge, Breadcrumb, ButtonPrimary, ButtonSecondary, Card, PageHeader } from '../components/ui'
import { Field, SectionTitle } from '../components/benevoles/parts'
import { useFeedback } from '../components/feedback'
import { slotStore } from '../components/flows/slots'

type Candidate = { name: string; available: string; slotsThisMonth: number }

// Sorted by the least solicited this month.
const eligible: Candidate[] = [
  { name: 'Karim Haddad', available: 'Disponible samedi soir', slotsThisMonth: 0 },
  { name: 'Claire Durand', available: 'Disponible samedi soir', slotsThisMonth: 1 },
  { name: 'Marc Lopez', available: 'Disponible samedi soir', slotsThisMonth: 3 },
]

const notEligible = [
  { name: 'Sonia Brun', why: 'pas encore qualifiée OTM (formation e-Marque prévue le 21 novembre)' },
  { name: 'Alex Petit', why: 'indisponible : match de son enfant à 17:00' },
]

const rules = [
  'Le titulaire reste responsable jusqu’à acceptation.',
  'Une proposition expire après 2 h.',
  'Le premier qui accepte prend le créneau ; les autres reçoivent « C’est pourvu, merci ».',
  'Chaque personne choisit ses canaux de notification.',
]

const baseLog = ['14:08 · Absence signalée par Nicolas Perrin', '14:08 · Romain Petit alerté', '14:12 · 3 personnes éligibles trouvées']

type Phase = 'select' | 'proposed' | 'filled'

export default function Remplacement() {
  const { toast } = useFeedback()
  const [selected, setSelected] = useState<string[]>(eligible.map((c) => c.name))
  // The slot store outlives this screen: if the replacement was already accepted, show it.
  const alreadyFilled = slotStore.get().filledByReplacement.includes('sam-1815-table')
  const [phase, setPhase] = useState<Phase>(alreadyFilled ? 'filled' : 'select')
  const [sentTo, setSentTo] = useState<string[]>(alreadyFilled ? eligible.map((c) => c.name) : [])
  const [log, setLog] = useState<string[]>(baseLog)
  const [preview, setPreview] = useState(false)

  const toggle = (name: string) => setSelected((s) => (s.includes(name) ? s.filter((n) => n !== name) : [...s, name]))
  const ordered = (names: string[]) => eligible.map((c) => c.name).filter((n) => names.includes(n))

  const send = () => {
    if (selected.length === 0) {
      toast({ tone: 'info', message: 'Sélectionnez au moins une personne à qui proposer le créneau.' })
      return
    }
    const to = ordered(selected)
    const prevLog = log
    setSentTo(to)
    setPhase('proposed')
    setLog([...log, `À l’instant · Propositions envoyées à ${to.length} personne${to.length > 1 ? 's' : ''}`])
    toast({
      message: `Propositions envoyées à ${to.length} personne${to.length > 1 ? 's' : ''} — le premier qui accepte prend le créneau.`,
      undo: () => {
        setPhase('select')
        setSentTo([])
        setLog(prevLog)
        slotStore.setFilledByReplacement('sam-1815-table', false)
      },
    })
  }

  const simulate = () => {
    const winner = sentTo[0]
    const prevLog = log
    setPhase('filled')
    slotStore.setFilledByReplacement('sam-1815-table', true)
    setLog([
      ...log,
      `À l’instant · ${winner} a accepté`,
      ...(sentTo.length > 1 ? [`À l’instant · « C’est pourvu, merci » envoyé aux ${sentTo.length - 1} autres`] : []),
    ])
    toast({
      message: `Créneau réattribué à ${winner}.`,
      undo: () => {
        setPhase('proposed')
        slotStore.setFilledByReplacement('sam-1815-table', false)
        setLog(prevLog)
      },
    })
  }

  const steps = [
    { label: '1 · Absence signalée', done: true },
    { label: '2 · Personnes éligibles', done: true },
    { label: '3 · Propositions envoyées', done: phase !== 'select' },
    { label: '4 · Remplacement accepté', done: phase === 'filled' },
  ]

  const statusOf = (name: string) => {
    if (phase === 'select' || !sentTo.includes(name)) return null
    if (phase === 'filled') return name === sentTo[0] ? <Badge size="sm">Confirmé</Badge> : <Badge size="sm" tone="neutral">Prévenu : c’est pourvu</Badge>
    return <Badge size="sm">Proposé</Badge>
  }

  return (
    <AppLayout>
      <Breadcrumb items={[{ label: 'Accueil', to: 'aujourdhui' }, { label: 'Bénévoles', to: 'missions' }, { label: 'Remplacement' }]} />

      <PageHeader title="Remplacement · table de marque" subtitle="Match U15 · samedi 14 novembre · 18:15–20:45">
        {phase === 'select' ? (
          <ButtonPrimary onClick={send}>{`Envoyer les propositions (${selected.length})`}</ButtonPrimary>
        ) : (
          <ButtonSecondary to="planning">Voir le planning</ButtonSecondary>
        )}
      </PageHeader>

      <ol className="grid grid-cols-2 lg:grid-cols-4" aria-label="Étapes du remplacement">
        {steps.map((s) => (
          <li
            key={s.label}
            className={`flex min-h-14 items-center justify-center gap-1.5 border border-border-default px-3 text-center text-xs font-semibold ${
              s.done ? 'bg-action-primary text-text-inverse' : 'bg-bg-surface text-text-secondary'
            }`}
          >
            {s.done && <Check className="size-3.5 shrink-0" aria-hidden />}
            {s.label}
            {s.done && <span className="sr-only"> (fait)</span>}
          </li>
        ))}
      </ol>

      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 lg:grid-cols-[300fr_540fr_248fr]">
        <Card padding="p-5 sm:p-[22px]">
          <SectionTitle>Demande</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {phase === 'filled' ? <Badge>Pourvu</Badge> : <Badge>À pourvoir</Badge>}
            {phase !== 'filled' && <Badge tone="warning">Réponse avant 17:00</Badge>}
          </div>
          <Field label="Mission" value="Table de marque" />
          <Field label="Créneau" value="Samedi 18:15–20:45" />
          <Field label="Compétence" value="OTM qualifié ou e-learning à jour" />
          <Field label="Remplacé" value="Nicolas Perrin" />
          <Field label="Motif visible" value="Indisponible" />
          <div>
            <ButtonSecondary>Modifier la demande</ButtonSecondary>
          </div>
        </Card>

        <Card padding="p-5 sm:p-[22px]">
          <SectionTitle>Personnes éligibles</SectionTitle>
          <p className="text-xs text-text-secondary">
            Qualifiées pour le poste, licence validée, disponibles — les moins sollicitées ce mois-ci en premier.
          </p>
          <ul>
            {eligible.map((c) => {
              const on = selected.includes(c.name)
              const status = statusOf(c.name)
              return (
                <li key={c.name} className="flex items-start gap-3 border-b border-border-default py-3 last:border-b-0">
                  {phase === 'select' ? (
                    <label className="-m-2 flex size-11 shrink-0 cursor-pointer items-center justify-center">
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => toggle(c.name)}
                        className="size-5 accent-action-primary"
                        aria-label={`Proposer le créneau à ${c.name}`}
                      />
                    </label>
                  ) : null}
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-[13px] font-semibold">{c.name}</p>
                      {status}
                    </div>
                    <ul className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-text-secondary">
                      {['OTM qualifié', 'Licence validée', c.available].map((w) => (
                        <li key={w} className="inline-flex items-center gap-1">
                          <Check className="size-3.5 text-success-fg" strokeWidth={2.5} aria-hidden />
                          {w}
                        </li>
                      ))}
                      <li>
                        {c.slotsThisMonth === 0 ? 'Aucun créneau ce mois' : `${c.slotsThisMonth} créneau${c.slotsThisMonth > 1 ? 'x' : ''} ce mois`}
                      </li>
                    </ul>
                  </div>
                </li>
              )
            })}
          </ul>

          {phase === 'proposed' && (
            <div className="flex flex-col gap-3 rounded-md bg-info-bg p-3 text-info-fg">
              <p className="text-xs font-semibold">
                En attente de réponse · les propositions expirent dans 2 h. Le premier qui accepte prend le créneau ; les autres
                recevront « C’est pourvu, merci ».
              </p>
              <div>
                <ButtonSecondary wide={false} onClick={simulate}>
                  Simuler une réponse
                </ButtonSecondary>
              </div>
            </div>
          )}
          {phase === 'filled' && (
            <p className="rounded-md bg-success-bg p-3 text-xs font-semibold text-success-fg">
              {sentTo[0]} tiendra la table de marque samedi. Le planning est à jour.
            </p>
          )}

          <details className="text-xs text-text-secondary">
            <summary className="flex min-h-11 cursor-pointer items-center font-semibold">Non proposés ({notEligible.length})</summary>
            <ul className="flex flex-col gap-1.5 pb-1">
              {notEligible.map((n) => (
                <li key={n.name} className="flex items-start gap-1.5">
                  <X className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                  <span>
                    <span className="font-semibold text-text-primary">{n.name}</span> — {n.why}
                  </span>
                </li>
              ))}
            </ul>
          </details>
        </Card>

        <Card padding="p-5 sm:p-[22px]" className="md:col-span-2 lg:col-span-1">
          <SectionTitle>Avant envoi</SectionTitle>
          <ul className="flex flex-col gap-3 text-xs text-text-secondary">
            {rules.map((r) => (
              <li key={r}>• {r}</li>
            ))}
          </ul>
          <div>
            <ButtonSecondary wide={false} onClick={() => setPreview((p) => !p)}>
              {preview ? 'Masquer l’aperçu' : 'Aperçu du message'}
            </ButtonSecondary>
          </div>
          {preview && (
            <div className="rounded-md border border-border-default bg-bg-subtle p-3 text-xs">
              <p>Bonjour Karim,</p>
              <p className="mt-1.5">
                La table de marque du match U15, samedi 14 novembre de 18:15 à 20:45, cherche un remplaçant. Pouvez-vous venir ?
              </p>
              <p className="mt-1.5 font-semibold">[Oui, je viens] · [Non, merci]</p>
            </div>
          )}
        </Card>
      </div>

      <Card padding="p-[18px]">
        <h2 className="text-base font-bold">Historique</h2>
        <ul className="flex flex-col gap-x-7 gap-y-1.5 text-xs text-text-secondary sm:flex-row sm:flex-wrap">
          {log.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </Card>
    </AppLayout>
  )
}
