import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { CheckCircle2, Info, X } from 'lucide-react'

/* Feedback without interruption (research report, "Des retours d'action qui
 * rassurent sans interrompre"):
 * - toast(): short message, optional "Annuler" for reversible actions (≈8 s);
 * - confirm(): a focused dialog ONLY for irreversible / outward actions, naming
 *   the object and with buttons that describe the outcome. */

type ToastInput = { message: string; undo?: () => void; tone?: 'success' | 'info'; duration?: number }
type ToastItem = ToastInput & { id: number }

type ConfirmInput = {
  title: string
  body?: ReactNode
  confirmLabel: string // e.g. "Envoyer 84 messages"
  cancelLabel: string // e.g. "Ne pas envoyer"
  onConfirm: () => void
}

type Ctx = { toast: (t: ToastInput) => void; confirm: (c: ConfirmInput) => void; comingSoon: (what?: string) => void }
const FeedbackContext = createContext<Ctx | null>(null)

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const [dialog, setDialog] = useState<ConfirmInput | null>(null)
  const nextId = useRef(1)

  const dismiss = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), [])
  const toast = useCallback(
    (t: ToastInput) => {
      const id = nextId.current++
      setToasts((list) => [...list.slice(-2), { ...t, id }])
      setTimeout(() => dismiss(id), t.duration ?? (t.undo ? 8000 : 4500))
    },
    [dismiss],
  )
  const comingSoon = useCallback(
    (what?: string) => toast({ tone: 'info', message: `${what ? `« ${what} » : ` : ''}bientôt disponible dans cette version.` }),
    [toast],
  )

  return (
    <FeedbackContext.Provider value={{ toast, confirm: setDialog, comingSoon }}>
      {children}
      {/* Toasts: bottom on mobile (above the bottom bar), bottom-right on desktop */}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-20 z-[60] flex flex-col items-center gap-2 px-4 lg:bottom-6 lg:items-end lg:px-6">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-lg bg-action-primary px-4 py-3 text-sm text-text-inverse shadow-lg"
          >
            {t.tone === 'info' ? <Info className="size-5 shrink-0" aria-hidden /> : <CheckCircle2 className="size-5 shrink-0 text-[#7ee2a8]" aria-hidden />}
            <p className="min-w-0 flex-1">{t.message}</p>
            {t.undo && (
              <button
                type="button"
                className="shrink-0 rounded-md px-2 py-1 font-semibold underline underline-offset-2 hover:bg-white/10"
                onClick={() => {
                  t.undo!()
                  dismiss(t.id)
                  toast({ tone: 'info', message: 'Action annulée.' })
                }}
              >
                Annuler
              </button>
            )}
            <button type="button" aria-label="Fermer" className="shrink-0 rounded-md p-1 hover:bg-white/10" onClick={() => dismiss(t.id)}>
              <X className="size-4" aria-hidden />
            </button>
          </div>
        ))}
      </div>
      {dialog && <ConfirmDialog {...dialog} onClose={() => setDialog(null)} />}
    </FeedbackContext.Provider>
  )
}

function ConfirmDialog({ title, body, confirmLabel, cancelLabel, onConfirm, onClose }: ConfirmInput & { onClose: () => void }) {
  const cancelRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    cancelRef.current?.focus() // the risky button is never focused by default
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/40 p-4 sm:items-center" onClick={onClose}>
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="w-full max-w-md rounded-xl bg-bg-surface p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-title" className="text-lg font-bold">
          {title}
        </h2>
        {body && <div className="mt-2 text-sm text-text-secondary">{body}</div>}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            ref={cancelRef}
            type="button"
            onClick={onClose}
            className="inline-flex h-11 items-center justify-center rounded-md border border-border-default bg-bg-surface px-[18px] text-sm font-semibold hover:bg-bg-subtle"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              onClose()
              onConfirm()
            }}
            className="inline-flex h-11 items-center justify-center rounded-md bg-action-primary px-[18px] text-sm font-semibold text-text-inverse hover:bg-action-primary-hover"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export function useFeedback() {
  const c = useContext(FeedbackContext)
  if (!c) throw new Error('useFeedback outside FeedbackProvider')
  return c
}
