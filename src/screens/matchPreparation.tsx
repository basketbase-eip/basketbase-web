// New screen (report, « Préparer un match à domicile »): default tab of the match.
// Global ready / not-ready banner + readiness checklist grouped by severity.
import { useState, type ReactNode } from 'react'
import { Check, Eye, EyeOff, KeyRound, Lock, Mail } from 'lucide-react'
import { MatchFrame } from '../components/match/MatchPage'
import { ChecklistSection, CheckLine, ReadinessBanner, SEVERITY, type Severity } from '../components/match/Readiness'
import { Badge, ButtonPrimary, ButtonSecondary, Card, type Tone } from '../components/ui'
import { useFeedback } from '../components/feedback'
import { useRole } from '../roles'

/* ------------------------------- Data ------------------------------- */

const ELIGIBLE_DELEGATES = [
  { name: 'Patrick Morel', meta: 'Majeur · licence validée · disponible samedi · aucun match ce mois' },
  { name: 'Sandrine Faure', meta: 'Majeure · licence validée · disponible samedi · 1 match ce mois' },
  { name: 'Thierry Garnier', meta: 'Majeur · licence validée · disponible dès 17:00 · 2 matchs ce mois' },
]

const EMARQUE_STEPS = [
  { label: 'Ordinateur prévu', meta: 'Portable du club, chargé · apporté par Romain Petit' },
  { label: 'Code transmis à la table', meta: 'À remettre au marqueur avant le match' },
  { label: 'Rencontre téléchargée', meta: 'Dans e-Marque V2, la veille ou le matin du match' },
  { label: 'Feuille prête à H-40 min', meta: 'Samedi à 17:50 au plus tard' },
]

const EMARQUE_CODE = '7Q4M-2KXD'
const NO_PERM = 'Lecture seule : votre rôle ne permet pas de modifier la préparation du match.'

type Line = {
  id: string
  severity: Severity
  status: string
  tone?: Tone
  what: string
  who: ReactNode
  detail?: ReactNode
  actions?: ReactNode
  extra?: ReactNode
}

/* ------------------------------ Screen ------------------------------ */

export default function MatchPreparation() {
  const { role, can } = useRole()
  const { toast } = useFeedback()
  const canPrep = can('matchPrep')
  const canAssign = can('volunteersAll')
  const seesCode = role === 'officiels' || role === 'secretaire' || role === 'president'

  const [delegate, setDelegate] = useState<string | null>(null)
  const [picking, setPicking] = useState(false)
  const [treasuryWarned, setTreasuryWarned] = useState(false)
  const [steps, setSteps] = useState([true, false, false, false])
  const [showCode, setShowCode] = useState(false)

  const chooseDelegate = (name: string) => {
    const previous = delegate
    setDelegate(name)
    setPicking(false)
    toast({ message: `Délégué de club pour samedi : ${name}.`, undo: () => setDelegate(previous) })
  }

  const toggleStep = (i: number) => {
    const before = steps
    const next = steps.map((v, j) => (j === i ? !v : v))
    setSteps(next)
    toast({
      message: `${EMARQUE_STEPS[i].label} : ${next[i] ? 'fait' : 'à refaire'}.`,
      undo: () => setSteps(before),
    })
  }

  const warnTreasury = () => {
    setTreasuryWarned(true)
    toast({ message: 'La trésorerie est prévenue du solde qui bloque la licence de Sébastien Roux.', undo: () => setTreasuryWarned(false) })
  }

  const stepsDone = steps.filter(Boolean).length
  const emarqueReady = stepsDone === EMARQUE_STEPS.length

  const lines: Line[] = [
    /* Délégué de club */
    delegate
      ? {
          id: 'delegue',
          severity: 'pret',
          status: 'Désigné',
          what: 'Délégué de club',
          who: delegate,
          detail: 'Majeur · licence validée · présent à 17:30 (H-1).',
          actions: (
            <ButtonSecondary wide={false} requires="volunteersAll" onClick={() => setPicking((p) => !p)}>
              Changer
            </ButtonSecondary>
          ),
        }
      : {
          id: 'delegue',
          severity: 'bloquant',
          status: 'Non désigné',
          tone: 'danger',
          what: 'Délégué de club',
          who: <span className="text-text-secondary">Personne pour l’instant</span>,
          detail: (
            <>
              Obligatoire pour un match à domicile : désigné, majeur, licence validée, présent à 17:30 (H-1).
              {!canAssign && <> Le délégué est désigné par le bureau ou le responsable des officiels.</>}
            </>
          ),
          actions: (
            <ButtonPrimary wide={false} requires="volunteersAll" onClick={() => setPicking((p) => !p)} className="w-full sm:w-auto">
              {picking ? 'Fermer la liste' : 'Désigner'}
            </ButtonPrimary>
          ),
        },

    /* Table de marque */
    {
      id: 'marqueur',
      severity: 'pret',
      status: 'Confirmé',
      what: 'Table de marque · marqueur',
      who: 'Marc Lopez',
      detail: 'Licence validée · e-learning OTM à jour · opérateur 24 secondes non requis en U15.',
      actions: (
        <ButtonSecondary wide={false} to="matchBenevoles">
          Voir la table
        </ButtonSecondary>
      ),
    },
    {
      id: 'chrono',
      severity: 'bloquant',
      status: 'Licence bloquée',
      tone: 'danger',
      what: 'Table de marque · chronométreur',
      who: 'Sébastien Roux',
      detail: (
        <>
          <span className="font-semibold text-danger-fg">Licence bloquée : solde impayé de 40 €.</span> Il ne peut pas tenir la table tant que
          sa licence n’est pas validée.
        </>
      ),
      actions: (
        <>
          <ButtonPrimary wide={false} to="remplacement" className="w-full sm:w-auto">
            Trouver un remplaçant
          </ButtonPrimary>
          {role === 'tresorier' ? (
            <ButtonSecondary wide={false} to="transactions" className="w-full sm:w-auto">
              Voir dans Finances
            </ButtonSecondary>
          ) : treasuryWarned ? (
            <Badge tone="info">Trésorerie prévenue</Badge>
          ) : (
            <ButtonSecondary wide={false} requires="matchPrep" onClick={warnTreasury} className="w-full sm:w-auto">
              Prévenir la trésorerie
            </ButtonSecondary>
          )}
        </>
      ),
    },

    /* Arbitres */
    {
      id: 'arbitres',
      severity: 'pret',
      status: 'Confirmés',
      what: 'Arbitres club',
      who: 'Yanis Benali et Clara Petit',
      detail: 'Confirmés jeudi · arrivée prévue à 17:45.',
      actions: (
        <ButtonSecondary wide={false} to="matchBenevoles">
          Voir les officiels
        </ButtonSecondary>
      ),
    },

    /* e-Marque V2 */
    {
      id: 'emarque',
      severity: emarqueReady ? 'pret' : 'verifier',
      status: emarqueReady ? 'Prête' : `${stepsDone} / ${EMARQUE_STEPS.length} étapes`,
      tone: emarqueReady ? 'success' : 'warning',
      what: 'e-Marque V2',
      who: 'Romain Petit (responsable des officiels) · Marc Lopez à la table',
      detail: emarqueReady ? 'Feuille de match électronique prête.' : `${EMARQUE_STEPS.length - stepsDone} ${EMARQUE_STEPS.length - stepsDone > 1 ? 'étapes' : 'étape'} à faire avant samedi 17:50.`,
      extra: (
        <div className="mt-2 flex flex-col gap-3">
          <ul className="flex flex-col gap-1.5" aria-label="Étapes e-Marque">
            {EMARQUE_STEPS.map((s, i) => (
              <li key={s.label}>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={steps[i]}
                  disabled={!canPrep}
                  onClick={() => toggleStep(i)}
                  className={`flex min-h-11 w-full items-center gap-3 rounded-md border border-border-default px-3 py-2 text-left transition-colors ${
                    canPrep ? 'hover:bg-bg-subtle' : 'cursor-not-allowed opacity-70'
                  }`}
                >
                  <span
                    aria-hidden
                    className={`flex size-5 shrink-0 items-center justify-center rounded-md border ${
                      steps[i] ? 'border-success-fg bg-success-fg text-text-inverse' : 'border-text-secondary bg-bg-surface'
                    }`}
                  >
                    {steps[i] && <Check className="size-3.5" strokeWidth={3} />}
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className={`text-[13px] font-semibold ${steps[i] ? 'text-text-secondary line-through' : ''}`}>{s.label}</span>
                    <span className="text-xs text-text-secondary">{s.meta}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          {!canPrep && (
            <p className="flex items-center gap-1.5 text-xs text-text-secondary">
              <Lock className="size-3" aria-hidden /> {NO_PERM}
            </p>
          )}

          {/* Code: restricted to the table team (prototype: officiels, secrétariat, présidence) */}
          <div className="flex flex-col gap-2 rounded-md bg-bg-subtle px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
            {seesCode ? (
              <>
                <p className="flex flex-wrap items-center gap-2 text-[13px]">
                  <KeyRound className="size-4 shrink-0" aria-hidden />
                  <span className="font-semibold">Code de la rencontre :</span>
                  <span className="font-mono tracking-wider">{showCode ? EMARQUE_CODE : '••••-••••'}</span>
                </p>
                <button
                  type="button"
                  onClick={() => setShowCode((v) => !v)}
                  className="inline-flex h-11 items-center gap-2 self-start rounded-md border border-border-default bg-bg-surface px-3 text-[13px] font-semibold hover:bg-bg-subtle sm:self-auto"
                >
                  {showCode ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
                  {showCode ? 'Masquer le code' : 'Afficher le code'}
                </button>
              </>
            ) : (
              <p className="flex items-center gap-2 text-[13px] text-text-secondary">
                <Lock className="size-4 shrink-0" aria-hidden />
                Code visible uniquement par l’équipe de table le jour du match.
              </p>
            )}
          </div>

          <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-text-secondary">
            <Mail className="size-3.5 shrink-0" aria-hidden />
            Assistance e-Marque V2 :
            <a href="mailto:assistanceemarquev2@ffbb.com" className="inline-flex min-h-11 items-center font-semibold break-all text-text-primary underline underline-offset-2">
              assistanceemarquev2@ffbb.com
            </a>
            (ouvert le week-end)
          </p>
        </div>
      ),
    },

    /* Salle */
    {
      id: 'salle',
      severity: 'pret',
      status: 'Réservée',
      tone: 'success',
      what: 'Salle et clés',
      who: 'Julie Bernard (ouverture) · Romain Petit (fermeture)',
      detail: 'Gymnase des Berges réservé de 17:30 à 21:00 : H-1, match et rangement compris.',
      actions: (
        <ButtonSecondary wide={false} to="matchVue">
          Voir le déroulé
        </ButtonSecondary>
      ),
    },

    /* Buvette */
    {
      id: 'buvette',
      severity: 'verifier',
      status: 'À compléter',
      what: 'Buvette',
      who: 'Julie Bernard (responsable) · Sophie Martin · Marc Leroy',
      detail: '1 personne manque sur le créneau 20:00–21:00.',
      actions: (
        <ButtonSecondary wide={false} to="remplacement" className="w-full sm:w-auto">
          Trouver un bénévole
        </ButtonSecondary>
      ),
    },

    /* Fair-play */
    {
      id: 'fairplay',
      severity: 'pret',
      status: 'Désignée',
      tone: 'success',
      what: 'Référent fair-play (U18 et moins)',
      who: 'Nathalie Garnier',
      detail: 'Obligatoire pour les catégories U18 et moins · confirmée.',
      actions: (
        <ButtonSecondary wide={false} to="matchBenevoles">
          Voir les bénévoles
        </ButtonSecondary>
      ),
    },

    /* Joueurs */
    {
      id: 'joueurs',
      severity: 'verifier',
      status: 'À vérifier',
      what: 'Joueurs convoqués',
      who: 'Julien Roche (entraîneur) · 10 convoqués',
      detail: (
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-1.5">
            <Badge size="sm" tone="success">
              6 confirmés
            </Badge>
            <Badge size="sm" tone="warning">
              3 sans réponse
            </Badge>
            <Badge size="sm" tone="danger">
              1 licence non validée
            </Badge>
          </div>
          <span>Hugo Lopez : questionnaire de santé manquant. Il ne pourra pas être inscrit sur la feuille de match sans licence validée.</span>
        </div>
      ),
      actions: (
        <ButtonSecondary wide={false} to="matchEquipe" className="w-full sm:w-auto">
          Voir l’équipe
        </ButtonSecondary>
      ),
    },
  ]

  const bySeverity = (s: Severity) => lines.filter((l) => l.severity === s)
  const blocking = bySeverity('bloquant').length
  const toCheck = bySeverity('verifier').length
  const ready = bySeverity('pret').length

  const eligible = ELIGIBLE_DELEGATES.filter((p) => p.name !== delegate)
  const picker = (
    <div className="mt-2 flex flex-col gap-2 rounded-lg border border-border-default bg-bg-subtle/60 p-3" role="group" aria-label="Personnes éligibles">
      <p className="text-xs font-semibold">{eligible.length} personnes éligibles : majeures, licence validée, disponibles samedi</p>
      <ul className="flex flex-col gap-2">
        {eligible.map((p) => (
          <li key={p.name} className="flex flex-col gap-2 rounded-md border border-border-default bg-bg-surface px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 flex-col gap-0.5">
              <p className="text-[13px] font-semibold">{p.name}</p>
              <p className="text-xs text-text-secondary">{p.meta}</p>
            </div>
            <ButtonSecondary wide={false} onClick={() => chooseDelegate(p.name)} className="w-full sm:w-auto">
              Choisir
            </ButtonSecondary>
          </li>
        ))}
      </ul>
    </div>
  )

  const renderLine = (l: Line) => (
    <CheckLine key={l.id} status={l.status} tone={l.tone ?? SEVERITY[l.severity].tone} what={l.what} who={l.who} detail={l.detail} actions={l.actions}>
      {l.extra}
      {l.id === 'delegue' && picking && canAssign && picker}
    </CheckLine>
  )

  return (
    <MatchFrame tab="matchPreparation">
      <ReadinessBanner blocking={blocking} toCheck={toCheck} ready={ready} total={lines.length}>
        {!canPrep && (
          <p className="flex items-center gap-1.5 text-xs text-text-secondary">
            <Lock className="size-3.5 shrink-0" aria-hidden />
            Vous consultez la préparation en lecture seule.
          </p>
        )}
      </ReadinessBanner>

      <ChecklistSection severity="bloquant" count={blocking} empty="Aucun point bloquant.">
        {bySeverity('bloquant').map(renderLine)}
      </ChecklistSection>
      <ChecklistSection severity="verifier" count={toCheck} empty="Rien à vérifier.">
        {bySeverity('verifier').map(renderLine)}
      </ChecklistSection>
      <ChecklistSection severity="pret" count={ready}>
        {bySeverity('pret').map(renderLine)}
      </ChecklistSection>

      <Card padding="p-5 sm:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 flex-col gap-1.5">
            <Badge tone="info" className="self-start">Après le match</Badge>
            <h2 className="text-base font-bold">Rapport d’incident : à transmettre sous 72 h</h2>
            <p className="text-xs text-text-secondary">En cas d’incident samedi, le délégué de club transmet son rapport avant mardi 17 septembre, 18:30.</p>
          </div>
          <ButtonSecondary to="evRessources" wide={false} className="w-full sm:w-auto">
            Voir les ressources
          </ButtonSecondary>
        </div>
      </Card>
    </MatchFrame>
  )
}
