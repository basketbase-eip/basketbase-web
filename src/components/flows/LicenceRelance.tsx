import { useState } from 'react'
import { RLink as Link } from '../RLink'
import { Send } from 'lucide-react'
import { useFeedback } from '../feedback'
import { Badge, ButtonPrimary, type Tone } from '../ui'
import { to, type RouteKey } from '../../routes'

/* « Relancer des licences » (research report): saved views with counts, row
 * selection, a sticky bulk-action bar showing the real count, a preview of the
 * message per reason, then « Envoyer N relances » / « Ne pas envoyer », and a
 * final report that separates successes from failures. The licence status
 * mirrors FBI; this tool does not recompute it. */

type View = 'incompletes' | 'comite' | 'certificat' | 'paiement'
type Reason = 'questionnaire' | 'certificat' | 'paiement' | 'comite'

type Licence = {
  name: string
  team: string
  detail: string
  status: string
  tone: Tone
  views: View[]
  reason?: Reason
  to?: RouteKey
}

const LICENCES: Licence[] = [
  { name: 'Emma Roche', team: 'U15', detail: 'Certificat médical « en compétition » manquant', status: 'Incomplète', tone: 'warning', views: ['incompletes', 'certificat'], reason: 'certificat', to: 'dossierDetail' },
  { name: 'Sarah Bernard', team: 'U18', detail: 'Questionnaire de santé non rempli', status: 'Incomplète', tone: 'warning', views: ['incompletes'], reason: 'questionnaire' },
  { name: 'Tom Girard', team: 'U13', detail: 'Questionnaire de santé non rempli', status: 'Incomplète', tone: 'warning', views: ['incompletes'], reason: 'questionnaire' },
  { name: 'Inès Moreau', team: 'U13', detail: 'Solde impayé de 40 €', status: 'Bloquée (paiement)', tone: 'danger', views: ['paiement'], reason: 'paiement' },
  { name: 'Yanis Diallo', team: 'U11', detail: 'Solde impayé de 75 €', status: 'Bloquée (paiement)', tone: 'danger', views: ['paiement'], reason: 'paiement' },
  { name: 'Nina Martin', team: 'U15', detail: 'Transmise au Comité le 21 octobre (21 j)', status: 'En attente du Comité', tone: 'info', views: ['comite'], reason: 'comite' },
  { name: 'Chloé Petit', team: 'U11', detail: 'Transmise au Comité le 18 octobre (24 j)', status: 'En attente du Comité', tone: 'info', views: ['comite'], reason: 'comite' },
  { name: 'Léo Fabre', team: 'U18', detail: 'Certificat de 2023 : à renouveler cette saison', status: 'Certificat à renouveler', tone: 'warning', views: ['certificat'], reason: 'certificat' },
  { name: 'Lucas Morel', team: 'Coach U15', detail: 'Tout est conforme', status: 'Validée', tone: 'success', views: [] },
  { name: 'Hugo Lopez', team: 'Seniors', detail: 'Tout est conforme', status: 'Validée', tone: 'success', views: [] },
]

const VIEWS: { id: View | 'all'; label: string }[] = [
  { id: 'all', label: 'Toutes' },
  { id: 'incompletes', label: 'Incomplètes' },
  { id: 'comite', label: 'En attente du Comité > 15 j' },
  { id: 'certificat', label: 'Certificat à renouveler' },
  { id: 'paiement', label: 'Bloquées pour paiement' },
]

const MESSAGE: Record<Reason, { label: string; text: string }> = {
  questionnaire: {
    label: 'Questionnaire de santé',
    text: '« Il manque le questionnaire de santé pour finaliser la licence. Vous pouvez le remplir en 2 minutes depuis ce lien. »',
  },
  certificat: {
    label: 'Certificat « en compétition »',
    text: '« Merci de déposer un certificat médical mentionnant « en compétition ». Sans lui, la licence ne peut pas être validée. »',
  },
  paiement: {
    label: 'Paiement',
    text: '« La licence est en attente du solde de la cotisation. Vous pouvez régler en ligne ou contacter la trésorerie. »',
  },
  comite: {
    label: 'Comité départemental',
    text: '« Relance au Comité : dossier transmis il y a plus de 15 jours, merci de nous indiquer s’il manque une pièce. »',
  },
}

export function LicenceRelance({ titlePrefix = '', title = 'Licences' }: { titlePrefix?: string; title?: string }) {
  const { toast, confirm } = useFeedback()
  const [view, setView] = useState<View | 'all'>('all')
  const [selected, setSelected] = useState<string[]>([])
  const [relanced, setRelanced] = useState<string[]>([])

  const rows = view === 'all' ? LICENCES : LICENCES.filter((l) => l.views.includes(view))
  const selectable = rows.filter((l) => l.reason)
  const allOn = selectable.length > 0 && selectable.every((l) => selected.includes(l.name))
  const count = (v: View | 'all') => (v === 'all' ? LICENCES.length : LICENCES.filter((l) => l.views.includes(v)).length)

  const toggle = (name: string) => setSelected((s) => (s.includes(name) ? s.filter((n) => n !== name) : [...s, name]))
  const toggleAll = () =>
    setSelected((s) => (allOn ? s.filter((n) => !selectable.some((l) => l.name === n)) : [...new Set([...s, ...selectable.map((l) => l.name)])]))

  const relancer = () => {
    const targets = LICENCES.filter((l) => selected.includes(l.name) && l.reason)
    const n = targets.length
    const byReason = (Object.keys(MESSAGE) as Reason[])
      .map((r) => ({ r, people: targets.filter((t) => t.reason === r) }))
      .filter((g) => g.people.length > 0)
    confirm({
      title: `Envoyer ${n} relance${n > 1 ? 's' : ''} ?`,
      body: (
        <div className="flex flex-col gap-3">
          <p>Chaque personne reçoit le message adapté à ce qui bloque sa licence :</p>
          <ul className="flex max-h-[45vh] flex-col gap-3 overflow-y-auto">
            {byReason.map(({ r, people }) => (
              <li key={r} className="rounded-md bg-bg-subtle p-3">
                <p className="font-semibold text-text-primary">
                  {MESSAGE[r].label} · {people.length}
                </p>
                <p className="text-xs">{people.map((p) => p.name).join(', ')}</p>
                <p className="mt-1.5 text-xs italic">{MESSAGE[r].text}</p>
              </li>
            ))}
          </ul>
        </div>
      ),
      confirmLabel: `Envoyer ${n} relance${n > 1 ? 's' : ''}`,
      cancelLabel: 'Ne pas envoyer',
      onConfirm: () => {
        setRelanced((r) => [...new Set([...r, ...targets.map((t) => t.name)])])
        setSelected([])
        toast({ message: `${n} relance${n > 1 ? 's' : ''} envoyée${n > 1 ? 's' : ''} · 0 échec` })
      },
    })
  }

  return (
    <section className="flex min-w-0 flex-col gap-4" aria-label={title}>
      <div className="flex flex-col gap-1">
        <h2 className="text-[19px] font-bold">{title}</h2>
        <p className="text-xs text-text-secondary">Vues enregistrées · le statut reflète celui de FBI.</p>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Vues enregistrées">
        {VIEWS.map((v) => {
          const on = view === v.id
          return (
            <button
              key={v.id}
              type="button"
              aria-pressed={on}
              onClick={() => setView(v.id)}
              className={`inline-flex h-11 items-center gap-2 rounded-full border px-4 text-[13px] font-semibold transition-colors ${
                on ? 'border-action-primary bg-action-primary text-text-inverse' : 'border-border-default bg-bg-surface hover:bg-bg-subtle'
              }`}
            >
              {v.label}
              <span className={`rounded-full px-1.5 text-xs ${on ? 'bg-white/20' : 'bg-bg-subtle'}`}>{count(v.id)}</span>
            </button>
          )
        })}
      </div>

      <div className="flex min-w-0 flex-col overflow-hidden rounded-lg border border-border-default bg-bg-surface">
        <div className="flex min-h-11 items-center gap-3 bg-bg-subtle px-[18px] text-xs font-semibold text-text-secondary md:grid md:grid-cols-[32px_260fr_300fr_200fr]">
          <label className="-m-2 flex size-11 cursor-pointer items-center justify-center">
            <input
              type="checkbox"
              checked={allOn}
              disabled={selectable.length === 0}
              onChange={toggleAll}
              className="size-5 accent-action-primary"
              aria-label="Tout sélectionner"
            />
          </label>
          <span className="md:hidden">Tout sélectionner</span>
          <span className="hidden md:block">Licencié</span>
          <span className="hidden md:block">Ce qui bloque</span>
          <span className="hidden md:block">Statut</span>
        </div>
        {rows.map((l) => {
          const on = selected.includes(l.name)
          const label = `${titlePrefix}${l.name}`
          return (
            <div
              key={l.name}
              className={`grid grid-cols-[32px_1fr] items-start gap-x-3 gap-y-1 border-t border-border-default px-[18px] py-3 md:min-h-16 md:grid-cols-[32px_260fr_300fr_200fr] md:items-center md:py-2 ${
                on ? 'bg-bg-subtle/70' : ''
              }`}
            >
              <div className="row-span-3 md:row-auto">
                {l.reason ? (
                  <label className="-m-2 flex size-11 cursor-pointer items-center justify-center">
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() => toggle(l.name)}
                      className="size-5 accent-action-primary"
                      aria-label={`Sélectionner ${l.name}`}
                    />
                  </label>
                ) : (
                  <span className="sr-only">Rien à relancer</span>
                )}
              </div>
              <div className="min-w-0">
                {l.to ? (
                  <Link to={to(l.to)} className="text-[13px] font-semibold underline-offset-2 hover:underline">
                    {label}
                  </Link>
                ) : (
                  <p className="text-[13px] font-semibold">{label}</p>
                )}
                <p className="text-xs text-text-secondary">{l.team}</p>
              </div>
              <p className="text-[13px] text-text-secondary">{l.detail}</p>
              <div className="flex flex-wrap gap-2">
                <Badge size="sm" tone={l.tone}>
                  {l.status}
                </Badge>
                {relanced.includes(l.name) && (
                  <Badge size="sm" tone="info">
                    Relancé à l’instant
                  </Badge>
                )}
              </div>
            </div>
          )
        })}
        {rows.length === 0 && <p className="px-[18px] py-6 text-[13px] text-text-secondary">Aucune licence dans cette vue : rien à relancer.</p>}
      </div>

      {selected.length > 0 && (
        <div className="sticky bottom-20 z-20 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-action-primary p-3 pl-5 text-text-inverse shadow-lg lg:bottom-6">
          <p className="text-sm font-semibold">
            {selected.length} sélectionnée{selected.length > 1 ? 's' : ''}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => setSelected([])} className="h-11 rounded-md px-3 text-sm font-semibold underline underline-offset-2 hover:bg-white/10">
              Désélectionner
            </button>
            <ButtonPrimary wide={false} requires="editLicences" onClick={relancer} className="border border-white/40 [&+span]:text-white/80">
              <Send className="mr-2 size-4" aria-hidden />
              Relancer
            </ButtonPrimary>
          </div>
        </div>
      )}
    </section>
  )
}
