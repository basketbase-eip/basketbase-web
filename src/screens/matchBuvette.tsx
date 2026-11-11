// Figma: 69:1114 "Prototype · Match U15 · Buvette"
import { MatchPage } from '../components/match/MatchPage'

export default function MatchBuvette() {
  return (
    <MatchPage
      tab="matchBuvette"
      banner={{
        title: "Buvette à finaliser",
        subtitle: "Stock vérifié à 80 % · 1 bénévole manque à 20:00",
        secondary: "Relancer l’équipe",
        primary: "Préparer la commande",
      }}
      timeline={{
        title: "Stocks disponibles",
        rows: [
          ["48", "Boissons fraîches"],
          ["32", "Sandwichs"],
          ["24", "Hot-dogs"],
          ["18", "Confiseries"],
          ["60", "Gobelets"],
          ["100 €", "Fond de caisse"],
        ],
        action: "Mettre à jour le stock",
      }}
      missions={{
        title: "Équipe buvette",
        rows: [
          ["Responsable", "Julie · confirmée"],
          ["18:00–19:00", "Sophie · confirmée"],
          ["19:00–20:00", "Marc · peut-être"],
          ["20:00–21:00", "1 personne manque"],
          ["Rangement", "Romain · confirmé"],
        ],
        action: "Gérer l’équipe",
      }}
      controls={{
        title: "Commandes et caisse",
        rows: [
          ["Commande", "À valider avant 16:00"],
          ["Terminal", "Chargé · prêt"],
          ["Monnaie", "Fond de caisse prêt"],
          ["Tarifs", "Affichage à imprimer"],
          ["Objectif", "420 € de recette"],
        ],
        action: "Ouvrir la caisse",
      }}
    />
  )
}
