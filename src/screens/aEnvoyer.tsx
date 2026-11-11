// Figma: 24:2370 "Desktop · Communications"
// Flow « Envoyer une communication » (research report): audience with a live
// recipient count → channel (e-mail, SMS or WhatsApp share link) → message from
// a template → preview → precise confirmation → « Envoi dans 20 s — Annuler ».
import { useEffect, useRef, useState } from 'react'
import { Link2, Mail, MessageCircle, Smartphone } from 'lucide-react'
import { AppLayout } from '../components/AppLayout'
import { Badge, Breadcrumb, ButtonPrimary, ButtonSecondary, Card, PageHeader, Row, RowText } from '../components/ui'
import { useFeedback } from '../components/feedback'
import type { RouteKey } from '../routes'

type Item = { id: string; title: string; meta: string; status: string; to?: RouteKey }

const initialMessages: Item[] = [
  { id: 'u15', title: 'Changement horaire U15', meta: '51 destinataires · Envoyée aujourd’hui 08:45', status: 'Envoyée', to: 'comDetail' },
  { id: 'tournoi', title: 'Rappel bénévoles tournoi', meta: '18 destinataires · Vendredi 18:00', status: 'Programmé' },
  { id: 'licences', title: 'Documents de licence manquants', meta: '8 destinataires · Aucune date', status: 'Brouillon' },
  { id: 'ag', title: 'Convocation assemblée générale', meta: '146 destinataires · 1er octobre', status: 'Prêt' },
]

const stats = [
  { label: 'Délivrés', value: '50 / 51' },
  { label: 'Lus', value: '47' },
  { label: 'Réponses', value: '41' },
  { label: 'Sans réponse', value: '3' },
  { label: 'Échecs', value: '1 adresse à corriger' },
]

// Parents per team (one recipient per family; both legal guardians share it).
const AUDIENCE = [
  { id: 'U9', count: 19 },
  { id: 'U11', count: 26 },
  { id: 'U13', count: 30 },
  { id: 'U15', count: 28 },
  { id: 'U18', count: 22 },
]
const ORDER = AUDIENCE.map((a) => a.id)

type Channel = 'email' | 'sms' | 'whatsapp'
const CHANNELS: { id: Channel; label: string; hint: string; Icon: typeof Mail }[] = [
  { id: 'email', label: 'E-mail', hint: 'Gratuit · suivi des lectures', Icon: Mail },
  { id: 'sms', label: 'SMS', hint: '0,05 € par message', Icon: Smartphone },
  { id: 'whatsapp', label: 'Lien WhatsApp', hint: 'À coller dans le groupe des parents', Icon: MessageCircle },
]

const DEFAULT_TEXT =
  'Bonjour, le gymnase Jean-Moulin sera fermé mercredi 18 novembre pour travaux : les entraînements sont annulés ce jour-là. Merci de confirmer que vous avez bien reçu ce message.'

/** "U11 à U15" when contiguous, else "U9, U13 et U18". */
function teamsLabel(teams: string[]) {
  const sorted = ORDER.filter((t) => teams.includes(t))
  if (sorted.length === 1) return sorted[0]
  const idx = sorted.map((t) => ORDER.indexOf(t))
  const contiguous = idx.every((v, i) => i === 0 || v === idx[i - 1] + 1)
  if (contiguous) return `${sorted[0]} à ${sorted[sorted.length - 1]}`
  return `${sorted.slice(0, -1).join(', ')} et ${sorted[sorted.length - 1]}`
}

type Phase = 'compose' | 'scheduled' | 'sent'

export default function AEnvoyer() {
  const { toast, confirm } = useFeedback()
  const [messages, setMessages] = useState(initialMessages)
  const [teams, setTeams] = useState<string[]>(['U11', 'U13', 'U15'])
  const [channel, setChannel] = useState<Channel>('email')
  const [subject, setSubject] = useState('Gymnase fermé mercredi 18 novembre')
  const [text, setText] = useState(DEFAULT_TEXT)
  const [phase, setPhase] = useState<Phase>('compose')
  const timer = useRef<number | undefined>(undefined)
  const composerRef = useRef<HTMLDivElement>(null)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const count = AUDIENCE.filter((a) => teams.includes(a.id)).reduce((n, a) => n + a.count, 0)
  const toggleTeam = (t: string) => setTeams((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]))
  const audienceLabel = teams.length ? `${count} parents des ${teamsLabel(teams)}` : 'aucun destinataire'
  const channelLabel = channel === 'sms' ? 'SMS' : 'e-mail'

  const send = () => {
    const id = `new-${Date.now()}`
    const item: Item = { id, title: subject, meta: `${count} destinataires · ${channelLabel} · envoi dans 20 s`, status: 'Programmé' }
    setMessages((m) => [item, ...m])
    setPhase('scheduled')
    timer.current = window.setTimeout(() => {
      setMessages((m) => m.map((x) => (x.id === id ? { ...x, status: 'Envoyée', meta: `${count} destinataires · ${channelLabel} · envoyée à l’instant` } : x)))
      setPhase('sent')
    }, 20000)
    toast({
      message: `Envoi dans 20 s à ${audienceLabel}.`,
      duration: 20000,
      undo: () => {
        window.clearTimeout(timer.current)
        setMessages((m) => m.filter((x) => x.id !== id))
        setPhase('compose')
      },
    })
  }

  const previewAndSend = () => {
    if (count === 0) {
      toast({ tone: 'info', message: 'Choisissez au moins une équipe destinataire.' })
      return
    }
    if (!text.trim()) {
      toast({ tone: 'info', message: 'Le message est vide : rédigez-le ou partez d’un modèle.' })
      return
    }
    confirm({
      title: `Envoyer à ${audienceLabel} ?`,
      body: (
        <div className="flex flex-col gap-3">
          <p>
            Par {channelLabel}. Un envoi ne peut pas être rattrapé une fois parti ; vous aurez 20 secondes pour l’annuler.
          </p>
          <div className="rounded-md border border-border-default bg-bg-subtle p-3 text-xs text-text-primary">
            {channel === 'email' && <p className="mb-1.5 font-semibold">Objet : {subject}</p>}
            <p>{text}</p>
            <p className="mt-2 font-semibold">[J’ai bien reçu le message]</p>
          </div>
        </div>
      ),
      confirmLabel: `Envoyer ${count} messages`,
      cancelLabel: 'Ne pas envoyer',
      onConfirm: send,
    })
  }

  const copyLink = () => {
    const link = 'https://llc-bureau.fr/m/gymnase-ferme-18-nov'
    try {
      void navigator.clipboard?.writeText(`${text}\n${link}`).catch(() => undefined)
    } catch {
      /* clipboard unavailable: the toast still explains what to do */
    }
    toast({ message: 'Lien de partage copié. Collez-le dans le groupe WhatsApp des parents.' })
  }

  const reset = () => {
    setPhase('compose')
    setSubject('')
    setText('')
  }

  return (
    <AppLayout>
      <Breadcrumb items={[{ label: 'Accueil', to: 'aujourdhui' }, { label: 'Communications' }]} />

      <PageHeader title="Communications" subtitle="Messages ciblés, réponses et suivi de réception">
        <ButtonSecondary to="comModeles">Modèles</ButtonSecondary>
        <ButtonPrimary
          requires="communicate"
          onClick={() => {
            if (phase !== 'compose') reset()
            composerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }}
        >
          Créer une communication
        </ButtonPrimary>
      </PageHeader>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_420px]">
        <div className="flex min-w-0 flex-col gap-6">
          <Card padding="p-0" className="gap-0 overflow-hidden">
            <h2 className="border-b border-border-default px-[18px] pt-4 pb-3 text-base font-bold">À envoyer, programmés et envoyés</h2>
            {messages.map((m) => (
              <Row key={m.id} to={m.to} className="min-h-[72px] px-[18px] last:border-b-0" right={<Badge size="sm" tone={m.status === 'Brouillon' ? 'neutral' : undefined}>{m.status}</Badge>}>
                <RowText title={m.title} meta={m.meta} />
              </Row>
            ))}
          </Card>

          <section className="flex flex-wrap gap-x-[38px] gap-y-4 rounded-lg border border-border-default bg-bg-surface p-[18px]" aria-label="Dernier envoi : Changement horaire U15">
            <p className="w-full text-xs font-semibold">Dernier envoi · Changement horaire U15</p>
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col gap-[3px]">
                <p className="text-xs text-text-secondary">{s.label}</p>
                <p className="text-sm font-bold">{s.value}</p>
              </div>
            ))}
          </section>
        </div>

        <div ref={composerRef} className="scroll-mt-20">
          <Card padding="p-5 sm:p-[22px]">
            <h2 className="text-lg font-bold">Nouvelle communication</h2>

            {phase !== 'compose' ? (
              <div className="flex flex-col gap-3">
                <div>
                  {phase === 'scheduled' ? <Badge>Programmé · envoi dans 20 s</Badge> : <Badge>Envoyée</Badge>}
                </div>
                <p className="text-[13px] font-semibold">{subject}</p>
                <p className="text-xs text-text-secondary">
                  {phase === 'scheduled'
                    ? `Le message part dans quelques secondes vers ${audienceLabel}. Utilisez « Annuler » dans la notification pour l’arrêter.`
                    : `Envoyée à ${audienceLabel} par ${channelLabel}. Les lectures et réponses s’afficheront dans la liste.`}
                </p>
                <div>
                  <ButtonSecondary wide={false} onClick={reset}>
                    Rédiger une autre communication
                  </ButtonSecondary>
                </div>
              </div>
            ) : (
              <>
                <fieldset className="flex flex-col gap-2">
                  <legend className="mb-2 text-xs font-semibold text-text-secondary">1 · AUDIENCE · PARENTS</legend>
                  <div className="flex flex-wrap gap-2">
                    {AUDIENCE.map((a) => {
                      const on = teams.includes(a.id)
                      return (
                        <button
                          key={a.id}
                          type="button"
                          aria-pressed={on}
                          onClick={() => toggleTeam(a.id)}
                          className={`inline-flex h-11 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-semibold transition-colors ${
                            on ? 'border-action-primary bg-action-primary text-text-inverse' : 'border-border-default bg-bg-surface hover:bg-bg-subtle'
                          }`}
                        >
                          {a.id}
                          <span className={`text-xs ${on ? 'text-white/75' : 'text-text-secondary'}`}>{a.count}</span>
                        </button>
                      )
                    })}
                  </div>
                  <p className="text-[13px] font-semibold" aria-live="polite">
                    {count > 0 ? `${count} destinataires · parents des ${teamsLabel(teams)}` : 'Aucun destinataire sélectionné'}
                  </p>
                </fieldset>

                <fieldset className="flex flex-col gap-2">
                  <legend className="mb-2 text-xs font-semibold text-text-secondary">2 · CANAL</legend>
                  {CHANNELS.map(({ id, label, hint, Icon }) => (
                    <label
                      key={id}
                      className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-md border px-3 py-2 ${
                        channel === id ? 'border-action-primary bg-bg-subtle' : 'border-border-default'
                      }`}
                    >
                      <input type="radio" name="canal" checked={channel === id} onChange={() => setChannel(id)} className="size-4 accent-action-primary" />
                      <Icon className="size-4 shrink-0" aria-hidden />
                      <span className="flex flex-col">
                        <span className="text-[13px] font-semibold">{label}</span>
                        <span className="text-xs text-text-secondary">{hint}</span>
                      </span>
                    </label>
                  ))}
                </fieldset>

                <div className="flex flex-col gap-2">
                  <p className="text-xs font-semibold text-text-secondary">3 · MESSAGE</p>
                  {channel === 'email' && (
                    <label className="flex flex-col gap-1 text-xs font-semibold">
                      Objet
                      <input
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="h-11 rounded-md border border-border-default px-3 text-[13px] font-normal"
                      />
                    </label>
                  )}
                  <label className="flex flex-col gap-1 text-xs font-semibold">
                    Texte
                    <textarea
                      rows={5}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      className="rounded-md border border-border-default p-3 text-[13px] font-normal"
                    />
                  </label>
                  <p className="text-xs text-text-secondary">
                    Une seule action dans le message : « J’ai bien reçu le message ». Une réponse arrête les relances pour la personne.
                  </p>
                </div>

                {channel === 'whatsapp' ? (
                  <div className="flex flex-col gap-2">
                    <p className="text-xs text-text-secondary">
                      Le club n’envoie rien : vous collez le lien dans le groupe WhatsApp, et les réponses arrivent quand même ici.
                    </p>
                    <div>
                      <ButtonPrimary requires="communicate" onClick={copyLink}>
                        <Link2 className="mr-2 size-4" aria-hidden />
                        Copier le lien de partage
                      </ButtonPrimary>
                    </div>
                  </div>
                ) : (
                  <div>
                    <ButtonPrimary requires="communicate" onClick={previewAndSend}>
                      Prévisualiser et envoyer
                    </ButtonPrimary>
                  </div>
                )}
              </>
            )}
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
