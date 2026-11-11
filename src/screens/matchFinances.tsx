// Figma: 69:1388 "Prototype · Match U15 · Finances"
import { MatchPage } from '../components/match/MatchPage'

export default function MatchFinances() {
  return (
    <MatchPage
      tab="matchFinances"
      banner={{
        title: "Budget du match",
        subtitle: "680 € de recettes prévues · 120 € déjà engagés",
        secondary: "Exporter le budget",
        primary: "Ajouter une dépense",
      }}
      timeline={{
        title: "Prévision",
        rows: [
          ["680 €", "Recettes totales"],
          ["420 €", "Buvette"],
          ["160 €", "Dons"],
          ["120 €", "Dépenses"],
          ["560 €", "Marge prévue"],
          ["100 €", "Caisse initiale"],
        ],
        action: "Modifier le budget",
      }}
      missions={{
        title: "Dépenses engagées",
        rows: [
          ["Arbitrage", "60 € · validé"],
          ["Achats buvette", "40 € · reçu"],
          ["Transport", "20 € · à confirmer"],
          ["Matériel", "0 €"],
          ["Total", "120 €"],
        ],
        action: "Voir les dépenses",
      }}
      controls={{
        title: "À valider",
        rows: [
          ["Facture fournisseur", "40 € · reçue"],
          ["Remboursement", "20 € · en attente"],
          ["Caisse buvette", "Comptage après match"],
          ["Écart", "Aucun pour le moment"],
          ["Clôture", "Après le match"],
        ],
        action: "Valider les pièces",
      }}
    />
  )
}
