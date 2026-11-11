import { useState } from 'react'
import { CalendarClock } from 'lucide-react'
import { useRole } from '../../roles'
import { useFeedback } from '../feedback'
import { Badge, ButtonSecondary, Card } from '../ui'
import { MY_SLOTS, SLOTS, organiserFor, slotStore, useSlots } from './slots'

/* "Mes créneaux": the current person's own slots, each with
 * « Je ne peux plus venir » (optional motif) → the slot becomes « À pourvoir »
 * and the organiser is alerted at once. Reversible: toast with « Annuler ». */

export function MySlots({ hideWhenEmpty = false }: { hideWhenEmpty?: boolean }) {
  const { role, me } = useRole()
  const { toast } = useFeedback()
  const { state } = useSlots()
  const [open, setOpen] = useState<string | null>(null)
  const [motif, setMotif] = useState('')
  const mine = SLOTS.filter((s) => MY_SLOTS[role].includes(s.id))

  if (mine.length === 0 && hideWhenEmpty) return null

  const release = (id: string) => {
    const slot = SLOTS.find((s) => s.id === id)!
    const who = organiserFor(slot, me.person)
    slotStore.release(id, motif.trim())
    setOpen(null)
    setMotif('')
    toast({
      message: `Absence signalée. Le créneau ${slot.mission.toLowerCase()} est à pourvoir et ${who} est prévenu·e.`,
      undo: () => slotStore.restore(id),
    })
  }

  return (
    <Card padding="p-5 sm:p-[22px]">
      <div className="flex items-center gap-2">
        <CalendarClock className="size-5" aria-hidden />
        <h2 className="text-lg font-bold">Mes créneaux</h2>
      </div>
      {mine.length === 0 ? (
        <p className="text-[13px] text-text-secondary">Aucun créneau à votre nom ce week-end.</p>
      ) : (
        <ul className="flex flex-col">
          {mine.map((s) => {
            const released = state.released[s.id] !== undefined
            const motifSaved = state.released[s.id]
            return (
              <li key={s.id} className="flex flex-col gap-3 border-b border-border-default py-3 last:border-b-0">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold">
                      {s.when} · {s.mission}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {s.event} · {me.person}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    {released ? <Badge>À pourvoir</Badge> : <Badge>Confirmé</Badge>}
                    {!released && open !== s.id && (
                      <ButtonSecondary wide={false} onClick={() => setOpen(s.id)}>
                        Je ne peux plus venir
                      </ButtonSecondary>
                    )}
                  </div>
                </div>
                {released && (
                  <p className="text-xs text-text-secondary">
                    Vous avez signalé votre absence{motifSaved ? ` (« ${motifSaved} »)` : ''}. {organiserFor(s, me.person)} cherche un
                    remplaçant.
                  </p>
                )}
                {!released && open === s.id && (
                  <div className="flex flex-col gap-3 rounded-md bg-bg-subtle p-3">
                    <label className="flex flex-col gap-1.5 text-xs font-semibold">
                      Motif (facultatif, visible par l’organisateur)
                      <textarea
                        value={motif}
                        onChange={(e) => setMotif(e.target.value)}
                        rows={2}
                        placeholder="Par exemple : malade, empêchement professionnel…"
                        className="rounded-md border border-border-default bg-bg-surface p-2.5 text-[13px] font-normal"
                      />
                    </label>
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => release(s.id)}
                        className="inline-flex h-11 items-center justify-center rounded-md bg-action-primary px-[18px] text-sm font-semibold text-text-inverse"
                      >
                        Confirmer mon absence
                      </button>
                      <ButtonSecondary
                        wide={false}
                        onClick={() => {
                          setOpen(null)
                          setMotif('')
                        }}
                      >
                        Garder mon créneau
                      </ButtonSecondary>
                    </div>
                    <p className="text-xs text-text-secondary">
                      Le créneau passera à « À pourvoir » et {organiserFor(s, me.person)} sera prévenu·e immédiatement.
                    </p>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}
