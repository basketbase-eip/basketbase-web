// Figma: 24:1299 "Desktop · Détail dossier"
import { useState } from 'react'
import { AppLayout } from '../components/AppLayout'
import { Badge, Breadcrumb, ButtonPrimary, ButtonSecondary, Card, PageHeader, Row, type Tone } from '../components/ui'
import { useFeedback } from '../components/feedback'

/** State of the missing medical certificate, which drives the whole file. */
type Cert = 'manquant' | 'demande' | 'exception'
const CERT: Record<Cert, { label: string; tone: Tone }> = {
  manquant: { label: 'Manquant', tone: 'danger' },
  demande: { label: 'Demandé', tone: 'warning' },
  exception: { label: 'Exception accordée', tone: 'warning' },
}

const STEPS = ['Créé', 'Informations reçues', 'Pièces contrôlées', 'Validé', 'Archivé']

const infos = [
  { label: 'RESPONSABLE', value: 'Sophie Martin' },
  { label: 'ÉQUIPE', value: 'U15' },
  { label: 'CRÉÉ', value: '3 septembre' },
  { label: 'DERNIÈRE ACTION', value: 'Hier · 16:42' },
  { label: 'VISIBILITÉ', value: 'Secrétariat' },
]

const initialJournal = [
  'Hier · Sophie a contrôlé les pièces',
  '12 sept. · Cotisation rapprochée',
  '8 sept. · Relance envoyée',
  '3 sept. · Dossier créé',
]

export default function DossierDetail() {
  const { toast, confirm } = useFeedback()
  const [cert, setCert] = useState<Cert>('manquant')
  const [validated, setValidated] = useState(false)
  const [journal, setJournal] = useState(initialJournal)
  const [flash, setFlash] = useState(false)
  const showHistory = () => {
    document.getElementById('historique-dossier')?.scrollIntoView({ behavior: 'smooth' })
    setFlash(true)
    setTimeout(() => setFlash(false), 1600)
  }
  const log = (line: string) => setJournal((j) => [`Aujourd’hui · ${line}`, ...j])

  const blocked = cert !== 'exception'
  const done = validated ? 4 : cert === 'exception' ? 3 : 2 // number of completed steps

  const pieces: { label: string; status: string; tone?: Tone }[] = [
    { label: 'Photo d’identité', status: 'Reçue' },
    { label: 'Certificat médical', status: CERT[cert].label, tone: CERT[cert].tone },
    { label: 'Autorisation parentale', status: 'Reçue' },
    { label: 'Cotisation', status: 'Payée' },
    { label: 'Validation fédérale', status: validated ? 'Transmise' : 'En attente du club', tone: validated ? 'info' : undefined },
  ]

  const sendRequest = () =>
    confirm({
      title: 'Envoyer la demande de certificat médical à Sophie Martin ?',
      body: 'Un e-mail et une notification seront envoyés au responsable légal d’Emma Roche.',
      confirmLabel: 'Envoyer la demande',
      cancelLabel: 'Ne pas envoyer',
      onConfirm: () => {
        setCert('demande')
        log('Demande de certificat envoyée')
        toast({ message: 'Demande de certificat envoyée à Sophie Martin.' })
      },
    })

  const markException = () => {
    const prev = cert
    setCert('exception')
    log('Exception accordée pour le certificat')
    toast({
      message: 'Exception accordée : le dossier peut être validé.',
      undo: () => {
        setCert(prev)
        setJournal((j) => j.slice(1))
      },
    })
  }

  const validate = () => {
    if (blocked) {
      toast({
        tone: 'info',
        message: 'Validation impossible : le certificat médical manque encore. Envoyez la demande ou marquez une exception.',
      })
      return
    }
    setValidated(true)
    log('Dossier validé')
    toast({
      message: 'Dossier d’Emma Roche validé et transmis à la fédération.',
      undo: () => {
        setValidated(false)
        setJournal((j) => j.slice(1))
      },
    })
  }

  const nextAction = validated
    ? { badge: <Badge>Validé</Badge>, title: 'Aucune action requise.', text: 'Le dossier attend la qualification fédérale.' }
    : cert === 'exception'
      ? { badge: <Badge>À valider</Badge>, title: 'Valider le dossier.', text: 'Toutes les pièces sont contrôlées ou couvertes par une exception.' }
      : cert === 'demande'
        ? { badge: <Badge>En attente</Badge>, title: 'Attendre le certificat médical.', text: 'La demande a été envoyée au responsable légal aujourd’hui.' }
        : {
            badge: <Badge>Bloqué</Badge>,
            title: 'Demander le certificat médical au responsable légal.',
            text: 'Le dossier ne peut pas être validé tant que cette pièce manque.',
          }

  return (
    <AppLayout>
      <Breadcrumb
        items={[
          { label: 'Accueil', to: 'aujourdhui' },
          { label: 'Membres & licences', to: 'dossiers' },
          { label: 'Dossiers', to: 'dossiers' },
          { label: 'Licence · Emma Roche' },
        ]}
      />

      <PageHeader title="Licence · Emma Roche" subtitle="Dossier individuel · U15 · saison 2026–2027">
        <ButtonSecondary>Actions groupées</ButtonSecondary>
        {validated ? (
          <Badge>Dossier validé</Badge>
        ) : (
          <ButtonPrimary requires="editLicences" onClick={validate}>
            Valider le dossier
          </ButtonPrimary>
        )}
      </PageHeader>

      <ol aria-label="Avancement du dossier" className="grid grid-cols-1 sm:grid-cols-5 md:mb-4">
        {STEPS.map((label, i) => (
          <li
            key={label}
            aria-current={i === done - 1 ? 'step' : undefined}
            className={`flex h-12 items-center justify-center border border-border-default px-2 text-center text-xs font-semibold ${
              i < done ? 'bg-action-primary text-text-inverse' : 'bg-bg-surface text-text-secondary'
            }`}
          >
            {label}
          </li>
        ))}
      </ol>

      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 xl:grid-cols-[520fr_296fr_272fr]">
        <Card padding="p-5 sm:p-[22px]" className="md:col-span-2 xl:col-span-1">
          <h2 className="text-lg font-bold">Pièces et contrôles</h2>
          <div>
            {pieces.map((p) => (
              <Row key={p.label} className="min-h-[54px]" right={<Badge tone={p.tone}>{p.status}</Badge>}>
                <p className="text-[13px] font-semibold">{p.label}</p>
              </Row>
            ))}
          </div>
          <div>
            <ButtonSecondary to="aEnvoyer" requires="communicate">
              Rédiger un message personnalisé
            </ButtonSecondary>
          </div>
        </Card>

        <Card padding="p-5 sm:p-[22px]">
          <h2 className="text-lg font-bold">Prochaine action</h2>
          <div>{nextAction.badge}</div>
          <p className="text-[15px] font-semibold">{nextAction.title}</p>
          <p className="text-xs text-text-secondary">{nextAction.text}</p>
          {!validated && cert !== 'exception' && (
            <div className="flex flex-col items-start gap-3">
              {cert === 'manquant' && (
                <ButtonPrimary requires="communicate" onClick={sendRequest}>
                  Envoyer la demande
                </ButtonPrimary>
              )}
              <ButtonSecondary requires="editLicences" onClick={markException}>
                Marquer comme exception
              </ButtonSecondary>
            </div>
          )}
          {!validated && cert === 'exception' && (
            <div>
              <ButtonPrimary requires="editLicences" onClick={validate}>
                Valider le dossier
              </ButtonPrimary>
            </div>
          )}
        </Card>

        <Card padding="p-5 sm:p-[22px]">
          <h2 className="text-lg font-bold">Informations</h2>
          <dl className="flex flex-col gap-3 text-xs font-semibold">
            {infos.map((i) => (
              <div key={i.label} className="flex flex-col gap-3">
                <dt className="text-text-secondary">{i.label}</dt>
                <dd>{i.value}</dd>
              </div>
            ))}
          </dl>
          <div>
            <ButtonSecondary onClick={showHistory}>
              Voir l’historique
            </ButtonSecondary>
          </div>
        </Card>
      </div>

      <Card padding="p-[18px]" className={`transition-shadow ${flash ? 'ring-2 ring-action-primary' : ''}`}>
        <h2 id="historique-dossier" className="scroll-mt-6 text-base font-bold">
          Historique et messages
        </h2>
        <ul className="flex flex-col gap-2 text-xs text-text-secondary sm:flex-row sm:flex-wrap sm:gap-x-7">
          {journal.map((j, i) => (
            <li key={`${i}-${j}`}>{j}</li>
          ))}
        </ul>
      </Card>
    </AppLayout>
  )
}
