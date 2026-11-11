import type { LucideIcon } from 'lucide-react'
import {
  CalendarDays,
  FolderOpen,
  HandHeart,
  House,
  IdCard,
  Landmark,
  MessageSquare,
  Settings,
  Trophy,
  Users,
  Wallet,
} from 'lucide-react'
import { R, type RouteKey } from './routes'
import type { Perm, Role } from './roles'

/* Information architecture (research report, "Une barre latérale visible, élaguée
 * par rôle"): every space is always visible in the sidebar, in a stable order,
 * with its own icon and label. Roles only prune what they may never use. */

export type NavItem = { label: string; to: RouteKey; roles?: Role[] }
export type NavGroup = {
  id: string
  label: string
  icon: LucideIcon
  /** Permission needed to see the group (none = everyone). */
  perm?: Perm
  /** Roles that see the group even without the permission (with pruned items). */
  alsoRoles?: Role[]
  items: NavItem[]
  /** Pinned to the bottom of the sidebar. */
  footer?: boolean
}

export const NAV: NavGroup[] = [
  { id: 'accueil', label: 'Accueil', icon: House, items: [{ label: 'Accueil', to: 'aujourdhui' }] },
  { id: 'calendrier', label: 'Calendrier', icon: CalendarDays, items: [{ label: 'Calendrier', to: 'calendrier' }] },
  {
    id: 'evenements',
    label: 'Événements',
    icon: Trophy,
    perm: 'matchPrep',
    items: [
      { label: 'Week-end', to: 'weekEnd' },
      { label: 'Modèles', to: 'evModeles' },
      { label: 'Ressources', to: 'evRessources' },
    ],
  },
  {
    id: 'equipes',
    label: 'Équipes',
    icon: Users,
    perm: 'teams',
    items: [
      { label: 'Toutes les équipes', to: 'equipes', roles: ['president', 'secretaire', 'tresorier', 'officiels'] },
      { label: 'Équipe U15', to: 'equipeU15' },
    ],
  },
  {
    id: 'benevoles',
    label: 'Bénévoles',
    icon: HandHeart,
    perm: 'volunteersAll',
    alsoRoles: ['benevole', 'entraineur', 'parent'],
    items: [
      { label: 'Planning', to: 'planning' },
      { label: 'Missions', to: 'missions', roles: ['president', 'secretaire', 'officiels', 'entraineur'] },
      { label: 'Personnes', to: 'personnes', roles: ['president', 'secretaire', 'officiels'] },
      { label: 'Compétences', to: 'competences', roles: ['president', 'secretaire', 'officiels'] },
      { label: 'Historique', to: 'historique', roles: ['president', 'secretaire', 'officiels'] },
    ],
  },
  {
    id: 'membres',
    label: 'Membres & licences',
    icon: IdCard,
    perm: 'members',
    items: [
      { label: 'Dossiers', to: 'dossiers' },
      { label: 'Licences', to: 'licences' },
    ],
  },
  {
    id: 'finances',
    label: 'Finances',
    icon: Wallet,
    perm: 'finances',
    items: [
      { label: 'Vue d’ensemble', to: 'finances' },
      { label: 'Transactions', to: 'transactions' },
      { label: 'Budget', to: 'budget' },
      { label: 'Factures', to: 'factures' },
      { label: 'Objectifs', to: 'objectifs' },
    ],
  },
  {
    id: 'communications',
    label: 'Communications',
    icon: MessageSquare,
    perm: 'communicate',
    items: [
      { label: 'À envoyer', to: 'aEnvoyer' },
      { label: 'Envoyées', to: 'envoyees' },
      { label: 'Conversations', to: 'conversations' },
      { label: 'Modèles', to: 'comModeles' },
      { label: 'Préférences', to: 'preferences' },
    ],
  },
  {
    id: 'administration',
    label: 'Administration',
    icon: Landmark,
    perm: 'administration',
    items: [
      { label: 'Réunions', to: 'reunions' },
      { label: 'Décisions', to: 'decisions' },
      { label: 'Responsabilités', to: 'responsabilites' },
      { label: 'Documents officiels', to: 'adminDocuments' },
    ],
  },
  { id: 'documents', label: 'Documents', icon: FolderOpen, footer: true, items: [{ label: 'Documents partagés', to: 'documents' }] },
  { id: 'parametres', label: 'Paramètres', icon: Settings, perm: 'settings', footer: true, items: [{ label: 'Paramètres', to: 'parametres' }] },
]

/** Screens that are not in the menu belong to a menu item (detail pages, match tabs…). */
const PARENT: Partial<Record<RouteKey, RouteKey>> = {
  aTraiter: 'aujourdhui',
  espaces: 'aujourdhui',
  matchVue: 'weekEnd',
  matchPreparation: 'weekEnd',
  matchEquipe: 'weekEnd',
  matchBenevoles: 'weekEnd',
  matchBuvette: 'weekEnd',
  matchMateriel: 'weekEnd',
  matchFinances: 'weekEnd',
  matchMessages: 'weekEnd',
  remplacement: 'missions',
  remplacementOk: 'missions',
  dossierDetail: 'dossiers',
  remboursement: 'transactions',
  paiementOk: 'transactions',
  comDetail: 'envoyees',
  comEnvoyee: 'envoyees',
}

export function menuKeyFor(k: RouteKey): RouteKey {
  return PARENT[k] ?? k
}

export function groupOf(k: RouteKey): NavGroup | undefined {
  const m = menuKeyFor(k)
  return NAV.find((g) => g.items.some((i) => i.to === m))
}

export function visibleGroups(role: Role, can: (p: Perm) => boolean) {
  return NAV.filter((g) => !g.perm || can(g.perm) || g.alsoRoles?.includes(role))
    .map((g) => ({ ...g, items: g.items.filter((i) => !i.roles || i.roles.includes(role)) }))
    .filter((g) => g.items.length > 0)
    // Volunteers and parents only see their own slots: name it that way.
    .map((g) => (g.id === 'benevoles' && (role === 'benevole' || role === 'parent') ? { ...g, label: 'Mes créneaux' } : g))
}

/** Can this role open this screen? Pages outside the role's menu show an explanation. */
export function canOpen(k: RouteKey, role: Role, can: (p: Perm) => boolean) {
  const m = menuKeyFor(k)
  // Volunteers and parents can follow links to a match they are involved in.
  if (k.startsWith('match') && (role === 'benevole' || role === 'parent')) return true
  // Anyone who spends money for the club can open the expense page (submit), only the treasury validates.
  if (k === 'remboursement' && role !== 'parent') return true
  return visibleGroups(role, can).some((g) => g.items.some((i) => i.to === m))
}

/** Mobile bottom bar: at most 4 destinations + "Menu" (NN/g combo pattern). */
export const BOTTOM_BAR: Record<Role, RouteKey[]> = {
  president: ['aujourdhui', 'calendrier', 'weekEnd', 'aEnvoyer'],
  secretaire: ['aujourdhui', 'dossiers', 'calendrier', 'aEnvoyer'],
  tresorier: ['aujourdhui', 'finances', 'transactions', 'calendrier'],
  entraineur: ['aujourdhui', 'calendrier', 'equipeU15', 'aEnvoyer'],
  officiels: ['aujourdhui', 'planning', 'weekEnd', 'calendrier'],
  benevole: ['aujourdhui', 'planning', 'calendrier', 'documents'],
  parent: ['aujourdhui', 'calendrier', 'planning', 'documents'],
}

export const SHORT_LABEL: Partial<Record<RouteKey, string>> = {
  aujourdhui: 'Accueil',
  calendrier: 'Calendrier',
  weekEnd: 'Matchs',
  aEnvoyer: 'Messages',
  dossiers: 'Licences',
  finances: 'Finances',
  transactions: 'Opérations',
  equipeU15: 'Mon équipe',
  planning: 'Créneaux',
  documents: 'Documents',
}

export function iconFor(k: RouteKey): LucideIcon {
  return groupOf(k)?.icon ?? House
}

export const pathOf = (k: RouteKey) => R[k].path
