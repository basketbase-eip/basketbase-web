import type { ComponentProps } from 'react'
import { Link } from 'react-router-dom'
import { R, type RouteKey } from '../routes'
import { canOpen } from '../nav'
import { useRole } from '../roles'

/* Role-aware link: a link to a page the current role cannot open is rendered as
 * inert, dimmed text with an explanation, so nobody lands on a "no access" page. */

const PATH_TO_KEY = Object.fromEntries(Object.entries(R).map(([k, v]) => [v.path, k])) as Record<string, RouteKey>

export function RLink(props: ComponentProps<typeof Link>) {
  const { role, can } = useRole()
  const path = typeof props.to === 'string' ? props.to : props.to.pathname ?? ''
  const key = PATH_TO_KEY[path]
  if (key && !canOpen(key, role, can)) {
    return (
      <span className={`${props.className ?? ''} cursor-not-allowed opacity-50`} title="Réservé à d’autres rôles du club" aria-disabled="true">
        {props.children as React.ReactNode}
      </span>
    )
  }
  return <Link {...props} />
}
