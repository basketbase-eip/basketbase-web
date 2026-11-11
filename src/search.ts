import type { RouteKey } from './routes'
import { NAV } from './nav'

/* Global search index (research report, "Une recherche visible qui comprend les mots
 * du club"): pages + people + teams + events + documents, with club synonyms shown
 * next to the official term ("convoc → Convocations"). Static data for the prototype. */

export type SearchKind = 'Pages' | 'Personnes' | 'Équipes' | 'Matchs & événements' | 'Documents' | 'Actions'
export type SearchEntry = { kind: SearchKind; label: string; meta?: string; to: RouteKey; keywords?: string[] }

const pages: SearchEntry[] = NAV.flatMap((g) =>
  g.items.map((i) => ({
    kind: 'Pages' as const,
    label: i.label === g.label ? i.label : `${g.label} › ${i.label}`,
    to: i.to,
  })),
)

const SYNONYMS: Partial<Record<RouteKey, string[]>> = {
  licences: ['adhésion', 'adhesion', 'inscription', 'licence', 'e-licence', 'fbi', 'certificat', 'questionnaire santé'],
  dossiers: ['dossier', 'pièce manquante', 'relance licence'],
  planning: ['créneau', 'creneau', 'permanence', 'table de marque', 'otm', 'dispo', 'disponibilités'],
  missions: ['mission', 'poste', 'besoin bénévole'],
  remplacement: ['remplaçant', 'remplacer', 'absent', 'désistement'],
  aEnvoyer: ['convoc', 'convocation', 'message', 'mail', 'sms', 'rappel', 'relance'],
  transactions: ['dépense', 'recette', 'opération', 'banque', 'paiement'],
  remboursement: ['note de frais', 'frais', 'remboursement', 'défraiement'],
  factures: ['facture', 'fournisseur'],
  budget: ['budget', 'prévisionnel'],
  reunions: ['ag', 'assemblée générale', 'réunion de bureau', 'compte rendu', 'cr', 'pv'],
  decisions: ['vote', 'décision'],
  responsabilites: ['rôle', 'passation', 'organigramme'],
  calendrier: ['agenda', 'gymnase', 'salle', 'entraînement'],
  weekEnd: ['match', 'week-end', 'samedi', 'dimanche'],
  matchPreparation: ['e-marque', 'emarque', 'délégué', 'feuille de match', 'prêt pour le match'],
  documents: ['fichier', 'drive', 'document'],
  parametres: ['réglages', 'configuration', 'club'],
  equipes: ['équipe', 'catégorie', 'effectif'],
}

const people: SearchEntry[] = [
  ['Emma Roche', 'Licenciée U15 · dossier de licence', 'dossierDetail'],
  ['Thomas Roche', 'Bénévole · maillots', 'personnes'],
  ['Julie Martin', 'Bénévole · ouverture du gymnase', 'personnes'],
  ['Sophie Martin', 'Bénévole · buvette', 'personnes'],
  ['Marc Lopez', 'Bénévole · table de marque', 'personnes'],
  ['Claire Durand', 'Bénévole', 'personnes'],
  ['Nina Martin', 'Bénévole', 'personnes'],
  ['Sonia Brun', 'Bénévole', 'personnes'],
  ['Lucas Morel', 'Bénévole', 'personnes'],
  ['Alex Petit', 'Bénévole', 'personnes'],
  ['Romain Petit', 'Responsable des officiels', 'responsabilites'],
  ['Camille Martin', 'Présidence', 'responsabilites'],
].map(([label, meta, to]) => ({ kind: 'Personnes' as const, label, meta, to: to as RouteKey }))

const teams: SearchEntry[] = [
  ['U15 Masculins', 'Entraîneur : Julien Roche', 'equipeU15'],
  ['U9', 'Mini-basket', 'equipes'],
  ['U11', 'Mini-basket', 'equipes'],
  ['U13', 'Jeunes', 'equipes'],
  ['U18 Féminines', 'Jeunes', 'equipes'],
  ['Seniors', 'Seniors', 'equipes'],
].map(([label, meta, to]) => ({ kind: 'Équipes' as const, label, meta, to: to as RouteKey }))

const events: SearchEntry[] = [
  { kind: 'Matchs & événements', label: 'U15 · LLC vs USV', meta: 'Samedi 14 sept. · 18:30 · Gymnase des Berges', to: 'matchPreparation', keywords: ['match u15', 'usv'] },
  { kind: 'Matchs & événements', label: 'U11 · LLC vs Montélier', meta: 'Samedi · 10:00', to: 'weekEnd' },
  { kind: 'Matchs & événements', label: 'Seniors · LLC vs Romans', meta: 'Samedi · 20:30', to: 'weekEnd' },
  { kind: 'Matchs & événements', label: 'Tournoi U9', meta: 'Dimanche', to: 'weekEnd' },
  { kind: 'Matchs & événements', label: 'Réunion de bureau', meta: 'Compte rendu à publier', to: 'reunions' },
]

const docs: SearchEntry[] = [
  { kind: 'Documents', label: 'Compte rendu du bureau', meta: 'Réunions', to: 'reunions' },
  { kind: 'Documents', label: 'Statuts et règlement intérieur', meta: 'Documents officiels', to: 'adminDocuments' },
  { kind: 'Documents', label: 'Guide e-Marque V2', meta: 'Documents partagés', to: 'documents', keywords: ['emarque', 'feuille de match'] },
  { kind: 'Documents', label: 'Changement horaire U15', meta: 'Communication envoyée', to: 'comDetail' },
]

const actions: SearchEntry[] = [
  { kind: 'Actions', label: 'Préparer le match U15', to: 'matchPreparation', keywords: ['prêt', 'préparation'] },
  { kind: 'Actions', label: 'Trouver un remplaçant', to: 'remplacement', keywords: ['remplacer', 'absent'] },
  { kind: 'Actions', label: 'Valider un remboursement', to: 'remboursement', keywords: ['note de frais'] },
  { kind: 'Actions', label: 'Relancer les licences incomplètes', to: 'dossiers', keywords: ['relance'] },
  { kind: 'Actions', label: 'Envoyer un message', to: 'aEnvoyer', keywords: ['convocation', 'sms', 'mail'] },
  { kind: 'Actions', label: 'Ajouter une opération', to: 'transactions', keywords: ['dépense', 'recette'] },
]

export const INDEX: SearchEntry[] = [
  ...actions,
  ...pages.map((p) => ({ ...p, keywords: SYNONYMS[p.to] })),
  ...people,
  ...teams,
  ...events,
  ...docs,
]

export const norm = (t: string) =>
  t
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')

function close(a: string, b: string) {
  // Levenshtein distance ≤ 1 (typo tolerance) for words of 4+ letters
  if (Math.abs(a.length - b.length) > 1 || a.length < 4) return false
  let i = 0
  let j = 0
  let edits = 0
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i++
      j++
      continue
    }
    if (++edits > 1) return false
    if (a.length > b.length) i++
    else if (b.length > a.length) j++
    else {
      i++
      j++
    }
  }
  return edits + (a.length - i) + (b.length - j) <= 1
}

/** Returns matches with the synonym that matched (to show "convoc → …"). */
export function search(q: string, entries: SearchEntry[]) {
  const tokens = norm(q).split(/\s+/).filter(Boolean)
  if (!tokens.length) return []
  const out: { e: SearchEntry; via?: string; score: number }[] = []
  for (const e of entries) {
    const label = norm(e.label + ' ' + (e.meta ?? ''))
    const kws = (e.keywords ?? []).map(norm)
    const hay = (label + ' ' + kws.join(' ')).split(/[^a-z0-9-]+/)
    const ok = tokens.every((t) => label.includes(t) || kws.some((k) => k.includes(t)) || hay.some((w) => close(t, w)))
    if (!ok) continue
    const inLabel = tokens.every((t) => label.includes(t))
    const via = inLabel ? undefined : e.keywords?.find((k) => tokens.some((t) => norm(k).includes(t) || close(t, norm(k))))
    out.push({ e, via, score: (inLabel ? 2 : 1) + (norm(e.label).startsWith(tokens[0]) ? 1 : 0) })
  }
  return out.sort((a, b) => b.score - a.score).slice(0, 30)
}
