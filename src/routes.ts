// Every screen of the Figma "18 — Prototype cliquable" page, keyed by name.
// `node` is the Figma frame id, kept for traceability.
export const R = {
  aujourdhui: { path: '/', node: '24:31' },
  aTraiter: { path: '/a-traiter', node: '47:182' },
  espaces: { path: '/espaces', node: '47:301' },

  weekEnd: { path: '/evenements/week-end', node: '24:129' },
  calendrier: { path: '/evenements/calendrier', node: '24:356' },
  evModeles: { path: '/evenements/modeles', node: '24:451' },
  evRessources: { path: '/evenements/ressources', node: '24:536' },
  matchPreparation: { path: '/evenements/match-u15', node: 'new' },
  matchVue: { path: '/evenements/match-u15/vue-generale', node: '24:244' },
  matchEquipe: { path: '/evenements/match-u15/equipe', node: '69:840' },
  matchBenevoles: { path: '/evenements/match-u15/benevoles', node: '69:977' },
  matchBuvette: { path: '/evenements/match-u15/buvette', node: '69:1114' },
  matchMateriel: { path: '/evenements/match-u15/materiel', node: '69:1251' },
  matchFinances: { path: '/evenements/match-u15/finances', node: '69:1388' },
  matchMessages: { path: '/evenements/match-u15/messages', node: '69:1525' },

  missions: { path: '/benevoles/missions', node: '24:623' },
  remplacement: { path: '/benevoles/remplacement', node: '24:731' },
  remplacementOk: { path: '/benevoles/remplacement/confirme', node: '24:3131' },
  planning: { path: '/benevoles/planning', node: '24:824' },
  personnes: { path: '/benevoles/personnes', node: '24:916' },
  competences: { path: '/benevoles/competences', node: '24:1012' },
  historique: { path: '/benevoles/historique', node: '24:1090' },

  dossiers: { path: '/administration/dossiers', node: '24:1182' },
  dossierDetail: { path: '/administration/dossiers/emma-roche', node: '24:1299' },
  licences: { path: '/administration/licences', node: '24:1389' },
  adminDocuments: { path: '/administration/documents', node: '24:1473' },
  reunions: { path: '/administration/reunions', node: '24:1553' },
  decisions: { path: '/administration/decisions', node: '24:1624' },
  responsabilites: { path: '/administration/responsabilites', node: '24:1695' },

  finances: { path: '/finances', node: '24:1777' },
  remboursement: { path: '/finances/remboursement', node: '24:1887' },
  paiementOk: { path: '/finances/remboursement/approuve', node: '24:3165' },
  transactions: { path: '/finances/transactions', node: '24:1980' },
  budget: { path: '/finances/budget', node: '24:2079' },
  factures: { path: '/finances/factures', node: '24:2178' },
  objectifs: { path: '/finances/objectifs', node: '24:2277' },

  aEnvoyer: { path: '/communications', node: '24:2370' },
  envoyees: { path: '/communications/envoyees', node: '24:2547' },
  conversations: { path: '/communications/conversations', node: '24:2625' },
  comModeles: { path: '/communications/modeles', node: '24:2690' },
  preferences: { path: '/communications/preferences', node: '24:2770' },
  comDetail: { path: '/communications/changement-horaire-u15', node: '24:2924' },
  comEnvoyee: { path: '/communications/envoyee', node: '24:3199' },

  equipes: { path: '/equipes', node: '24:2849' },
  equipeU15: { path: '/equipes/u15', node: '24:2461' },

  documents: { path: '/documents', node: '24:2974' },
  parametres: { path: '/parametres', node: '24:3062' },
} as const

export type RouteKey = keyof typeof R
export const to = (k: RouteKey) => R[k].path

/** Former sidebar spaces, kept so screens can still declare where they belong.
 *  Navigation itself is defined in nav.ts. */
export type Section =
  | 'accueil'
  | 'evenements'
  | 'benevoles'
  | 'administration'
  | 'finances'
  | 'communications'
  | 'equipes'
  | 'documents'
  | 'parametres'
