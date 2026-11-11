// Figma: 24:2690 "Desktop · Communications · Modèles"
import { AppLayout } from '../components/AppLayout'
import { SubPageHeader } from '../components/communications/SubPageHeader'
import { Breadcrumb, ButtonPrimary, ButtonSecondary, Card } from '../components/ui'

const templates = [
  { tag: 'Événement', title: 'Rappel de présence', vars: 'Variables : prénom, équipe, date' },
  { tag: 'Bénévoles', title: 'Recherche de bénévole', vars: 'Variables : mission, créneau' },
  { tag: 'Administration', title: 'Document manquant', vars: 'Variables : document, échéance' },
  { tag: 'Finances', title: 'Relance de paiement', vars: 'Variables : facture, montant' },
]

const rules = [
  'Validation obligatoire pour les communications sensibles',
  'Prévisualisation du rendu mobile et email avant l’envoi',
  'Historique des modifications et auteur du modèle',
]

export default function ComModeles() {
  return (
    <AppLayout>
      <Breadcrumb items={[{ label: 'Accueil', to: 'aujourdhui' }, { label: 'Communications', to: 'aEnvoyer' }, { label: 'Modèles' }]} />

      <SubPageHeader title="Modèles de communication" subtitle="Préparer des messages cohérents et faciles à réutiliser.">
        <ButtonPrimary requires="communicate">Créer un modèle</ButtonPrimary>
      </SubPageHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {templates.map((t) => (
          <Card key={t.title} padding="p-[18px]" className="items-start rounded-lg xl:min-h-[230px]">
            {/* Category, not a status: plain label (the Badge is reserved for statuses). */}
            <p className="text-xs font-semibold text-text-secondary uppercase">{t.tag}</p>
            <h2 className="text-base font-semibold">{t.title}</h2>
            <p className="text-xs text-text-secondary">{t.vars}</p>
            <p className="w-full truncate text-xs text-text-secondary">Aperçu : Bonjour {'{prénom}'}, une action est attendue…</p>
            <div className="mt-auto">
              <ButtonSecondary to="aEnvoyer" requires="communicate" wide={false} className="min-w-[166px]">
                Utiliser
              </ButtonSecondary>
            </div>
          </Card>
        ))}
      </div>

      <Card padding="p-5" className="rounded-lg lg:min-h-[170px]">
        <h2 className="text-base font-semibold">Garde-fous</h2>
        <ul className="flex flex-col gap-3 text-[13px]">
          {rules.map((r) => (
            <li key={r}>• {r}</li>
          ))}
        </ul>
      </Card>
    </AppLayout>
  )
}
