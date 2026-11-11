import type { ReactNode } from 'react'
import { Lock } from 'lucide-react'

/** Disabled action with a lock and the reason written under it — for rules that
 *  depend on a role rather than on a permission of the matrix (e.g. the
 *  president's second validation). Same look as `requires` on ButtonPrimary. */
export function LockedButton({ children, reason }: { children: ReactNode; reason: string }) {
  return (
    <span className="inline-flex flex-col gap-1">
      <button
        type="button"
        disabled
        title={reason}
        className="inline-flex h-11 cursor-not-allowed items-center justify-center rounded-md bg-action-primary px-[18px] text-sm font-semibold whitespace-nowrap text-text-inverse opacity-45"
      >
        <Lock className="mr-2 size-4" aria-hidden />
        {children}
      </button>
      <span className="max-w-[240px] text-xs text-text-secondary">{reason}</span>
    </span>
  )
}
