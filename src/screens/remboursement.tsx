// Figma: 24:1887 "Desktop · Remboursement"
// Flow (research report, « Valider un remboursement »): the list stays visible and
// the selected request opens beside it. « Valider » / « Refuser avec motif » are
// reversible (toast + Annuler); « Marquer comme remboursé » is a separate step
// with a confirmation because money leaves the club. No full-page confirmation.
import { useRef, useState } from 'react'
import { Check, FileImage } from 'lucide-react'
import { AppLayout } from '../components/AppLayout'
import { Badge, Breadcrumb, ButtonPrimary, ButtonSecondary, Card, PageHeader, Row, type Tone } from '../components/ui'
import { useFeedback } from '../components/feedback'
import { LockedButton } from '../components/flows/LockedButton'
import { useRole } from '../roles'

type Status = 'Soumise' | 'Présidence' | 'Validée' | 'Refusée' | 'Remboursée'

type Request = {
  id: string
  who: string
  title: string
  amount: number
  status: Status
  details: [string, string][]
  file: string
  history: string[]
  motif?: string
}

/** Above this amount, the treasurer validates, then the president (club rule). */
const DOUBLE_VALIDATION = 300

const STATUS: Record<Status, { label: string; tone: Tone }> = {
  Soumise: { label: 'Soumise', tone: 'info' },
  Présidence: { label: 'Validée 1/2 · présidence', tone: 'info' },
  Validée: { label: 'Validée', tone: 'success' },
  Refusée: { label: 'Refusée', tone: 'danger' },
  Remboursée: { label: 'Remboursée', tone: 'success' },
}

const eur = (n: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n)

const initial: Request[] = [
  {
    id: 'RB-2026-043',
    who: 'Karim Haddad',
    title: 'Déplacement U15 à Vienne',
    amount: 86.4,
    status: 'Soumise',
    file: 'ticket-carburant-peage.jpg · 2 photos',
    details: [
      ['Fournisseur', 'Station Total + péage A7'],
      ['Catégorie', 'Déplacements'],
      ['Événement', 'Déplacement U15 à Vienne · 8 novembre'],
      ['Date de la dépense', '8 novembre 2026'],
      ['Moyen de paiement', 'Carte personnelle'],
    ],
    history: ['Demande soumise par Karim Haddad, 9 nov.', 'Justificatif ajouté, 9 nov.'],
  },
  {
    id: 'RB-2026-041',
    who: 'Julie Martin',
    title: 'Achat de boissons · tournoi U9',
    amount: 184.6,
    status: 'Soumise',
    file: 'facture-boissons-1409.pdf · 1 page',
    details: [
      ['Fournisseur', 'Cash & Carry Valence'],
      ['Catégorie', 'Buvette · achats'],
      ['Événement', 'Tournoi U9 · 14 septembre'],
      ['Date de la dépense', '13 septembre 2026'],
      ['Moyen de paiement', 'Carte personnelle'],
    ],
    history: ['Demande créée par Julie Martin, 14 sept.', 'Justificatif ajouté, 15 sept.'],
  },
  {
    id: 'RB-2026-044',
    who: 'Lucas Morel',
    title: 'Ballons et chasubles U15',
    amount: 412,
    status: 'Soumise',
    file: 'facture-materiel-u15.pdf · 1 page',
    details: [
      ['Fournisseur', 'Sport 2000 Valence'],
      ['Catégorie', 'Matériel sportif'],
      ['Événement', 'Saison 2026-2027 · U15 M'],
      ['Date de la dépense', '5 novembre 2026'],
      ['Moyen de paiement', 'Carte personnelle'],
    ],
    history: ['Demande soumise par Lucas Morel, 6 nov.', 'Justificatif ajouté, 6 nov.'],
  },
  {
    id: 'RB-2026-039',
    who: 'Sophie Durand',
    title: 'Goûter plateau U11',
    amount: 52,
    status: 'Validée',
    file: 'ticket-supermarche.jpg · 1 photo',
    details: [
      ['Fournisseur', 'Intermarché Bourg-lès-Valence'],
      ['Catégorie', 'Buvette · achats'],
      ['Événement', 'Plateau U11 · 7 novembre'],
      ['Date de la dépense', '7 novembre 2026'],
      ['Moyen de paiement', 'Carte personnelle'],
    ],
    history: ['Demande soumise par Sophie Durand, 7 nov.', 'Validé par Martine Leroy, hier'],
  },
  {
    id: 'RB-2026-036',
    who: 'Nicolas Perrin',
    title: 'Formation e-Marque · repas',
    amount: 38.5,
    status: 'Remboursée',
    file: 'note-restaurant.jpg · 1 photo',
    details: [
      ['Fournisseur', 'Brasserie du Parc'],
      ['Catégorie', 'Formation'],
      ['Événement', 'Formation OTM · 18 octobre'],
      ['Date de la dépense', '18 octobre 2026'],
      ['Moyen de paiement', 'Carte personnelle'],
    ],
    history: ['Demande soumise, 19 oct.', 'Validé par Martine Leroy, 21 oct.', 'Remboursé par virement, 24 oct.'],
  },
]

const checks = ['Justificatif lisible', 'Montant identique au justificatif', 'Budget disponible', 'Aucun doublon détecté', 'Coordonnées bancaires vérifiées']

export default function Remboursement() {
  const { me, role } = useRole()
  const { toast, confirm } = useFeedback()
  const [requests, setRequests] = useState(initial)
  const [selectedId, setSelectedId] = useState(initial[0].id)
  const [refusing, setRefusing] = useState(false)
  const [motif, setMotif] = useState('')
  const detailRef = useRef<HTMLDivElement>(null)

  const r = requests.find((x) => x.id === selectedId)!
  const big = r.amount > DOUBLE_VALIDATION
  const toTreat = requests.filter((x) => x.status === 'Soumise' || x.status === 'Présidence').length

  /** Applies a change to one request and offers « Annuler » restoring it. */
  const change = (id: string, patch: Partial<Request>, historyLine: string, message: string, undoable = true) => {
    const before = requests.find((x) => x.id === id)!
    setRequests((list) => list.map((x) => (x.id === id ? { ...x, ...patch, history: [...x.history, historyLine] } : x)))
    toast({ message, undo: undoable ? () => setRequests((list) => list.map((x) => (x.id === id ? before : x))) : undefined })
  }

  const select = (id: string) => {
    setSelectedId(id)
    setRefusing(false)
    setMotif('')
    if (window.innerWidth < 1024) setTimeout(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0)
  }

  const validate = () => {
    if (big)
      change(
        r.id,
        { status: 'Présidence' },
        `Validé par ${me.person} (trésorerie), à l’instant`,
        `Première validation enregistrée pour ${eur(r.amount)}. La présidence doit valider à son tour.`,
      )
    else change(r.id, { status: 'Validée' }, `Validé par ${me.person}, à l’instant`, `Remboursement de ${eur(r.amount)} validé. ${r.who} est prévenu·e.`)
  }

  const validatePresident = () =>
    change(r.id, { status: 'Validée' }, `Validé par ${me.person} (présidence), à l’instant`, `Seconde validation enregistrée. Le remboursement de ${eur(r.amount)} est validé.`)

  const refuse = () => {
    if (!motif.trim()) {
      toast({ tone: 'info', message: 'Indiquez un motif : il sera transmis à la personne.' })
      return
    }
    change(r.id, { status: 'Refusée', motif: motif.trim() }, `Refusé par ${me.person}, à l’instant`, `Demande refusée. ${r.who} reçoit le motif.`)
    setRefusing(false)
    setMotif('')
  }

  const markPaid = () =>
    confirm({
      title: `Marquer ${eur(r.amount)} comme versés à ${r.who} ?`,
      body: (
        <p>
          Faites d’abord le virement depuis le compte du club. Cette étape clôt la demande, l’inscrit dans les transactions et prévient {r.who}.
        </p>
      ),
      confirmLabel: 'Marquer comme remboursé',
      cancelLabel: 'Annuler',
      onConfirm: () =>
        change(r.id, { status: 'Remboursée' }, `Marqué comme remboursé par ${me.person}, à l’instant`, `${eur(r.amount)} marqués comme versés à ${r.who}.`, false),
    })

  const track: Status[] = big ? ['Soumise', 'Présidence', 'Validée', 'Remboursée'] : ['Soumise', 'Validée', 'Remboursée']
  const reached = r.status === 'Refusée' ? 0 : track.indexOf(r.status)

  return (
    <AppLayout>
      <Breadcrumb items={[{ label: 'Accueil', to: 'aujourdhui' }, { label: 'Finances', to: 'finances' }, { label: 'Remboursements' }]} />

      <PageHeader title="Remboursements" subtitle={`${toTreat} demande${toTreat > 1 ? 's' : ''} à traiter · ouvrez une demande pour la traiter sans quitter la liste`}>
        <ButtonSecondary>Exporter</ButtonSecondary>
      </PageHeader>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[360px_1fr]">
        <Card padding="p-0" className="gap-0 overflow-hidden">
          <h2 className="px-[18px] pt-4 pb-2 text-base font-bold">Demandes</h2>
          <ul>
            {requests.map((x) => {
              const on = x.id === selectedId
              return (
                <li key={x.id}>
                  <button
                    type="button"
                    aria-current={on ? 'true' : undefined}
                    onClick={() => select(x.id)}
                    className={`flex w-full items-center justify-between gap-3 border-t border-border-default px-[18px] py-3 text-left transition-colors ${
                      on ? 'bg-bg-subtle shadow-[inset_3px_0_0_var(--color-action-primary)]' : 'hover:bg-bg-subtle/60'
                    }`}
                  >
                    <span className="flex min-w-0 flex-col gap-[3px]">
                      <span className="text-[13px] font-semibold">
                        {x.who} · {eur(x.amount)}
                      </span>
                      <span className="truncate text-xs text-text-secondary">{x.title}</span>
                    </span>
                    <Badge size="sm" tone={STATUS[x.status].tone}>
                      {x.status === 'Présidence' ? 'Validée 1/2' : STATUS[x.status].label}
                    </Badge>
                  </button>
                </li>
              )
            })}
          </ul>
        </Card>

        <div ref={detailRef} className="flex min-w-0 scroll-mt-20 flex-col gap-6">
          <Card padding="p-5 sm:p-[22px]">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-text-secondary">{r.id}</p>
                <h2 className="text-xl font-bold">{r.title}</h2>
                <p className="text-[13px] text-text-secondary">Demande de {r.who}</p>
              </div>
              <Badge tone={STATUS[r.status].tone}>{STATUS[r.status].label}</Badge>
            </div>
            <p className="text-[28px] font-bold">{eur(r.amount)}</p>

            {big && (
              <p className="rounded-md bg-info-bg p-3 text-xs font-semibold text-info-fg">
                Double validation : trésorerie puis présidence (au-delà de {eur(DOUBLE_VALIDATION)}).
              </p>
            )}

            <ol className="flex flex-wrap gap-2 text-xs" aria-label="Étapes de la demande">
              {track.map((s, i) => (
                <li
                  key={s}
                  className={`inline-flex h-8 items-center gap-1.5 rounded-full border px-3 font-semibold ${
                    r.status !== 'Refusée' && i <= reached ? 'border-action-primary bg-action-primary text-text-inverse' : 'border-border-default text-text-secondary'
                  }`}
                >
                  {r.status !== 'Refusée' && i <= reached && <Check className="size-3.5" aria-hidden />}
                  {s}
                </li>
              ))}
            </ol>

            {r.status === 'Refusée' && r.motif && (
              <p className="rounded-md bg-danger-bg p-3 text-xs text-danger-fg">
                <span className="font-semibold">Motif transmis à {r.who} :</span> {r.motif}
              </p>
            )}

            {/* Actions for the current step */}
            {r.status === 'Soumise' && !refusing && (
              <div className="flex flex-wrap items-start gap-3">
                <ButtonPrimary requires="validateExpense" onClick={validate}>
                  Valider
                </ButtonPrimary>
                <ButtonSecondary requires="validateExpense" onClick={() => setRefusing(true)}>
                  Refuser avec motif
                </ButtonSecondary>
              </div>
            )}
            {r.status === 'Soumise' && refusing && (
              <div className="flex flex-col gap-3 rounded-md bg-bg-subtle p-3">
                <label className="flex flex-col gap-1.5 text-xs font-semibold">
                  Motif du refus (transmis à {r.who})
                  <textarea
                    autoFocus
                    rows={3}
                    value={motif}
                    onChange={(e) => setMotif(e.target.value)}
                    placeholder="Par exemple : le justificatif ne mentionne pas le péage. Pouvez-vous ajouter le ticket ?"
                    className="rounded-md border border-border-default bg-bg-surface p-2.5 text-[13px] font-normal"
                  />
                </label>
                <div className="flex flex-wrap gap-3">
                  <ButtonPrimary wide={false} onClick={refuse}>
                    Refuser la demande
                  </ButtonPrimary>
                  <ButtonSecondary
                    wide={false}
                    onClick={() => {
                      setRefusing(false)
                      setMotif('')
                    }}
                  >
                    Annuler
                  </ButtonSecondary>
                </div>
              </div>
            )}
            {r.status === 'Présidence' && (
              <div className="flex flex-wrap items-start gap-3">
                {role === 'president' ? (
                  <ButtonPrimary onClick={validatePresident}>Valider (présidence)</ButtonPrimary>
                ) : (
                  <LockedButton reason="Au-delà de 300 €, la présidence donne la seconde validation.">Valider (présidence)</LockedButton>
                )}
              </div>
            )}
            {r.status === 'Validée' && (
              <div className="flex flex-wrap items-start gap-3">
                <ButtonPrimary requires="validateExpense" onClick={markPaid}>
                  Marquer comme remboursé
                </ButtonPrimary>
              </div>
            )}
            {r.status === 'Remboursée' && <p className="text-xs text-text-secondary">Demande close. Le versement figure dans les transactions.</p>}
          </Card>

          <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
            <Card padding="p-5 sm:p-[22px]">
              <h3 className="text-base font-bold">Justificatif</h3>
              <div className="flex h-[200px] w-full items-center justify-center rounded-md border border-border-default bg-bg-subtle" aria-label="Aperçu du justificatif">
                <FileImage className="size-10 text-text-secondary" aria-hidden />
              </div>
              <p className="text-xs text-text-secondary">{r.file}</p>
              <div>
                <ButtonSecondary>Ouvrir le justificatif</ButtonSecondary>
              </div>
            </Card>

            <Card padding="p-5 sm:p-[22px]">
              <h3 className="text-base font-bold">Détails de la dépense</h3>
              <div className="flex flex-col">
                {r.details.map(([k, v]) => (
                  <Row key={k} right={<p className="text-right text-xs font-semibold">{v}</p>}>
                    <p className="text-xs text-text-secondary">{k}</p>
                  </Row>
                ))}
              </div>
              <h3 className="pt-2 text-sm font-bold">Contrôles automatiques</h3>
              <ul className="flex flex-col gap-1.5 text-xs">
                {checks.map((c) => (
                  <li key={c} className="inline-flex items-center gap-1.5">
                    <Check className="size-3.5 text-success-fg" strokeWidth={2.5} aria-hidden />
                    {c}
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <Card padding="p-[18px]">
            <h3 className="text-base font-bold">Historique</h3>
            <ul className="flex flex-col gap-1.5 text-xs text-text-secondary">
              {r.history.map((a, i) => (
                <li key={i} className={a.endsWith('à l’instant') ? 'font-semibold text-text-primary' : ''}>
                  {a}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
