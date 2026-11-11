// Figma: 69:977 "Prototype · Match U15 · Bénévoles"
import { MatchPage } from '../components/match/MatchPage'

export default function MatchBenevoles() {
  return (
    <MatchPage
      tab="matchBenevoles"
      banner={{
        title: "Missions du match",
        subtitle: "5 missions couvertes sur 7 · 2 postes restent à pourvoir",
        secondary: "Relancer l’équipe",
        primary: "Trouver des renforts",
      }}
      timeline={{
        title: "Planning",
        rows: [
          ["17:30", "Ouverture du gymnase"],
          ["18:00", "Installation buvette"],
          ["18:15", "Accueil des joueurs"],
          ["18:30", "Table de marque"],
          ["20:00", "Rangement buvette"],
          ["20:40", "Clôture du gymnase"],
        ],
        action: "Modifier le planning",
      }}
      missions={{
        title: "Missions et responsables",
        rows: [
          ["Ouverture", "Julie · confirmée"],
          ["Table de marque", "1 personne manque"],
          ["Buvette", "1 personne manque"],
          ["Maillots", "Thomas · confirmé"],
          ["Clôture", "Romain · confirmé"],
        ],
        action: "Gérer les missions",
      }}
      controls={{
        title: "À relancer",
        rows: [
          ["Sophie Martin", "Buvette · sans réponse"],
          ["Marc Leroy", "Table · peut-être"],
          ["Julie Bernard", "Ouverture · confirmée"],
          ["Romain Petit", "Clôture · confirmé"],
          ["Créneaux libres", "2 missions"],
        ],
        action: "Envoyer les relances",
      }}
    />
  )
}
