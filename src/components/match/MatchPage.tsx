// Shared frame of the 7 "Prototype · Match U15 · …" screens (24:244, 69:840 … 69:1525):
// breadcrumb, header, tab bar, readiness banner and the three detail cards.
// Each screen only supplies its active tab and its data.
import type { ReactNode } from 'react'
import { RLink as Link } from '../RLink'
import { AppLayout } from '../AppLayout'
import { Breadcrumb, ButtonPrimary, ButtonSecondary, Card, PageHeader, Row } from '../ui'
import { to, type RouteKey } from '../../routes'
import { useRole } from '../../roles'

export type MatchTab = 'matchPreparation' | 'matchVue' | 'matchEquipe' | 'matchBenevoles' | 'matchBuvette' | 'matchMateriel' | 'matchFinances' | 'matchMessages'

const TABS: { label: string; to: MatchTab }[] = [
  { label: 'Préparation', to: 'matchPreparation' },
  { label: 'Vue générale', to: 'matchVue' },
  { label: 'Équipe', to: 'matchEquipe' },
  { label: 'Bénévoles', to: 'matchBenevoles' },
  { label: 'Buvette', to: 'matchBuvette' },
  { label: 'Matériel', to: 'matchMateriel' },
  { label: 'Finances', to: 'matchFinances' },
  { label: 'Messages', to: 'matchMessages' },
]

/** Figma "Tabs": 120px tabs, h 36, radius 9; the active one is a white bordered pill.
 *  Scrolls horizontally when it doesn't fit (mobile). */
export function MatchTabs({ active }: { active: MatchTab }) {
  return (
    <nav aria-label="Sections du match" className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <ul className="flex h-11 w-max gap-2">
        {TABS.map((t) => {
          const isActive = t.to === active
          return (
            <li key={t.to}>
              <Link
                to={to(t.to)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex h-11 min-w-[120px] items-center justify-center rounded-md border px-3 text-[13px] whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-border-default bg-bg-surface font-semibold text-text-primary'
                    : 'border-transparent text-text-secondary hover:bg-bg-surface/60 hover:text-text-primary'
                }`}
              >
                {t.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

function CardHeading({ children }: { children: string }) {
  return <h2 className="text-lg font-bold">{children}</h2>
}

type Pair = [string, string]

export type MatchPageProps = {
  tab: MatchTab
  banner: { title: string; subtitle: string; secondary: string; primary: string }
  /** Left card: short key (time, count, status…) + label. */
  timeline: { title: string; rows: Pair[]; action: string }
  /** Middle card: label on the left, status on the right. */
  missions: { title: string; rows: Pair[]; action: string }
  /** Right card: two-line control rows. */
  controls: { title: string; rows: Pair[]; action: string }
}

// Prototype links are identical on every match tab (docs/prototype-links.md).
const LINKS = {
  close: 'finances',
  bannerSecondary: 'aEnvoyer',
  bannerPrimary: 'remplacement',
  missions: 'missions',
  controls: 'evRessources',
} satisfies Record<string, RouteKey>

/** Breadcrumb, header and tab bar shared by every match tab (Préparation included). */
export function MatchFrame({ tab, children }: { tab: MatchTab; children: ReactNode }) {
  const { can } = useRole()
  return (
    <AppLayout>
      <Breadcrumb
        items={[
          { label: 'Accueil', to: 'aujourdhui' },
          // Volunteers and parents can open the match but not the events space.
          { label: 'Événements', to: can('matchPrep') ? 'weekEnd' : undefined },
          { label: 'Match U15' },
        ]}
      />

      <PageHeader title="U15 · LLC vs USV" subtitle="Samedi 14 septembre · 18:30 · Gymnase des Berges">
        <ButtonSecondary>Exporter</ButtonSecondary>
        <ButtonPrimary to={LINKS.close} requires="matchPrep">
          Clôturer après le match
        </ButtonPrimary>
      </PageHeader>

      <MatchTabs active={tab} />

      {children}
    </AppLayout>
  )
}

export function MatchPage({ tab, banner, timeline, missions, controls }: MatchPageProps) {
  return (
    <MatchFrame tab={tab}>

      {/* Figma "Event readiness" */}
      <section className="flex flex-col gap-5 rounded-lg border border-border-default bg-bg-surface px-5 py-5 sm:px-6 sm:py-[22px] md:min-h-[126px] md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 flex-col gap-1.5">
          <p className="text-xl font-bold">{banner.title}</p>
          <p className="text-[13px] text-text-secondary">{banner.subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonSecondary to={LINKS.bannerSecondary}>{banner.secondary}</ButtonSecondary>
          <ButtonPrimary to={LINKS.bannerPrimary}>{banner.primary}</ButtonPrimary>
        </div>
      </section>

      {/* Figma "Event detail columns": 344 / 400 / 344 */}
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 xl:grid-cols-[344fr_400fr_344fr]">
        <Card padding="p-5 sm:p-[22px]">
          <CardHeading>{timeline.title}</CardHeading>
          <ul className="flex flex-col gap-3">
            {timeline.rows.map(([k, v]) => (
              <li key={k + v} className="flex items-start gap-3.5 text-xs">
                <span className="min-h-[18px] w-[50px] shrink-0 font-semibold">{k}</span>
                <span className="text-text-secondary">{v}</span>
              </li>
            ))}
          </ul>
          <div>
            <ButtonSecondary>{timeline.action}</ButtonSecondary>
          </div>
        </Card>

        <Card padding="p-5 sm:p-[22px]">
          <CardHeading>{missions.title}</CardHeading>
          <div>
            {missions.rows.map(([k, v]) => (
              <Row key={k} className="min-h-[46px] text-xs" right={<span className="shrink-0 text-right text-text-secondary">{v}</span>}>
                <span className="font-semibold">{k}</span>
              </Row>
            ))}
          </div>
          <div>
            <ButtonPrimary to={LINKS.missions}>{missions.action}</ButtonPrimary>
          </div>
        </Card>

        <Card padding="p-5 sm:p-[22px]">
          <CardHeading>{controls.title}</CardHeading>
          <ul className="flex flex-col items-start gap-3">
            {controls.rows.map(([k, v]) => (
              <li key={k} className="flex flex-col gap-[3px] border-b border-border-default pb-[9px] text-xs">
                <span className="font-semibold">{k}</span>
                <span className="text-text-secondary">{v}</span>
              </li>
            ))}
          </ul>
          <div>
            <ButtonSecondary to={LINKS.controls}>{controls.action}</ButtonSecondary>
          </div>
        </Card>
      </div>
    </MatchFrame>
  )
}
