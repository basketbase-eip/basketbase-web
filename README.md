# LLC Bureau

Back-office du club, reconstruit à partir du fichier Figma « LLC — Web Bureau Desktop »
(page « 18 — Prototype cliquable », 46 écrans). React 19 + Vite + Tailwind CSS v4 + React Router.

## Démarrer
```bash
npm install
npm run dev      # serveur de développement
npm run build    # version statique dans dist/
```

## Organisation
- `src/routes.ts` : tous les écrans (chemin + id du frame Figma) et la configuration de la sidebar.
- `src/components/ui.tsx` : composants partagés (boutons, badges, cartes, lignes, métriques…).
- `src/components/AppLayout.tsx` : sidebar (colonne fixe sur ordinateur, menu tiroir sur mobile).
- `src/screens/<cle>.tsx` : un fichier par écran, enregistré automatiquement.
- `src/components/<section>/` : composants propres à une section.
- `docs/prototype-links.md` : liens du prototype Figma (élément → écran de destination).
- Couleurs : variables Figma reprises dans `src/index.css` (`text-primary`, `bg-subtle`, etc.).

Les données sont statiques (copiées du design). Pour en faire une vraie application,
il suffit de remplacer les tableaux de données de chaque écran par des appels à une API.
