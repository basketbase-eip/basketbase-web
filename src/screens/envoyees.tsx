// Figma: 24:2547 "Desktop · Communications · Envoyées"
import { useState } from 'react'
import { RLink as Link } from '../components/RLink'
import { AppLayout } from '../components/AppLayout'
import { SubPageHeader } from '../components/communications/SubPageHeader'
import { Badge, Breadcrumb, ButtonPrimary, ButtonSecondary, Card, type Tone } from '../components/ui'
import { to, type RouteKey } from '../routes'

const cols = 'grid grid-cols-[330fr_230fr_150fr_170fr_160fr] items-center gap-4 p-4 min-h-[58px] text-[13px]'

const sent: { title: string; audience: string; channel: string; date: string; result: string; tone?: Tone; to?: RouteKey }[] = [
  { title: 'Changement horaire U15', audience: 'Joueurs + parents', channel: 'App + email', date: 'Aujourd’hui · 08:45', result: '92 % lus', to: 'comDetail' },
  { title: 'Appel bénévoles samedi', audience: 'Bénévoles', channel: 'App + SMS', date: 'Hier · 18:20', result: '7 réponses', tone: 'info' },
  { title: 'Relance licences', audience: '18 licenciés', channel: 'Email', date: '16 sept. · 09:10', result: '11 / 18 complétés', tone: 'warning' },
  { title: 'Compte rendu CA', audience: 'Bureau', channel: 'App', date: '14 sept. · 21:05', result: 'Tous lus' },
]

const tips = [
  'Programmer les rappels de match la veille entre 18 h et 20 h.',
  'Limiter chaque message à une seule action (« Confirmez votre présence »).',
  'Relancer uniquement les personnes qui n’ont pas encore répondu.',
]

function Cells({ s }: { s: (typeof sent)[number] }) {
  return (
    <>
      <span className="font-semibold">{s.title}</span>
      <span>{s.audience}</span>
      <span>{s.channel}</span>
      <span>{s.date}</span>
      <span>
        <Badge size="sm" tone={s.tone}>
          {s.result}
        </Badge>
      </span>
    </>
  )
}

export default function Envoyees() {
  const [showTips, setShowTips] = useState(false)
  return (
    <AppLayout>
      <Breadcrumb items={[{ label: 'Accueil', to: 'aujourdhui' }, { label: 'Communications', to: 'aEnvoyer' }, { label: 'Envoyées' }]} />

      <SubPageHeader title="Communications envoyées" subtitle="Retrouver ce qui a été transmis, à qui et avec quel résultat.">
        <ButtonPrimary to="aEnvoyer" requires="communicate">
          Nouvelle communication
        </ButtonPrimary>
      </SubPageHeader>

      <section className="overflow-x-auto rounded-lg border border-border-default bg-bg-surface lg:min-h-[410px]">
        <div className="min-w-[760px]" role="table">
          <div role="row" className={`${cols} border-b border-border-default bg-bg-subtle font-semibold text-text-secondary`}>
            <span role="columnheader">Communication</span>
            <span role="columnheader">Audience</span>
            <span role="columnheader">Canal</span>
            <span role="columnheader">Envoi</span>
            <span role="columnheader">Résultat</span>
          </div>
          {sent.map((s) =>
            s.to ? (
              <Link key={s.title} role="row" to={to(s.to)} className={`${cols} border-b border-border-default transition-colors hover:bg-bg-subtle/60`}>
                <Cells s={s} />
              </Link>
            ) : (
              <div key={s.title} role="row" className={`${cols} border-b border-border-default`}>
                <Cells s={s} />
              </div>
            ),
          )}
        </div>
      </section>

      <Card padding="p-5" className="lg:min-h-[150px]">
        <h2 className="text-base font-semibold">Améliorer l’impact</h2>
        <p className="text-[13px] text-text-secondary">
          Les rappels envoyés entre 18 h et 20 h obtiennent 23 % de réponses supplémentaires.
        </p>
        {showTips && (
          <ul className="flex flex-col gap-2 text-[13px]">
            {tips.map((t) => (
              <li key={t}>• {t}</li>
            ))}
          </ul>
        )}
        <div>
          <ButtonSecondary wide={false} onClick={() => setShowTips((v) => !v)}>
            {showTips ? 'Masquer les recommandations' : 'Voir les recommandations'}
          </ButtonSecondary>
        </div>
      </Card>
    </AppLayout>
  )
}
