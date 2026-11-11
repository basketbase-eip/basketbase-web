import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, CornerDownLeft, Search } from 'lucide-react'
import { INDEX, search, type SearchEntry, type SearchKind } from '../search'
import { canOpen } from '../nav'
import { useRole } from '../roles'
import { to } from '../routes'

const RECENT_KEY = 'llc-recent-search'
const ORDER: SearchKind[] = ['Actions', 'Pages', 'Matchs & événements', 'Personnes', 'Équipes', 'Documents']

function readRecent(): SearchEntry[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]')
  } catch {
    return []
  }
}

/** Always-visible search field (desktop) that opens the palette; ⌘K / Ctrl+K / "/" also open it. */
export function SearchField({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex h-10 w-full max-w-[440px] items-center gap-3 rounded-md bg-bg-subtle px-3 text-left text-sm text-text-secondary hover:bg-border-default/60"
    >
      <Search className="size-4 shrink-0" aria-hidden />
      <span className="flex-1 truncate">Rechercher une personne, une équipe, un match…</span>
      <kbd className="hidden rounded-md border border-border-default px-1.5 py-0.5 font-sans text-xs sm:inline">Ctrl K</kbd>
    </button>
  )
}

export function SearchPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const { role, can } = useRole()

  const allowed = useMemo(() => INDEX.filter((e) => canOpen(e.to, role, can)), [role, can])
  const results = useMemo(() => {
    if (!q.trim()) return readRecent().filter((e) => allowed.some((a) => a.label === e.label)).map((e) => ({ e, via: undefined as string | undefined }))
    return search(q, allowed)
  }, [q, allowed])

  const grouped = useMemo(() => {
    if (!q.trim()) return [['Récents', results]] as const
    return ORDER.map((k) => [k, results.filter((r) => r.e.kind === k)] as const).filter(([, l]) => l.length)
  }, [results, q])
  const flat = grouped.flatMap(([, l]) => l)

  useEffect(() => {
    if (open) {
      setQ('')
      setSel(0)
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [open])
  useEffect(() => setSel(0), [q])

  if (!open) return null

  const go = (e: SearchEntry) => {
    try {
      const rec = [e, ...readRecent().filter((r) => r.label !== e.label)].slice(0, 6)
      localStorage.setItem(RECENT_KEY, JSON.stringify(rec))
    } catch {
      /* ignore */
    }
    onClose()
    navigate(to(e.to))
  }

  let idx = -1
  return (
    <div className="fixed inset-0 z-[65] flex items-start justify-center bg-black/40 p-3 pt-[10vh]" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Recherche"
        className="flex max-h-[75vh] w-full max-w-xl flex-col overflow-hidden rounded-xl bg-bg-surface shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-border-default px-4">
          <Search className="size-5 shrink-0 text-text-secondary" aria-hidden />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') onClose()
              if (e.key === 'ArrowDown') {
                e.preventDefault()
                setSel((s) => Math.min(s + 1, flat.length - 1))
              }
              if (e.key === 'ArrowUp') {
                e.preventDefault()
                setSel((s) => Math.max(s - 1, 0))
              }
              if (e.key === 'Enter' && flat[sel]) go(flat[sel].e)
            }}
            placeholder="Personne, équipe, match, licence, « convoc »…"
            aria-label="Rechercher"
            className="h-14 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-text-secondary"
          />
          <button type="button" onClick={onClose} className="rounded-md border border-border-default px-2 py-1 text-xs text-text-secondary">
            Échap
          </button>
        </div>
        <div className="overflow-y-auto p-2">
          {flat.length === 0 && (
            <p className="px-3 py-8 text-center text-sm text-text-secondary">
              {q.trim() ? `Aucun résultat pour « ${q} ». Essayez un nom, une équipe (U15) ou un mot comme « licence ».` : 'Tapez un nom, une équipe, un match ou une action.'}
            </p>
          )}
          {grouped.map(([kind, list]) => (
            <div key={kind} className="mb-2">
              <p className="px-3 pt-2 pb-1 text-xs font-semibold text-text-secondary uppercase">{kind}</p>
              {list.map(({ e, via }) => {
                idx++
                const i = idx
                return (
                  <button
                    key={e.kind + e.label}
                    type="button"
                    onMouseEnter={() => setSel(i)}
                    onClick={() => go(e)}
                    className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left ${sel === i ? 'bg-bg-subtle' : ''}`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {via && <span className="font-normal text-text-secondary">{via} → </span>}
                        {e.label}
                      </p>
                      {e.meta && <p className="truncate text-xs text-text-secondary">{e.meta}</p>}
                    </div>
                    {sel === i ? <CornerDownLeft className="size-4 shrink-0 text-text-secondary" aria-hidden /> : <ArrowRight className="size-4 shrink-0 text-text-secondary/50" aria-hidden />}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
