import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

/* Club identity and personal display preferences.
 * - Club colour: chosen once by the bureau (Paramètres). Used only for identity
 *   (stripe, crest, active marker, avatars), never for buttons or statuses.
 *   Text on it is computed (white or ink) so it stays legible whatever the colour.
 * - « Lisibilité renforcée »: per person, switches to Atkinson Hyperlegible Next
 *   and enlarges the interface slightly. */

export const DEFAULT_CLUB_COLOR = '#c2410c'

export const CLUB_PRESETS = [
  { label: 'Orange brûlé', value: '#c2410c' },
  { label: 'Bleu roi', value: '#1d4ed8' },
  { label: 'Vert', value: '#15803d' },
  { label: 'Bordeaux', value: '#7c1d2e' },
  { label: 'Marine', value: '#1e3a5f' },
  { label: 'Jaune', value: '#eab308' },
]

function luminance(hex: string) {
  let h = hex.replace('#', '')
  if (h.length === 3) h = [...h].map((c) => c + c).join('')
  const [r, g, b] = [0, 2, 4].map((i) => {
    const v = parseInt(h.slice(i, i + 2), 16) / 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** Ink on light club colours (yellow…), white on the others. */
export const textOn = (hex: string) => (luminance(hex) > 0.3 ? '#1f1c18' : '#ffffff')

type Ctx = { clubColor: string; setClubColor: (c: string) => void; readable: boolean; setReadable: (b: boolean) => void }
const ClubContext = createContext<Ctx | null>(null)

function load(key: string) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}
function save(key: string, v: string) {
  try {
    localStorage.setItem(key, v)
  } catch {
    /* ignore */
  }
}

export function ClubProvider({ children }: { children: ReactNode }) {
  const [clubColor, setClubColor] = useState(() => load('llc-club-color') ?? DEFAULT_CLUB_COLOR)
  const [readable, setReadable] = useState(() => load('llc-readable') === '1')

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--club', clubColor)
    root.style.setProperty('--club-text', textOn(clubColor))
    save('llc-club-color', clubColor)
  }, [clubColor])

  useEffect(() => {
    document.documentElement.classList.toggle('readable', readable)
    save('llc-readable', readable ? '1' : '0')
  }, [readable])

  return <ClubContext.Provider value={{ clubColor, setClubColor, readable, setReadable }}>{children}</ClubContext.Provider>
}

export function useClub() {
  const c = useContext(ClubContext)
  if (!c) throw new Error('useClub outside ClubProvider')
  return c
}

/* Team colours: a closed palette (no free hex), never bright red/green so a team
 * never reads as an error/success. Always shown as a small dot + the team name. */
export const TEAMS = {
  U9: { name: 'U9 Mini-basket', color: '#2f855a' },
  U11: { name: 'U11 Mixte', color: '#0e7490' },
  U13: { name: 'U13', color: '#4f46e5' },
  U15: { name: 'U15 Masculins', color: '#6d28d9' },
  U18: { name: 'U18 Féminines', color: '#be185d' },
  Seniors: { name: 'Seniors', color: '#b45309' },
  Club: { name: 'Club', color: '#8a847b' },
} as const
export type TeamKey = keyof typeof TEAMS

export function TeamDot({ team, label, className = '' }: { team: TeamKey; label?: string; className?: string }) {
  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 text-[13px] text-text-secondary ${className}`}>
      <span className="size-2 shrink-0 rounded-full" style={{ background: TEAMS[team].color }} aria-hidden />
      {label ?? team}
    </span>
  )
}
