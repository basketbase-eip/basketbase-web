import { useEffect, useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, Lock, Menu, Search, X } from 'lucide-react'
import { R, to, type RouteKey, type Section } from '../routes'
import { BOTTOM_BAR, SHORT_LABEL, canOpen, iconFor, menuKeyFor, visibleGroups, type NavGroup } from '../nav'
import { ROLES, useRole, type Role } from '../roles'
import { todoCount } from '../data/todos'
import { SearchField, SearchPalette } from './SearchPalette'
import { ButtonPrimary } from './ui'
import { TEAMS, useClub, type TeamKey } from '../club'

/* Navigation (research report, "Une barre latérale visible, élaguée par rôle"):
 * - every space the role can use is always visible, with an icon AND a label;
 * - the current space is expanded, the current page highlighted (from the URL);
 * - search is always visible; Ctrl/⌘ K or "/" opens it from anywhere;
 * - mobile: bottom bar with 4 destinations + a labelled "Menu" (NN/g combo pattern);
 * - "Voir en tant que" lets the prototype be tested role by role. */

const PATH_TO_KEY = Object.fromEntries(Object.entries(R).map(([k, v]) => [v.path, k])) as Record<string, RouteKey>

function useCurrentKey(): RouteKey {
  const { pathname } = useLocation()
  return PATH_TO_KEY[pathname] ?? 'aujourdhui'
}

function GroupNav({ group, current }: { group: NavGroup; current: RouteKey }) {
  const active = menuKeyFor(current)
  const inGroup = group.items.some((i) => i.to === active)
  const Icon = group.icon
  const single = group.items.length === 1
  const { role } = useRole()
  const count = group.id === 'accueil' ? todoCount(role) : 0

  const head = (
    <Link
      to={to(group.items[0].to)}
      aria-current={single && inGroup ? 'page' : undefined}
      className={`relative flex h-11 w-full items-center gap-3 rounded-md px-3 text-[15px] font-medium transition-colors lg:h-10 ${
        inGroup ? 'bg-bg-subtle text-text-primary' : 'text-text-secondary hover:bg-bg-subtle/70 hover:text-text-primary'
      }`}
    >
      {inGroup && <span className="absolute inset-y-2.5 left-0 w-[3px] rounded-full bg-club" aria-hidden />}
      <Icon className="size-5 shrink-0" strokeWidth={1.9} aria-hidden />
      <span className="flex-1 truncate">{group.label}</span>
      {count > 0 && (
        <span className="rounded-sm bg-action-primary px-1.5 text-xs leading-5 font-semibold text-text-inverse" aria-label={`${count} à traiter`}>
          {count}
        </span>
      )}
      {!single && <ChevronDown className={`size-4 shrink-0 text-text-secondary transition-transform ${inGroup ? '' : '-rotate-90'}`} aria-hidden />}
    </Link>
  )
  return (
    <li>
      {head}
      {!single && inGroup && (
        <ul className="mt-1 mb-1 ml-[21px] flex flex-col gap-0.5 border-l border-border-default pl-3">
          {group.items.map((i) => (
            <li key={i.to}>
              <Link
                to={to(i.to)}
                aria-current={i.to === active ? 'page' : undefined}
                className={`flex h-10 items-center rounded-md px-3 text-sm transition-colors lg:h-9 ${
                  i.to === active ? 'font-semibold text-text-primary' : 'text-text-secondary hover:bg-bg-subtle/70 hover:text-text-primary'
                }`}
              >
                {i.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

function MyTeams() {
  const { role, can } = useRole()
  // Only shown to roles that can open team pages (coach: their team; bureau: all teams).
  if (!canOpen('equipeU15', role, can)) return null
  const keys: TeamKey[] = role === 'entraineur' ? ['U15'] : ['U9', 'U11', 'U13', 'U15', 'U18', 'Seniors']
  const target = (k: TeamKey): RouteKey => (k === 'U15' || !canOpen('equipes', role, can) ? 'equipeU15' : 'equipes')
  return (
    <div>
      <p className="px-3 pb-1 text-[13px] font-medium text-text-tertiary">{keys.length > 1 ? 'Équipes' : 'Mon équipe'}</p>
      <ul className="flex flex-col">
        {keys.map((k) => (
          <li key={k}>
            <Link
              to={to(target(k))}
              className="flex h-10 items-center gap-2.5 rounded-md px-3 text-sm text-text-secondary hover:bg-bg-subtle/70 hover:text-text-primary lg:h-9"
            >
              <span className="size-2 shrink-0 rounded-full" style={{ background: TEAMS[k].color }} aria-hidden />
              {TEAMS[k].name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function RoleSwitcher() {
  const { role, setRole, me } = useRole()
  const { readable, setReadable } = useClub()
  return (
    <div className="border-t border-border-default pt-3">
      <div className="flex items-center gap-2.5 px-1">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-club text-xs font-semibold text-club-text" aria-hidden>
          {me.person
            .split(' ')
            .map((p) => p[0])
            .join('')}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{me.person}</p>
          <p className="truncate text-[13px] text-text-secondary">{me.title}</p>
        </div>
      </div>
      <label className="mt-3 flex min-h-10 cursor-pointer items-center gap-2.5 px-1 text-sm">
        <input
          type="checkbox"
          checked={readable}
          onChange={(e) => setReadable(e.target.checked)}
          className="size-[18px] accent-[var(--color-action-primary)]"
        />
        Lisibilité renforcée
      </label>
      <label className="mt-2 block px-1 text-[13px] font-medium text-text-tertiary" htmlFor="role-switch">
        Voir en tant que (prototype)
      </label>
      <select
        id="role-switch"
        value={role}
        onChange={(e) => setRole(e.target.value as Role)}
        className="mt-1 h-10 w-full rounded-md border border-border-strong bg-bg-surface px-2 text-sm"
      >
        {ROLES.map((r) => (
          <option key={r.id} value={r.id}>
            {r.label}
          </option>
        ))}
      </select>
    </div>
  )
}

function SidebarContent({ current }: { current: RouteKey }) {
  const { role, can } = useRole()
  const groups = visibleGroups(role, can)
  return (
    <div className="flex min-h-full flex-col">
      <div className="h-1 shrink-0 bg-club" aria-hidden />
      <div className="flex flex-1 flex-col gap-5 px-4 pt-5 pb-4">
        <Link to={to('aujourdhui')} className="flex h-10 items-center gap-3 px-1">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-club text-xs font-semibold text-club-text" aria-hidden>
            LLC
          </span>
          <span className="leading-tight">
            <span className="block text-[15px] font-semibold">LLC Basket</span>
            <span className="block text-[13px] text-text-secondary">Saison 2026–2027</span>
          </span>
        </Link>
        <nav aria-label="Navigation principale" className="flex flex-1 flex-col justify-between gap-4">
          <div className="flex flex-col gap-5">
            <ul className="flex flex-col gap-0.5">
              {groups
                .filter((g) => !g.footer)
                .map((g) => (
                  <GroupNav key={g.id} group={g} current={current} />
                ))}
            </ul>
            <MyTeams />
          </div>
          <ul className="flex flex-col gap-0.5">
            {groups
              .filter((g) => g.footer)
              .map((g) => (
                <GroupNav key={g.id} group={g} current={current} />
              ))}
          </ul>
        </nav>
        <RoleSwitcher />
      </div>
    </div>
  )
}

function NoAccess() {
  const { me } = useRole()
  return (
    <div className="flex flex-col items-start gap-4 rounded-lg border border-border-default bg-bg-surface p-6 sm:p-8">
      <Lock className="size-8 text-text-secondary" aria-hidden />
      <div>
        <h1 className="text-xl font-semibold">Cette page n’est pas accessible avec votre rôle</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Vous êtes connecté·e en tant que {me.title}. Demandez au bureau si vous pensez avoir besoin de cet accès.
        </p>
      </div>
      <ButtonPrimary to="aujourdhui">Retour à l’accueil</ButtonPrimary>
    </div>
  )
}

export function AppLayout({
  children,
}: {
  /** Kept for compatibility: the menu position is now derived from the URL. */
  section?: Section
  active?: RouteKey
  children: ReactNode
}) {
  const [drawer, setDrawer] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { pathname } = useLocation()
  const current = useCurrentKey()
  const { role, can } = useRole()
  const allowed = canOpen(current, role, can)

  useEffect(() => {
    setDrawer(false)
    window.scrollTo(0, 0)
    document.getElementById('main')?.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const bottom = BOTTOM_BAR[role].filter((k) => canOpen(k, role, can))
  const activeMenu = menuKeyFor(current)

  return (
    <div className="flex min-h-full bg-bg-page lg:h-full">
      {/* Desktop sidebar: always visible */}
      <aside className="sticky top-0 hidden h-screen w-[264px] shrink-0 overflow-y-auto border-r border-border-default bg-bg-surface lg:block">
        <SidebarContent current={current} />
      </aside>

      {/* Mobile full menu (opened from the bottom bar "Menu") */}
      <div className={`fixed inset-0 z-50 lg:hidden ${drawer ? '' : 'pointer-events-none'}`} aria-hidden={!drawer}>
        <div className={`absolute inset-0 bg-black/30 transition-opacity ${drawer ? 'opacity-100' : 'opacity-0'}`} onClick={() => setDrawer(false)} />
        <aside
          className={`absolute inset-y-0 left-0 w-[290px] max-w-[88vw] overflow-y-auto bg-bg-surface shadow-xl transition-transform ${
            drawer ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <button
            type="button"
            onClick={() => setDrawer(false)}
            className="absolute top-4 right-3 flex size-10 items-center justify-center rounded-md"
            aria-label="Fermer le menu"
          >
            <X className="size-5" aria-hidden />
          </button>
          <SidebarContent current={current} />
        </aside>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar: search always visible */}
        <div className="sticky top-0 z-30 border-b border-border-default bg-bg-surface lg:static">
          <div className="h-1 bg-club lg:hidden" aria-hidden />
          <div className="flex h-15 items-center gap-3 px-4 lg:h-[60px] lg:px-8">
            <Link to={to('aujourdhui')} className="flex items-center gap-2 lg:hidden" aria-label="Accueil LLC Bureau">
              <span className="flex size-9 items-center justify-center rounded-lg bg-club text-xs font-semibold text-club-text" aria-hidden>
                LLC
              </span>
            </Link>
            <div className="hidden flex-1 lg:block">
              <SearchField onOpen={() => setSearchOpen(true)} />
            </div>
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex h-11 flex-1 items-center gap-2 rounded-md bg-bg-subtle px-3 text-[15px] text-text-secondary lg:hidden"
            >
              <Search className="size-[18px]" aria-hidden />
              Rechercher
            </button>
          </div>
        </div>

        <main id="main" className="flex min-w-0 flex-1 flex-col p-4 pb-28 sm:p-6 sm:pb-28 lg:overflow-y-auto lg:p-8">
          <div className="mx-auto flex w-full max-w-[1136px] flex-col gap-6 lg:gap-8">{allowed ? children : <NoAccess />}</div>
        </main>
      </div>

      {/* Mobile bottom bar: 4 destinations + Menu, all labelled, 56px targets */}
      <nav
        aria-label="Navigation rapide"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border-default bg-bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        <ul className="grid grid-cols-5">
          {bottom.map((k) => {
            const Icon = iconFor(k)
            const on = activeMenu === k || (k === 'weekEnd' && current.startsWith('match'))
            return (
              <li key={k}>
                <Link
                  to={to(k)}
                  aria-current={on ? 'page' : undefined}
                  className={`flex h-16 flex-col items-center justify-center gap-1 text-xs ${on ? 'font-semibold text-text-primary shadow-[inset_0_3px_0_var(--color-club)]' : 'text-text-secondary'}`}
                >
                  <Icon className="size-5" aria-hidden />
                  {SHORT_LABEL[k] ?? k}
                </Link>
              </li>
            )
          })}
          <li className="col-start-5">
            <button
              type="button"
              onClick={() => setDrawer(true)}
              className="flex h-16 w-full flex-col items-center justify-center gap-1 text-xs text-text-secondary"
            >
              <Menu className="size-5" aria-hidden />
              Menu
            </button>
          </li>
        </ul>
      </nav>

      <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}
