// Figma: 69:1525 "Prototype · Match U15 · Messages"
import { MatchPage } from '../components/match/MatchPage'

export default function MatchMessages() {
  return (
    <MatchPage
      tab="matchMessages"
      banner={{
        title: "Communication du match",
        subtitle: "3 envois programmés · 2 réponses encore attendues",
        secondary: "Voir les réponses",
        primary: "Nouveau message",
      }}
      timeline={{
        title: "Envois programmés",
        rows: [
          ["12:00", "Rappel aux joueurs"],
          ["16:00", "Rappel bénévoles"],
          ["18:00", "Accès au gymnase"],
          ["Après", "Résultat du match"],
          ["Dim.", "Remerciements"],
          ["Lun.", "Compte rendu"],
        ],
        action: "Modifier les envois",
      }}
      missions={{
        title: "Destinataires",
        rows: [
          ["Joueurs", "22 contacts"],
          ["Staff", "3 contacts"],
          ["Bénévoles", "8 contacts"],
          ["Parents", "31 contacts"],
          ["Invités", "12 contacts"],
        ],
        action: "Gérer les contacts",
      }}
      controls={{
        title: "Historique",
        rows: [
          ["Convocation", "Envoyée · 28 vues"],
          ["Rappel joueurs", "2 sans réponse"],
          ["Bénévoles", "4 réponses reçues"],
          ["Accès gymnase", "À programmer"],
          ["Résultat", "Brouillon prêt"],
        ],
        action: "Voir l’historique",
      }}
    />
  )
}
