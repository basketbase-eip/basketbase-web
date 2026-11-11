// Figma: 69:840 "Prototype · Match U15 · Équipe"
import { MatchPage } from '../components/match/MatchPage'

export default function MatchEquipe() {
  return (
    <MatchPage
      tab="matchEquipe"
      banner={{
        title: "Équipe du match",
        subtitle: "18 présents · 2 incertains · 2 sans réponse",
        secondary: "Envoyer un rappel",
        primary: "Gérer la composition",
      }}
      timeline={{
        title: "Composition",
        rows: [
          ["GB", "Emma Roche"],
          ["Défense", "Nina · Léa · Zoé"],
          ["Milieu", "Inès · Lucas"],
          ["Attaque", "Hugo · Léo"],
          ["Rempl.", "3 joueurs"],
          ["Cap.", "Nina Martin"],
        ],
        action: "Modifier l’équipe",
      }}
      missions={{
        title: "Présences au match",
        rows: [
          ["Présents", "18 joueurs"],
          ["Peut-être", "2 joueurs"],
          ["Sans réponse", "2 joueurs"],
          ["Absents", "3 joueurs"],
          ["Staff", "3 confirmés"],
        ],
        action: "Relancer les absents",
      }}
      controls={{
        title: "À vérifier",
        rows: [
          ["Certificats", "1 expire bientôt"],
          ["Maillots", "3 tailles inconnues"],
          ["Transport", "2 places manquantes"],
          ["Blessures", "Aucune déclarée"],
          ["Feuille de match", "À compléter"],
        ],
        action: "Traiter les alertes",
      }}
    />
  )
}
