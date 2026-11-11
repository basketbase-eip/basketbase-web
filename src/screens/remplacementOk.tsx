// Figma: 24:3131 "Prototype · Remplacement confirmé" — replaced: the full-page confirmation is gone (research report,
// « Des retours d'action qui rassurent sans interrompre »). The action now ends
// with a toast on the screen itself; old links land back there.
import { Navigate } from 'react-router-dom'
import { to } from '../routes'

export default function RemplacementOk() {
  return <Navigate to={to('remplacement')} replace />
}
