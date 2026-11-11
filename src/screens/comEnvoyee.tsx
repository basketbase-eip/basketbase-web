// Figma: 24:3199 "Prototype · Communication envoyée" — replaced: the full-page confirmation is gone (research report,
// « Des retours d'action qui rassurent sans interrompre »). The action now ends
// with a toast on the screen itself; old links land back there.
import { Navigate } from 'react-router-dom'
import { to } from '../routes'

export default function ComEnvoyee() {
  return <Navigate to={to('aEnvoyer')} replace />
}
