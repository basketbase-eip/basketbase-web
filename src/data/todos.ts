import type { RouteKey } from '../routes'
import type { Role } from '../roles'
import type { Tone } from '../components/ui'

/* "À traiter pour toi" — one list per role, each item is an action, not information
 * (research report, "Un accueil par rôle qui absorbe « À traiter »").
 * Static data for the prototype. */

export type Todo = {
  id: string
  title: string
  meta: string
  status: string
  tone: Tone
  action: string
  to?: RouteKey
  /** In-place action handled on the home page (volunteer/parent quick replies). */
  quick?: 'confirm' | 'decline' | 'take'
}

export const TODOS: Record<Role, Todo[]> = {
  president: [
    { id: 'p1', title: 'Match U15 de samedi : 2 points bloquants', meta: 'Délégué de club non désigné · chronométreur à remplacer', status: 'Bloquant', tone: 'danger', action: 'Voir la préparation', to: 'matchPreparation' },
    { id: 'p2', title: 'Seniors · 20:30 : clés du gymnase à confirmer', meta: 'Samedi · Gymnase des Berges', status: 'À confirmer', tone: 'warning', action: 'Ouvrir le week-end', to: 'weekEnd' },
    { id: 'p3', title: 'Remboursement de 420 € : deuxième validation', meta: 'Validé par Martine (trésorerie) · au-delà de 300 €', status: 'À valider', tone: 'warning', action: 'Examiner', to: 'remboursement' },
    { id: 'p4', title: 'Publier le compte rendu du bureau', meta: 'Réunion du 9 septembre', status: 'À publier', tone: 'info', action: 'Ouvrir', to: 'reunions' },
    { id: 'p5', title: 'Déclarer le nouveau bureau en préfecture', meta: 'Sous 3 mois après l’AG · avant le 12 décembre', status: 'À faire', tone: 'neutral', action: 'Voir les responsabilités', to: 'responsabilites' },
  ],
  secretaire: [
    { id: 's1', title: 'Relancer 8 dossiers de licence incomplets', meta: '5 questionnaires de santé · 3 paiements', status: 'Incomplets', tone: 'warning', action: 'Relancer', to: 'dossiers' },
    { id: 's2', title: '3 licences en attente du Comité depuis plus de 15 jours', meta: 'U13 · U18 F', status: 'En attente', tone: 'warning', action: 'Voir les licences', to: 'licences' },
    { id: 's3', title: 'Licence d’Emma Roche : certificat à renouveler', meta: 'Seniors · certificat de plus de 3 saisons', status: 'Bloquée', tone: 'danger', action: 'Ouvrir le dossier', to: 'dossierDetail' },
    { id: 's4', title: 'Désigner le délégué de club du match U15', meta: 'Samedi · obligatoire pour un match à domicile', status: 'Bloquant', tone: 'danger', action: 'Préparer le match', to: 'matchPreparation' },
    { id: 's5', title: 'Convoquer la réunion de bureau d’octobre', meta: 'Ordre du jour à compléter', status: 'À planifier', tone: 'neutral', action: 'Ouvrir', to: 'reunions' },
  ],
  tresorier: [
    { id: 't1', title: 'Valider 3 remboursements', meta: '1 240 € · plus ancien : 6 jours', status: 'À valider', tone: 'warning', action: 'Valider', to: 'remboursement' },
    { id: 't2', title: '2 licences bloquées par un solde impayé', meta: 'Dont le chronométreur du match U15 samedi', status: 'Bloquant', tone: 'danger', action: 'Voir les licences', to: 'licences' },
    { id: 't3', title: 'Rapprocher 12 transactions', meta: 'Dont 4 Pass’Sport', status: 'À rapprocher', tone: 'warning', action: 'Rapprocher', to: 'transactions' },
    { id: 't4', title: 'Programmer 5 factures fournisseurs', meta: '2 630 € · échéance fin du mois', status: 'À programmer', tone: 'neutral', action: 'Ouvrir', to: 'factures' },
  ],
  entraineur: [
    { id: 'e1', title: 'Match U15 samedi : 3 joueurs sans réponse', meta: 'Convocation envoyée mardi', status: 'Sans réponse', tone: 'warning', action: 'Voir l’équipe', to: 'matchEquipe' },
    { id: 'e2', title: '1 joueur convoqué sans licence validée', meta: 'Hugo Lopez · questionnaire de santé manquant', status: 'Bloquant', tone: 'danger', action: 'Voir la préparation', to: 'matchPreparation' },
    { id: 'e3', title: 'Répondre aux parents U15', meta: '2 messages non lus', status: 'Non lus', tone: 'info', action: 'Ouvrir', to: 'conversations' },
  ],
  officiels: [
    { id: 'o1', title: 'Table U15 : chronométreur à remplacer', meta: 'Samedi 18:30 · licence bloquée', status: 'À pourvoir', tone: 'danger', action: 'Trouver un remplaçant', to: 'remplacement' },
    { id: 'o2', title: 'Délégué de club U15 non désigné', meta: 'Majeur, licencié, présent 1 h avant', status: 'Bloquant', tone: 'danger', action: 'Préparer le match', to: 'matchPreparation' },
    { id: 'o3', title: 'Seniors 20:30 : marqueur non confirmé', meta: 'Repère : jeudi soir', status: 'Non confirmé', tone: 'warning', action: 'Voir le planning', to: 'planning' },
    { id: 'o4', title: '2 OTM sans e-learning à jour', meta: 'Qualification table de marque', status: 'À vérifier', tone: 'warning', action: 'Voir les compétences', to: 'competences' },
  ],
  benevole: [
    { id: 'b1', title: 'Table de marque · U15 vs USV', meta: 'Samedi 14 sept. · 17:45 · Gymnase des Berges', status: 'À confirmer', tone: 'warning', action: 'Je confirme', quick: 'confirm' },
    { id: 'b2', title: 'Buvette · Tournoi U9', meta: 'Dimanche · 13:00–16:00 · créneau ouvert', status: 'Ouvert', tone: 'neutral', action: 'Je prends ce créneau', quick: 'take' },
  ],
  parent: [
    { id: 'pa1', title: 'Convocation de Léa · U15 vs USV', meta: 'Samedi 14 sept. · rendez-vous 17:45', status: 'À confirmer', tone: 'warning', action: 'Léa sera présente', quick: 'confirm' },
    { id: 'pa2', title: 'Questionnaire de santé de Léa', meta: 'Nécessaire pour valider sa licence', status: 'Manquant', tone: 'danger', action: 'Remplir le questionnaire' },
    { id: 'pa3', title: 'Covoiturage U15 · déplacement à Valence', meta: 'Dimanche 22 sept. · 2 places manquent', status: 'À compléter', tone: 'warning', action: 'Proposer des places' },
  ],
}

export const todoCount = (r: Role) => TODOS[r].length
