import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

/* Roles and permissions.
 * The matrix follows the research report ("Une matrice de permissions…"): it is a
 * design inference from CNIL principles, to be enforced server-side in a real app.
 * Here it drives what each role sees in the prototype ("Voir en tant que"). */

export type Role = 'president' | 'secretaire' | 'tresorier' | 'entraineur' | 'officiels' | 'benevole' | 'parent'

export const ROLES: { id: Role; label: string; person: string; title: string }[] = [
  { id: 'president', label: 'Président·e', person: 'Camille Martin', title: 'Présidence' },
  { id: 'secretaire', label: 'Secrétaire', person: 'Nadia Benali', title: 'Secrétariat · licences' },
  { id: 'tresorier', label: 'Trésorier·e', person: 'Martine Leroy', title: 'Trésorerie' },
  { id: 'entraineur', label: 'Entraîneur U15', person: 'Julien Roche', title: 'Entraîneur U15 M' },
  { id: 'officiels', label: 'Resp. officiels', person: 'Romain Petit', title: 'Responsable des officiels' },
  { id: 'benevole', label: 'Bénévole / OTM', person: 'Karim Haddad', title: 'Bénévole · table de marque' },
  { id: 'parent', label: 'Parent', person: 'Sophie Durand', title: 'Parent · Léa (U15)' },
]

export type Perm =
  | 'members' // see members & licences
  | 'editLicences'
  | 'finances' // see the finance space
  | 'validateExpense'
  | 'volunteersAll' // full volunteer planning
  | 'matchPrep'
  | 'communicate'
  | 'administration' // bureau: meetings, decisions, responsibilities
  | 'settings'
  | 'teams'

const MATRIX: Record<Role, Perm[]> = {
  president: ['members', 'editLicences', 'finances', 'volunteersAll', 'matchPrep', 'communicate', 'administration', 'settings', 'teams'],
  secretaire: ['members', 'editLicences', 'volunteersAll', 'matchPrep', 'communicate', 'administration', 'settings', 'teams'],
  tresorier: ['members', 'finances', 'validateExpense', 'communicate', 'teams'],
  entraineur: ['members', 'matchPrep', 'communicate', 'teams'],
  officiels: ['volunteersAll', 'matchPrep', 'communicate', 'teams'],
  benevole: [],
  parent: [],
}

/** Why an action is refused — shown next to disabled controls, never a silent hide. */
export const PERM_REASON: Partial<Record<Perm, string>> = {
  validateExpense: 'Seul·e le ou la trésorier·e valide un remboursement.',
  editLicences: 'Seul le secrétariat modifie les licences.',
  communicate: 'Votre rôle ne permet pas d’envoyer des messages au club.',
  finances: 'Les finances sont réservées au bureau et à la trésorerie.',
  settings: 'Les paramètres sont réservés au bureau.',
}

type Ctx = { role: Role; setRole: (r: Role) => void; can: (p: Perm) => boolean; me: (typeof ROLES)[number] }
const RoleContext = createContext<Ctx | null>(null)
const KEY = 'llc-role'

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>(() => {
    try {
      const r = localStorage.getItem(KEY) as Role | null
      if (r && ROLES.some((x) => x.id === r)) return r
    } catch {
      /* storage unavailable */
    }
    return 'president'
  })
  useEffect(() => {
    try {
      localStorage.setItem(KEY, role)
    } catch {
      /* ignore */
    }
  }, [role])
  const value: Ctx = {
    role,
    setRole,
    can: (p) => MATRIX[role].includes(p),
    me: ROLES.find((r) => r.id === role)!,
  }
  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>
}

export function useRole() {
  const c = useContext(RoleContext)
  if (!c) throw new Error('useRole outside RoleProvider')
  return c
}
