// Figma: 24:1389 "Desktop · Administration · Licences"
// Flow « Relancer des licences »: saved views, selection, bulk « Relancer ».
import { AppLayout } from '../components/AppLayout'
import { Breadcrumb, ButtonPrimary, ButtonSecondary, Metric, PageHeader } from '../components/ui'
import { LicenceRelance } from '../components/flows/LicenceRelance'

export default function Licences() {
  return (
    <AppLayout>
      <Breadcrumb
        items={[{ label: 'Accueil', to: 'aujourdhui' }, { label: 'Membres & licences', to: 'dossiers' }, { label: 'Licences' }]}
      />

      <PageHeader title="Licences" subtitle="Suivi des inscriptions et pièces obligatoires">
        <ButtonSecondary>Exporter</ButtonSecondary>
        <ButtonPrimary requires="editLicences">Ajouter une licence</ButtonPrimary>
      </PageHeader>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Metric label="Validées" value="108" />
        <Metric label="Incomplètes" value="3" hint="pièce ou questionnaire manquant" />
        <Metric label="En attente du Comité" value="2" hint="depuis plus de 15 jours" />
        <Metric label="Bloquées pour paiement" value="2" hint="solde impayé" />
      </div>

      <LicenceRelance title="Licences à suivre" />
    </AppLayout>
  )
}
