// Figma: 69:1251 "Prototype · Match U15 · Matériel"
import { MatchPage } from '../components/match/MatchPage'

export default function MatchMateriel() {
  return (
    <MatchPage
      tab="matchMateriel"
      banner={{
        title: "Matériel presque prêt",
        subtitle: "8 éléments contrôlés sur 10 · 2 vérifications restantes",
        secondary: "Signaler un manque",
        primary: "Finaliser la checklist",
      }}
      timeline={{
        title: "Checklist",
        rows: [
          ["OK", "Table de marque"],
          ["OK", "Chronomètre"],
          ["OK", "Ballons · 6"],
          ["À faire", "Maillots"],
          ["À faire", "Pharmacie"],
          ["OK", "Sono portable"],
        ],
        action: "Modifier la checklist",
      }}
      missions={{
        title: "Responsables",
        rows: [
          ["Installation", "Thomas · confirmé"],
          ["Ballons", "Lucas · confirmé"],
          ["Maillots", "Nina · confirmée"],
          ["Pharmacie", "Julie · confirmée"],
          ["Rangement", "Romain · confirmé"],
        ],
        action: "Affecter le matériel",
      }}
      controls={{
        title: "Contrôles restants",
        rows: [
          ["Maillots", "3 tailles à confirmer"],
          ["Tablette", "Charge à vérifier"],
          ["Clés", "Retrait à 17:15"],
          ["Pharmacie", "Inventaire complet"],
          ["Incident", "Aucun signalé"],
        ],
        action: "Valider les contrôles",
      }}
    />
  )
}
