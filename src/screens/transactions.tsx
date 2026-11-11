// Figma: 24:1980 "Desktop · Finances · Transactions"
import { useState } from 'react'
import { AppLayout } from '../components/AppLayout'
import { Badge, Breadcrumb, Card, type Tone } from '../components/ui'
import { CompactHeader, DataTable, FilterTabs, MetricGrid, SmallButton, SmallMetric, type TableRow } from '../components/finances/parts'
import type { RouteKey } from '../routes'

type Op = { label: string; account: string; category: string; amount: string; state: string; tone?: Tone; imported?: boolean; to?: RouteKey }

const ops: Op[] = [
  { label: 'Cotisations septembre', account: 'Compte principal', category: 'Licences', amount: '+ 2 460 €', state: 'Rapprochée', tone: 'success', imported: true },
  { label: 'Achat pharmacie', account: 'Carte club', category: 'Matériel', amount: '− 186 €', state: 'Sans justificatif', tone: 'danger', to: 'remboursement' },
  { label: 'Recette buvette U15', account: 'Caisse événement', category: 'Événement', amount: '+ 742 €', state: 'À rapprocher' },
  { label: 'Transport équipe senior', account: 'Compte principal', category: 'Déplacement', amount: '− 620 €', state: 'Validée', imported: true },
]

const FILTERS = ['Toutes', 'À rapprocher', 'Sans justificatif', 'Importées']
const match = (o: Op, f: string) =>
  f === 'Toutes' || (f === 'Importées' ? !!o.imported : o.state === f)

export default function Transactions() {
  const [filter, setFilter] = useState('Toutes')
  const shown = ops.filter((o) => match(o, filter))
  const rows: TableRow[] = shown.map((o) => ({
    cells: [
      o.label,
      o.account,
      o.category,
      o.amount,
      <Badge size="sm" tone={o.tone}>
        {o.state}
      </Badge>,
    ],
    to: o.to,
  }))

  return (
    <AppLayout>
      <Breadcrumb items={[{ label: 'Accueil', to: 'aujourdhui' }, { label: 'Finances', to: 'finances' }, { label: 'Transactions' }]} />

      <CompactHeader title="Transactions" subtitle="Suivre, rapprocher et justifier chaque mouvement.">
        <SmallButton primary requires="finances">
          Ajouter une opération
        </SmallButton>
      </CompactHeader>

      <MetricGrid>
        <SmallMetric label="À RAPPROCHER" value="12" hint="3 urgentes" />
        <SmallMetric label="CETTE SEMAINE" value="+ 4 820 €" hint="entrées" />
        <SmallMetric label="CETTE SEMAINE" value="− 3 140 €" hint="sorties" />
        <SmallMetric label="PIÈCES MANQUANTES" value="4" hint="à relancer" />
      </MetricGrid>

      <FilterTabs options={FILTERS} initial="Toutes" onChange={setFilter} />

      {rows.length > 0 ? (
        <DataTable
          cols={[340, 190, 220, 150, 160]}
          head={['Opération', 'Compte', 'Catégorie', 'Montant', 'État']}
          rows={rows}
          minWidth={720}
          className="lg:min-h-[360px]"
        />
      ) : (
        <Card>
          <p className="text-sm font-semibold">Aucune opération pour le filtre « {filter} »</p>
          <p className="text-xs text-text-secondary">Choisissez « Toutes » pour revoir l’ensemble des mouvements récents.</p>
        </Card>
      )}
    </AppLayout>
  )
}
