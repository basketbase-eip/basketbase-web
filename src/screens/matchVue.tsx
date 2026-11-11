// Figma: 24:244 "Prototype · Match U15 · Vue générale"
import { MatchPage } from '../components/match/MatchPage'

export default function MatchVue() {
  return (
    <MatchPage
      tab="matchVue"
      banner={{
        title: "Préparation incomplète",
        subtitle: "5 besoins couverts sur 7 · 2 réponses attendues avant 17:00",
        secondary: "Envoyer un rappel",
        primary: "Trouver des remplaçants",
      }}
      timeline={{
        title: "Déroulé",
        rows: [
          ["17:45", "Ouverture du gymnase"],
          ["18:00", "Installation buvette"],
          ["18:15", "Accueil des joueurs"],
          ["18:30", "Échauffement"],
          ["19:00", "Coup d’envoi"],
          ["20:40", "Clôture et rangement"],
        ],
        action: "Modifier le déroulé",
      }}
      missions={{
        title: "Besoins et responsables",
        rows: [
          ["Ouverture", "Julie · confirmé"],
          ["Table de marque", "1 / 2 confirmé"],
          ["Buvette", "1 / 2 confirmé"],
          ["Maillots", "Thomas · confirmé"],
          ["Clôture", "Romain · confirmé"],
        ],
        action: "Gérer les missions",
      }}
      controls={{
        title: "Contrôles",
        rows: [
          ["Gymnase", "Accès confirmé"],
          ["Matériel", "Inventaire prêt"],
          ["Buvette", "Stock à vérifier"],
          ["Communication", "28 vus · 4 non lus"],
          ["Dépenses", "120 € engagés"],
        ],
        action: "Voir tous les contrôles",
      }}
    />
  )
}
