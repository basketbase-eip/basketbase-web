// Figma: 24:3165 "Prototype · Paiement approuvé" — replaced: the full-page confirmation is gone (research report,
// « Des retours d'action qui rassurent sans interrompre »). The action now ends
// with a toast on the screen itself; old links land back there.
import { Navigate } from 'react-router-dom'
import { to } from '../routes'

export default function PaiementOk() {
  return <Navigate to={to('remboursement')} replace />
}
