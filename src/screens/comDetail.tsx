// Figma: 24:2924 "Desktop · Communication · Détail"
import { useState } from 'react'
import { AppLayout } from '../components/AppLayout'
import { SubPageHeader } from '../components/communications/SubPageHeader'
import { Badge, Breadcrumb, ButtonPrimary, ButtonSecondary, Card } from '../components/ui'
import { useFeedback } from '../components/feedback'

const noAnswer = ['Famille Girard (Tom)', 'Famille Moreau (Inès)', 'Famille Diallo (Yanis)']

const answers = [
  { who: 'Famille Roche (Emma)', status: 'Confirmé' },
  { who: 'Famille Martin (Nina)', status: 'Confirmé' },
  { who: 'Famille Bernard (Sarah)', status: 'Confirmé' },
  ...noAnswer.map((who) => ({ who, status: 'Sans réponse' })),
]

export default function ComDetail() {
  const { toast, confirm } = useFeedback()
  const [showAnswers, setShowAnswers] = useState(false)
  const [relanced, setRelanced] = useState(false)

  const relancer = () =>
    confirm({
      title: `Relancer ${noAnswer.length} destinataires sans réponse ?`,
      body: (
        <div className="flex flex-col gap-2">
          <p>Seules les personnes qui n’ont pas encore répondu reçoivent la relance, par leur canal habituel :</p>
          <ul className="list-disc pl-5 text-xs">
            {noAnswer.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </div>
      ),
      confirmLabel: `Envoyer ${noAnswer.length} relances`,
      cancelLabel: 'Ne pas relancer',
      onConfirm: () => {
        setRelanced(true)
        toast({ message: `${noAnswer.length} relances envoyées · 0 échec` })
      },
    })

  return (
    <AppLayout>
      <Breadcrumb
        items={[{ label: 'Accueil', to: 'aujourdhui' }, { label: 'Communications', to: 'aEnvoyer' }, { label: 'Changement horaire U15' }]}
      />

      <SubPageHeader title="Changement horaire U15" subtitle="Détail, audience, rendu et performance de l’envoi.">
        <ButtonSecondary>Dupliquer</ButtonSecondary>
      </SubPageHeader>

      <Card padding="p-5" className="rounded-lg lg:min-h-[148px]">
        <div className="flex flex-wrap items-center gap-3">
          <Badge>Envoyée</Badge>
          <p className="text-xs font-semibold text-text-secondary">Aujourd’hui à 08:45</p>
        </div>
        <p className="text-xl font-semibold">Match U15 déplacé à 18 h 30</p>
        <p className="text-[13px] text-text-secondary">Audience · 18 joueurs, 31 parents, 2 coachs · App + e-mail</p>
      </Card>

      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[744fr_368fr]">
        <Card padding="p-5" className="items-start rounded-lg lg:min-h-[430px]">
          <h2 className="text-base font-semibold">Aperçu du message</h2>
          <p className="text-[13px]">Bonjour {'{prénom}'},</p>
          <p className="text-[13px]">
            Le match U15 de samedi débutera à 18 h 30. Rendez-vous au gymnase à 17 h 45. Merci de confirmer votre présence avant vendredi.
          </p>
          <ButtonSecondary wide={false} className="min-w-[166px]" onClick={() => setShowAnswers((s) => !s)}>
            {showAnswers ? 'Masquer les réponses' : 'Voir les réponses'}
          </ButtonSecondary>
          {showAnswers && (
            <ul className="w-full">
              {answers.map((a) => (
                <li key={a.who} className="flex min-h-11 items-center justify-between gap-3 border-b border-border-default text-[13px] last:border-b-0">
                  {a.who}
                  <Badge size="sm" tone={a.status === 'Sans réponse' && relanced ? 'info' : undefined}>
                    {a.status === 'Sans réponse' && relanced ? 'Relancé à l’instant' : a.status}
                  </Badge>
                </li>
              ))}
              <li className="pt-2 text-xs text-text-secondary">… et 38 autres confirmations.</li>
            </ul>
          )}
        </Card>

        <Card padding="p-5" className="items-start rounded-lg lg:min-h-[430px]">
          <h2 className="text-base font-semibold">Performance</h2>
          <p className="text-[30px] font-semibold">92 %</p>
          <p className="text-xs text-text-secondary">messages lus</p>
          <p className="text-xl font-semibold">41 confirmations</p>
          {relanced ? (
            <Badge tone="info">3 relancés à l’instant</Badge>
          ) : (
            <Badge tone="warning">{`${noAnswer.length} sans réponse`}</Badge>
          )}
          {!relanced ? (
            <ButtonPrimary requires="communicate" onClick={relancer}>
              Relancer les non-répondants
            </ButtonPrimary>
          ) : (
            <p className="text-xs text-text-secondary">Une réponse arrête les relances pour la personne concernée.</p>
          )}
        </Card>
      </div>
    </AppLayout>
  )
}
