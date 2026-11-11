// Figma: 24:3062 "Desktop · Paramètres"
import { useState, type FormEvent } from 'react'
import { AppLayout } from '../components/AppLayout'
import { Breadcrumb, ButtonPrimary, ButtonSecondary } from '../components/ui'
import { SimpleHeader } from '../components/divers/DataTable'
import { useFeedback } from '../components/feedback'
import { CLUB_PRESETS, DEFAULT_CLUB_COLOR, useClub } from '../club'
import { useRole } from '../roles'

const sections = ['Organisation', 'Identité visuelle', 'Utilisateurs & rôles', 'Notifications', 'Intégrations', 'Données & exports']

const fields = [
  { id: 'nom', label: 'Nom du club', type: 'text', initial: 'Lyon Lacroix Club' },
  { id: 'saison', label: 'Saison active', type: 'text', initial: '2026–2027' },
  { id: 'adresse', label: 'Adresse', type: 'text', initial: '12 avenue des Sports, Lyon' },
  { id: 'email', label: 'Email administratif', type: 'email', initial: 'bureau@llc-club.fr' },
] as const

type Values = Record<(typeof fields)[number]['id'], string>
const initialValues = Object.fromEntries(fields.map((f) => [f.id, f.initial])) as Values

export default function Parametres() {
  const [section, setSection] = useState(sections[0])
  const [values, setValues] = useState<Values>(initialValues)
  const [saved, setSaved] = useState<Values>(initialValues)
  const [justSaved, setJustSaved] = useState(false)
  const dirty = fields.some((f) => values[f.id] !== saved[f.id])
  const { toast } = useFeedback()

  const save = (e?: FormEvent) => {
    e?.preventDefault()
    if (!dirty) {
      toast({ tone: 'info', message: 'Aucune modification à enregistrer.' })
      return
    }
    const previous = saved
    setSaved(values)
    setJustSaved(true)
    toast({
      message: 'Paramètres du club enregistrés.',
      undo: () => {
        setSaved(previous)
        setValues(previous)
        setJustSaved(false)
      },
    })
  }

  return (
    <AppLayout>
      <Breadcrumb items={[{ label: 'Accueil', to: 'aujourdhui' }, { label: 'Paramètres' }]} />

      <SimpleHeader title="Paramètres" subtitle="Configurer le club, les droits, les intégrations et les préférences globales.">
        <ButtonPrimary requires="settings" onClick={() => save()}>
          Enregistrer
        </ButtonPrimary>
      </SimpleHeader>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[272fr_840fr]">
        <nav
          aria-label="Sections des paramètres"
          className="flex gap-3 overflow-x-auto rounded-lg border border-border-default bg-bg-surface p-3 lg:min-h-[560px] lg:flex-col"
        >
          {sections.map((s) => (
            <button
              key={s}
              type="button"
              aria-current={s === section ? 'page' : undefined}
              onClick={() => setSection(s)}
              className={`flex h-11 shrink-0 items-center rounded-md p-3 text-left text-sm lg:h-10 whitespace-nowrap transition-colors ${
                s === section ? 'bg-bg-subtle font-semibold' : 'bg-bg-surface hover:bg-bg-subtle/60'
              }`}
            >
              {s}
            </button>
          ))}
        </nav>

        <section className="flex min-w-0 flex-col gap-3 rounded-lg border border-border-default bg-bg-surface p-5 sm:p-6 lg:min-h-[560px]">
          <h2 className="text-lg font-semibold">{section}</h2>
          {section === 'Organisation' ? (
            <form onSubmit={save} className="flex flex-col gap-3">
              <p className="text-sm text-text-secondary">Informations utilisées sur les documents, communications et exports.</p>
              {fields.map((f) => (
                <div key={f.id} className="flex flex-col gap-1.5">
                  <label htmlFor={`param-${f.id}`} className="text-sm font-medium">
                    {f.label}
                  </label>
                  <input
                    id={`param-${f.id}`}
                    type={f.type}
                    value={values[f.id]}
                    onChange={(e) => {
                      setValues((v) => ({ ...v, [f.id]: e.target.value }))
                      setJustSaved(false)
                    }}
                    className="h-12 w-full min-w-0 rounded-md border border-border-strong bg-bg-surface px-3.5 text-base outline-none lg:h-10 lg:text-[15px] focus-visible:border-action-primary focus-visible:ring-1 focus-visible:ring-action-primary"
                  />
                </div>
              ))}
              <div className="flex flex-wrap items-center gap-3">
                <ButtonSecondary to="aujourdhui" wide={false} className="sm:min-w-[164px]">
                  Annuler
                </ButtonSecondary>
                <button
                  type="submit"
                  className="inline-flex h-12 items-center justify-center rounded-md bg-action-primary px-4 text-[15px] font-medium lg:h-10 lg:text-sm whitespace-nowrap text-text-inverse transition-colors hover:bg-action-primary-hover sm:min-w-[176px]"
                >
                  Enregistrer
                </button>
                {dirty && <span className="text-xs font-semibold text-warning-fg">Modifications non enregistrées</span>}
                {justSaved && !dirty && <span className="text-xs text-text-secondary">Modifications enregistrées</span>}
              </div>
            </form>
          ) : section === 'Identité visuelle' ? (
            <ClubIdentity />
          ) : (
            <p className="text-sm text-text-secondary">Cette section sera disponible dans une prochaine version du prototype.</p>
          )}
        </section>
      </div>
    </AppLayout>
  )
}

/** Club colour: used only for identity (stripe, crest, active marker, avatars). */
function ClubIdentity() {
  const { clubColor, setClubColor } = useClub()
  const { can } = useRole()
  const { toast } = useFeedback()
  const editable = can('settings')
  const pick = (c: string) => {
    const previous = clubColor
    setClubColor(c)
    toast({ message: 'Couleur du club mise à jour.', undo: () => setClubColor(previous) })
  }
  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-text-secondary">
        La couleur du club apparaît sur l’écusson, le filet en haut du menu, la rubrique active et les avatars. Les boutons et les statuts restent toujours
        neutres, pour qu’un club rouge ou vert ne soit jamais confondu avec une erreur ou une validation.
      </p>
      <fieldset disabled={!editable} className="flex flex-col gap-3">
        <legend className="mb-2 text-sm font-medium">Couleur du club</legend>
        <div className="flex flex-wrap gap-2">
          {CLUB_PRESETS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => pick(p.value)}
              aria-pressed={clubColor.toLowerCase() === p.value}
              className={`flex h-11 items-center gap-2 rounded-md border px-3 text-sm ${
                clubColor.toLowerCase() === p.value ? 'border-action-primary font-semibold' : 'border-border-strong'
              } disabled:opacity-50`}
            >
              <span className="size-4 rounded-sm" style={{ background: p.value }} aria-hidden />
              {p.label}
            </button>
          ))}
        </div>
        <label className="flex h-11 w-fit items-center gap-3 text-sm">
          <input
            type="color"
            value={clubColor}
            onChange={(e) => setClubColor(e.target.value)}
            className="h-9 w-12 cursor-pointer rounded-sm border border-border-strong bg-bg-surface"
          />
          Autre couleur ({clubColor})
        </label>
        {clubColor !== DEFAULT_CLUB_COLOR && (
          <button type="button" onClick={() => pick(DEFAULT_CLUB_COLOR)} className="w-fit text-sm font-medium underline underline-offset-2">
            Revenir à la couleur par défaut
          </button>
        )}
      </fieldset>
      {!editable && <p className="text-sm text-text-secondary">Seul le bureau peut changer la couleur du club.</p>}
      <div className="flex items-center gap-3 rounded-md border border-border-default p-4">
        <span className="flex size-10 items-center justify-center rounded-lg bg-club text-xs font-semibold text-club-text">LLC</span>
        <div>
          <p className="font-medium">Aperçu de l’écusson</p>
          <p className="text-sm text-text-secondary">Le texte passe automatiquement en blanc ou en noir pour rester lisible.</p>
        </div>
      </div>
    </div>
  )
}
