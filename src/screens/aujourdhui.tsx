// Accueil — one page per role that absorbs « À traiter » (research report,
// "Un accueil par rôle"). Reads top to bottom: what needs YOU, then the week,
// then (bureau / trésorerie only) the club indicators.
// Based on Figma 24:31 "Desktop · Aujourd’hui" and 47:182 "Desktop · À traiter".
import { useState } from 'react'
import { RLink as Link } from '../components/RLink'
import { ArrowRight, CalendarDays, CheckCircle2 } from 'lucide-react'
import { AppLayout } from '../components/AppLayout'
import { Badge, ButtonPrimary, ButtonSecondary, Card, CardTitle, Metric, PageHeader, Row, RowText } from '../components/ui'
import { useFeedback } from '../components/feedback'
import { useRole, type Role } from '../roles'
import { TODOS, type Todo } from '../data/todos'
import { canOpen } from '../nav'
import { TeamDot, type TeamKey } from '../club'
import { to, type RouteKey } from '../routes'

type AgendaItem = { day: string; time: string; title: string; place: string; status: string; to?: RouteKey; roles?: Role[] }

const teamOf = (text: string): TeamKey => (['U9', 'U11', 'U13', 'U15', 'U18', 'Seniors'].find((k) => text.includes(k)) as TeamKey) ?? 'Club'

const AGENDA: AgendaItem[] = [
  { day: 'Sam. 14', time: '10:00', title: 'U11 · LLC vs Montélier', place: 'Gymnase des Berges', status: 'Prêt', to: 'weekEnd' },
  { day: 'Sam. 14', time: '18:30', title: 'U15 · LLC vs USV', place: 'Gymnase des Berges', status: '2 bloquants', to: 'matchPreparation' },
  {
    day: 'Sam. 14',
    time: '20:30',
    title: 'Seniors · LLC vs Romans',
    place: 'Gymnase des Berges',
    status: 'À confirmer',
    to: 'weekEnd',
    roles: ['president', 'secretaire', 'officiels', 'tresorier'],
  },
  {
    day: 'Dim. 15',
    time: '13:00',
    title: 'Tournoi U9',
    place: 'Salle Pierre-de-Coubertin',
    status: 'Prêt',
    to: 'weekEnd',
    roles: ['president', 'secretaire', 'officiels', 'benevole'],
  },
  { day: 'Mar. 17', time: '18:00', title: 'Entraînement U15', place: 'Gymnase des Berges', status: 'Prévu', to: 'calendrier', roles: ['entraineur', 'parent'] },
  {
    day: 'Mer. 18',
    time: '20:00',
    title: 'Réunion de bureau',
    place: 'Club-house',
    status: 'À planifier',
    to: 'reunions',
    roles: ['president', 'secretaire', 'tresorier'],
  },
]

const GREETING: Record<Role, string> = {
  president: 'Voici ce qui demande votre attention pour le club.',
  secretaire: 'Licences, convocations et préparation des matchs.',
  tresorier: 'Remboursements, paiements et rapprochements.',
  entraineur: 'Votre équipe U15 et le prochain match.',
  officiels: 'Tables de marque, délégués et arbitres club.',
  benevole: 'Vos prochains créneaux et ceux où le club a besoin d’aide.',
  parent: 'Ce que le club attend de vous pour Léa.',
}

function TodoRow({ t, onQuick, done, role }: { t: Todo; onQuick: (t: Todo, kind: 'confirm' | 'decline' | 'take') => void; done?: string; role: Role }) {
  if (done)
    return (
      <div className="flex items-center gap-3 border-b border-border-default py-3 text-sm">
        <CheckCircle2 className="size-5 shrink-0 text-success-fg" aria-hidden />
        <p className="font-semibold">{done}</p>
      </div>
    )
  return (
    <div className="flex flex-col gap-3 border-b border-border-default py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-col items-start gap-2 sm:flex-row sm:gap-3">
        <Badge tone={t.tone} className="mt-0.5">
          {t.status}
        </Badge>
        <RowText
          title={t.title}
          meta={
            <span className="flex flex-wrap items-center gap-x-3">
              <TeamDot team={teamOf(t.title + ' ' + t.meta)} />
              {t.meta}
            </span>
          }
        />
      </div>
      <div className="flex shrink-0 flex-wrap gap-2 pl-0 sm:pl-3">
        {t.quick ? (
          <>
            <ButtonPrimary wide={false} onClick={() => onQuick(t, t.quick!)}>
              {t.action}
            </ButtonPrimary>
            {t.quick === 'confirm' && (
              <ButtonSecondary wide={false} onClick={() => onQuick(t, 'decline')}>
                {role === 'parent' ? 'Léa sera absente' : 'Je ne peux pas'}
              </ButtonSecondary>
            )}
          </>
        ) : t.to ? (
          <Link to={to(t.to)} className="inline-flex h-11 items-center gap-1.5 rounded-md px-3 text-sm font-semibold hover:bg-bg-subtle">
            {t.action} <ArrowRight className="size-4" aria-hidden />
          </Link>
        ) : (
          <ButtonSecondary wide={false}>{t.action}</ButtonSecondary>
        )}
      </div>
    </div>
  )
}

export default function Aujourdhui() {
  const { role, me, can } = useRole()
  const { toast } = useFeedback()
  const [done, setDone] = useState<Record<string, string>>({})
  const todos = TODOS[role]
  const agenda = AGENDA.filter((a) => !a.roles || a.roles.includes(role))
  const showMetrics = role === 'president' || role === 'tresorier'
  const firstName = me.person.split(' ')[0]

  const onQuick = (t: Todo, kind: 'confirm' | 'decline' | 'take') => {
    const msg =
      kind === 'confirm'
        ? role === 'parent'
          ? 'Présence de Léa confirmée. Vous ne recevrez plus de relance.'
          : 'Créneau confirmé. Merci ! Plus de relance pour celui-ci.'
        : kind === 'take'
          ? 'Créneau réservé à votre nom. Merci !'
          : role === 'parent'
            ? 'Absence de Léa signalée à l’entraîneur.'
            : 'Désistement transmis : l’organisateur est prévenu pour trouver un remplaçant.'
    const label = kind === 'confirm' ? `Confirmé : ${t.title}` : kind === 'take' ? `Réservé : ${t.title}` : `Désisté : ${t.title}`
    setDone((d) => ({ ...d, [t.id]: label }))
    toast({
      message: msg,
      undo: () =>
        setDone((d) => {
          const n = { ...d }
          delete n[t.id]
          return n
        }),
    })
  }

  const open = todos.filter((t) => !done[t.id]).length

  return (
    <AppLayout>
      <PageHeader title={`Bonjour ${firstName}`} subtitle={`Samedi 14 septembre · ${GREETING[role]}`}>
        {can('matchPrep') && <ButtonPrimary to="matchPreparation">Préparer le match U15</ButtonPrimary>}
      </PageHeader>

      <Card>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <CardTitle title="À traiter pour vous" />
          <p className="text-[13px] text-text-secondary">{open === 0 ? 'Tout est à jour' : `${open} élément${open > 1 ? 's' : ''} · classés par urgence`}</p>
        </div>
        {open === 0 && Object.keys(done).length === todos.length ? (
          <p className="py-6 text-sm text-text-secondary">Rien à faire pour l’instant. Merci pour votre aide !</p>
        ) : null}
        <div>
          {todos.map((t) => (
            <TodoRow key={t.id} t={t} onQuick={onQuick} done={done[t.id]} role={role} />
          ))}
        </div>
      </Card>

      <div className={`grid grid-cols-1 items-start gap-6 ${showMetrics ? 'lg:grid-cols-[3fr_2fr]' : ''}`}>
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle title="Cette semaine" />
            <Link to={to('calendrier')} className="inline-flex items-center gap-1.5 text-[13px] font-semibold hover:underline">
              <CalendarDays className="size-4" aria-hidden /> Tout le calendrier
            </Link>
          </div>
          <div>
            {agenda.map((a) => (
              <Row key={a.title} to={a.to && canOpen(a.to, role, can) ? a.to : undefined} className="min-h-[56px]" right={<Badge size="sm">{a.status}</Badge>}>
                <div className="flex items-center gap-4">
                  <div className="w-14 shrink-0 text-xs">
                    <p className="font-semibold">{a.day}</p>
                    <p className="text-text-secondary">{a.time}</p>
                  </div>
                  <RowText
                    title={a.title}
                    meta={
                      <span className="flex flex-wrap items-center gap-x-3">
                        <TeamDot team={teamOf(a.title)} label={teamOf(a.title) === 'Club' ? 'Club' : teamOf(a.title)} />
                        {a.place}
                      </span>
                    }
                  />
                </div>
              </Row>
            ))}
          </div>
        </Card>

        {showMetrics && (
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {role === 'president' ? (
              <>
                <Metric label="Bénévoles confirmés" value="28 / 32" hint="4 réponses manquent" />
                <Metric label="Dossiers de licence" value="12" hint="5 bloqués par une pièce" />
                <Metric label="Dépenses à traiter" value="1 840 €" hint="7 demandes" />
                <Metric label="Messages sans réponse" value="9" hint="sur 3 équipes" />
              </>
            ) : (
              <>
                <Metric label="Solde disponible" value="42 680 €" hint="+ 6 240 € ce mois" />
                <Metric label="À encaisser" value="8 420 €" hint="31 cotisations" />
                <Metric label="À payer" value="3 180 €" hint="12 opérations" />
                <Metric label="Budget consommé" value="38 %" hint="sur 96 000 €" />
              </>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
