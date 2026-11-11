import type { ComponentType } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { R, type RouteKey } from './routes'
import { AppLayout } from './components/AppLayout'
import { PageHeader } from './components/ui'
import { RoleProvider } from './roles'
import { ClubProvider } from './club'
import { FeedbackProvider } from './components/feedback'

// Each screen lives in src/screens/<routeKey>.tsx and default-exports its component.
const modules = import.meta.glob<{ default: ComponentType }>('./screens/*.tsx', { eager: true })
const screens: Partial<Record<RouteKey, ComponentType>> = {}
for (const [file, mod] of Object.entries(modules)) {
  const key = file.replace('./screens/', '').replace('.tsx', '') as RouteKey
  screens[key] = mod.default
}

function Missing() {
  return (
    <AppLayout section="accueil" active="aujourdhui">
      <PageHeader title="Écran en cours de construction" />
    </AppLayout>
  )
}

export default function App() {
  return (
    // HashRouter: works on any static host without server rewrites
    <ClubProvider>
      <RoleProvider>
        <FeedbackProvider>
          <HashRouter>
            <Routes>
              {/* « À traiter » and « Changer d’espace » are absorbed by the role-based home and the visible sidebar */}
              <Route path={R.aTraiter.path} element={<Navigate to="/" replace />} />
              <Route path={R.espaces.path} element={<Navigate to="/" replace />} />
              {(Object.keys(R) as RouteKey[])
                .filter((k) => k !== 'aTraiter' && k !== 'espaces')
                .map((k) => {
                  const Screen = screens[k] ?? Missing
                  return <Route key={k} path={R[k].path} element={<Screen />} />
                })}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </HashRouter>
        </FeedbackProvider>
      </RoleProvider>
    </ClubProvider>
  )
}
