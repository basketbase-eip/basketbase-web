import { useSyncExternalStore } from 'react'
import type { Role } from '../../roles'

/* Volunteer slots of the weekend, shared by Planning, Missions and the
 * replacement flow. Local, in-memory state only (prototype): it survives
 * navigation between screens but not a reload. */

export type Slot = {
  id: string
  when: string
  event: string
  mission: string
  filled: number
  total: number
  /** Who is alerted when someone drops out. */
  organiser: string
}

export const SLOTS: Slot[] = [
  { id: 'sam-0900-accueil', when: 'Sam. 09:00', event: 'U11 · match', mission: 'Accueil', filled: 2, total: 2, organiser: 'Nadia Benali' },
  { id: 'sam-1730-ouverture', when: 'Sam. 17:30', event: 'U15 · match', mission: 'Ouverture', filled: 1, total: 1, organiser: 'Nadia Benali' },
  { id: 'sam-1800-buvette', when: 'Sam. 18:00', event: 'U15 · match', mission: 'Buvette', filled: 1, total: 2, organiser: 'Nadia Benali' },
  { id: 'sam-1815-table', when: 'Sam. 18:15', event: 'U15 · match', mission: 'Table de marque', filled: 1, total: 2, organiser: 'Romain Petit' },
  { id: 'sam-2015-buvette', when: 'Sam. 20:15', event: 'Seniors · match', mission: 'Buvette', filled: 2, total: 2, organiser: 'Nadia Benali' },
  { id: 'dim-0830-install', when: 'Dim. 08:30', event: 'Tournoi U9', mission: 'Installation', filled: 4, total: 4, organiser: 'Nadia Benali' },
  { id: 'dim-1200-resto', when: 'Dim. 12:00', event: 'Tournoi U9', mission: 'Restauration', filled: 3, total: 4, organiser: 'Nadia Benali' },
  { id: 'dim-1530-table', when: 'Dim. 15:30', event: 'Seniors · match', mission: 'Table de marque', filled: 2, total: 2, organiser: 'Romain Petit' },
]

/** Slots held by the person behind each role ("Voir en tant que"). */
export const MY_SLOTS: Record<Role, string[]> = {
  president: ['sam-0900-accueil'],
  secretaire: ['dim-0830-install'],
  tresorier: ['sam-2015-buvette'],
  entraineur: [],
  officiels: ['sam-1815-table'],
  benevole: ['dim-1530-table'],
  parent: ['sam-1800-buvette'],
}

/** Open slots each role may volunteer for (qualified, available). */
export const CAN_OFFER: Partial<Record<Role, string[]>> = {
  benevole: ['sam-1815-table', 'dim-1200-resto'],
  parent: ['dim-1200-resto'],
}

type State = { released: Record<string, string>; offered: string[]; filledByReplacement: string[] }
let state: State = { released: {}, offered: [], filledByReplacement: [] }
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())

export const slotStore = {
  subscribe(l: () => void) {
    listeners.add(l)
    return () => listeners.delete(l)
  },
  get: () => state,
  /** "Je ne peux plus venir" (motif optional). */
  release(id: string, motif: string) {
    state = { ...state, released: { ...state.released, [id]: motif } }
    emit()
  },
  restore(id: string) {
    const released = { ...state.released }
    delete released[id]
    state = { ...state, released }
    emit()
  },
  toggleOffer(id: string) {
    state = { ...state, offered: state.offered.includes(id) ? state.offered.filter((x) => x !== id) : [...state.offered, id] }
    emit()
  },
  setFilledByReplacement(id: string, on: boolean) {
    const rest = state.filledByReplacement.filter((x) => x !== id)
    state = { ...state, filledByReplacement: on ? [...rest, id] : rest }
    emit()
  },
}

export function useSlots() {
  const s = useSyncExternalStore(slotStore.subscribe, slotStore.get, slotStore.get)
  const filledOf = (slot: Slot) =>
    Math.min(slot.total, slot.filled - (s.released[slot.id] !== undefined ? 1 : 0) + (s.filledByReplacement.includes(slot.id) ? 1 : 0))
  return { state: s, filledOf }
}

/** Organiser alerted for a slot; if that is me, the alert goes to the president. */
export function organiserFor(slot: Slot, me: string) {
  return slot.organiser === me ? 'Camille Martin' : slot.organiser
}
