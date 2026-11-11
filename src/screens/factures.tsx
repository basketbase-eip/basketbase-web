// Figma: 24:2178 "Desktop · Finances · Factures"
import { useState } from 'react'
import { AppLayout } from '../components/AppLayout'
import { Badge, Breadcrumb, Card, type Tone } from '../components/ui'
import { CompactHeader, DataTable, FilterTabs, MetricGrid, SmallButton, SmallMetric, type TableRow } from '../components/finances/parts'

/** `payable` = supplier invoice still to be paid by the club. */
type Invoice = { ref: string; party: string; due: string; amount: string; state: string; tone?: Tone; payable?: boolean }

const invoices: Invoice[] = [
  { ref: 'FAC-2026-041', party: 'Ville de Lyon', due: '22 sept.', amount: '2 800 €', state: 'À encaisser', tone: 'info' },
  { ref: 'FR-8841', party: 'Équipement Sport', due: '19 sept.', amount: '1 460 €', state: 'À valider', payable: true },
  { ref: 'FR-8820', party: 'Autocars Rhône', due: '15 sept.', amount: '620 €', state: 'En retard', payable: true },
  { ref: 'FAC-2026-039', party: 'Sponsor Nova', due: '30 sept.', amount: '3 500 €', state: 'Envoyée', tone: 'info' },
]

const FILTERS = ['Toutes', 'À valider', 'À payer', 'En retard']
const match = (i: Invoice, f: string) => f === 'Toutes' || (f === 'À payer' ? !!i.payable : i.state === f)

export default function Factures() {
  const [filter, setFilter] = useState('Toutes')
  const rows: TableRow[] = invoices
    .filter((i) => match(i, filter))
    .map((i) => ({
      cells: [
        i.ref,
        i.party,
        i.due,
        i.amount,
        <Badge size="sm" tone={i.tone}>
          {i.state}
        </Badge>,
      ],
    }))

  return (
    <AppLayout>
      <Breadcrumb items={[{ label: 'Accueil', to: 'aujourdhui' }, { label: 'Finances', to: 'finances' }, { label: 'Factures' }]} />

      <CompactHeader title="Factures" subtitle="Centraliser émission, réception, validation et paiement.">
        <SmallButton primary requires="finances">
          Créer une facture
        </SmallButton>
      </CompactHeader>

      <MetricGrid>
        <SmallMetric label="À ENCAISSER" value="8 420 €" hint="6 factures" />
        <SmallMetric label="À PAYER" value="5 860 €" hint="9 factures" />
        <SmallMetric label="EN RETARD" value="1 240 €" hint="3 factures" />
        <SmallMetric label="À VALIDER" value="4" hint="cette semaine" />
      </MetricGrid>

      <FilterTabs options={FILTERS} initial="Toutes" onChange={setFilter} />

      {rows.length > 0 ? (
        <DataTable
          cols={[320, 230, 180, 150, 160]}
          head={['Facture', 'Tiers', 'Échéance', 'Montant', 'État']}
          rows={rows}
          minWidth={720}
          className="lg:min-h-[360px]"
        />
      ) : (
        <Card>
          <p className="text-sm font-semibold">Aucune facture pour le filtre « {filter} »</p>
          <p className="text-xs text-text-secondary">Choisissez « Toutes » pour revoir l’ensemble des factures récentes.</p>
        </Card>
      )}
    </AppLayout>
  )
}
