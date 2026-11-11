# Prototype links (read from the Figma file, page "18 — Prototype cliquable")

Format: `screenNode | elementNode | element label > destination screen node`.
Map destination node ids to route keys with `src/routes.ts` (each route has a `node`).
Sidebar links are handled by `AppLayout` and are not listed here.
Breadcrumb links ("Accueil", "Événements", …) are listed.

```
24:31|24:62|Voir le week-end>24:129
24:31|24:70|Résoudre les blocages>24:129
24:31|24:79|U15 · 18:30>24:244
24:31|24:88|Ouvrir la préparation>24:129
24:31|24:92|Remplacer la table de marque U15>24:731
24:31|24:97|Valider 3 remboursements>24:1887
24:31|24:102|Relancer 8 dossiers de licence>24:1182
24:31|24:107|Publier le compte rendu du burea>24:1553
24:129|55:841|Accueil>24:31
24:129|24:160|Créer un événement>24:451
24:129|24:204|U15 · LLC vs USV>24:244
24:129|24:243|Ouvrir et résoudre>24:244
24:244|55:848|Accueil>24:31
24:244|55:852|Événements>24:129
24:244|24:275|Clôturer après le match>24:1777
24:244|24:279|Équipe>69:840
24:244|24:281|Bénévoles>69:977
24:244|24:283|Buvette>69:1114
24:244|24:285|Matériel>69:1251
24:244|24:287|Finances>69:1388
24:244|24:289|Messages>69:1525
24:244|24:296|Envoyer un rappel>24:2370
24:244|24:297|Trouver des remplaçants>24:731
24:244|24:337|Gérer les missions>24:623
24:244|24:355|Voir tous les contrôles>24:536
24:356|55:858|Accueil>24:31
24:356|55:862|Événements>24:129
24:356|24:387|Créer un événement>24:451
24:451|55:868|Accueil>24:31
24:451|55:872|Événements>24:129
24:451|24:497|Utiliser le modèle>24:129
24:536|55:878|Accueil>24:31
24:536|55:882|Événements>24:129
24:536|24:621|Planifier le contrôle>24:356
24:623|55:888|Accueil>24:31
24:623|24:682|Table de marque · U15>24:731
24:623|24:687|Buvette · U15>24:731
24:623|24:727|Voir les personnes adaptées>24:916
24:623|24:730|Configurer les règles>24:1090
24:731|55:895|Accueil>24:31
24:731|55:899|Bénévoles>24:623
24:731|24:762|Envoyer les propositions>24:3131
24:731|24:816|Aperçu du message>24:2370
24:824|55:905|Accueil>24:31
24:824|55:909|Bénévoles>24:623
24:824|24:886|Sam. 18:00>24:731
24:916|55:915|Accueil>24:31
24:916|55:919|Bénévoles>24:623
24:1012|55:925|Accueil>24:31
24:1012|55:929|Bénévoles>24:623
24:1012|24:1060|Voir les personnes>24:916
24:1090|55:935|Accueil>24:31
24:1090|55:939|Bénévoles>24:623
24:1090|24:1180|Voir les personnes surchargées>24:916
24:1182|55:945|Accueil>24:31
24:1182|24:1251|Licence · Emma Roche>24:1299
24:1182|24:1298|Préparer la passation>24:1695
24:1299|55:952|Accueil>24:31
24:1299|55:956|Administration>24:1182
24:1299|24:1330|Valider le dossier>24:1389
24:1299|24:1361|Demander le certificat>24:2370
24:1299|24:1367|Envoyer la demande>24:2370
24:1389|55:962|Accueil>24:31
24:1389|55:966|Administration>24:1182
24:1473|55:972|Accueil>24:31
24:1473|55:976|Administration>24:1182
24:1553|55:982|Accueil>24:31
24:1553|55:986|Administration>24:1182
24:1624|55:992|Accueil>24:31
24:1624|55:996|Administration>24:1182
24:1695|55:1002|Accueil>24:31
24:1695|55:1006|Administration>24:1182
24:1777|55:1012|Accueil>24:31
24:1777|24:1808|Ajouter une opération>24:1980
24:1777|24:1862|7 remboursements>24:1887
24:1887|55:1019|Accueil>24:31
24:1887|55:1023|Finances>24:1777
24:1887|24:1918|Approuver et payer>24:3165
24:1980|55:1029|Accueil>24:31
24:1980|55:1033|Finances>24:1777
24:1980|24:2061|Achat pharmacie>24:1887
24:2079|55:1039|Accueil>24:31
24:2079|55:1043|Finances>24:1777
24:2079|24:2145|Licences>24:1389
24:2178|55:1049|Accueil>24:31
24:2178|55:1053|Finances>24:1777
24:2277|55:1059|Accueil>24:31
24:2277|55:1063|Finances>24:1777
24:2370|55:1069|Accueil>24:31
24:2370|24:2415|Changement horaire U15>24:2924
24:2370|24:2444|Prévisualiser et envoyer>24:3199
24:2461|55:1133|Accueil>24:31
24:2461|55:1137|Équipes>24:2849
24:2461|24:2498|Envoyer un rappel>24:2370
24:2461|24:2499|Préparer le match>24:244
24:2547|55:1076|Accueil>24:31
24:2547|55:1080|Communications>24:2370
24:2547|24:2596|Changement horaire U15>24:2924
24:2625|55:1086|Accueil>24:31
24:2625|55:1090|Communications>24:2370
24:2690|55:1096|Accueil>24:31
24:2690|55:1100|Communications>24:2370
24:2770|55:1106|Accueil>24:31
24:2770|55:1110|Communications>24:2370
24:2849|55:1126|Accueil>24:31
24:2849|24:2900|U15 Masculins>24:2461
24:2924|55:1116|Accueil>24:31
24:2924|55:1120|Communications>24:2370
24:2924|24:2972|Relancer les non-répondants>24:2370
24:2974|55:1143|Accueil>24:31
24:3062|55:1152|Accueil>24:31
24:3062|24:3127|Annuler>24:31
24:3131|24:3161|Retour aux missions>24:623
24:3131|24:3163|Voir le planning>24:824
24:3165|24:3195|Retour aux finances>24:1777
24:3165|24:3197|Voir les transactions>24:1980
24:3199|24:3229|Retour aux communications>24:2370
24:3199|24:3231|Voir les résultats>24:2547
47:182|48:182|Accueil>24:31
47:182|49:192|Aujourd’hui · 17:00>24:731
47:182|49:200|Avant lundi>24:1887
47:182|49:208|20 septembre>24:1182
47:182|49:216|Sans échéance>24:1553
47:182|49:224|Vendredi · 18:00>24:536
47:301|51:183|Accueil>24:31
47:301|51:191|Retour à l’accueil>24:31
47:301|52:188|Événements>24:129
47:301|52:194|Administration>24:1182
47:301|52:200|Finances>24:1777
47:301|52:206|Bénévoles>24:623
47:301|52:213|Équipes>24:2849
47:301|52:219|Communications>24:2370
47:301|52:225|Documents>24:2974
47:301|52:231|Paramètres>24:3062
69:840|69:862|Accueil>24:31
69:840|69:865|Événements>24:129
69:840|69:875|Clôturer après le match>24:1777
69:840|69:877|Vue générale>24:244
69:840|69:881|Bénévoles>69:977
69:840|69:883|Buvette>69:1114
69:840|69:885|Matériel>69:1251
69:840|69:887|Finances>69:1388
69:840|69:889|Messages>69:1525
69:840|69:896|Envoyer un rappel>24:2370
69:840|69:897|Gérer la composition>24:731
69:840|69:937|Relancer les absents>24:623
69:840|69:955|Traiter les alertes>24:536
69:977|69:999|Accueil>24:31
69:977|69:1002|Événements>24:129
69:977|69:1012|Clôturer après le match>24:1777
69:977|69:1014|Vue générale>24:244
69:977|69:1016|Équipe>69:840
69:977|69:1020|Buvette>69:1114
69:977|69:1022|Matériel>69:1251
69:977|69:1024|Finances>69:1388
69:977|69:1026|Messages>69:1525
69:977|69:1033|Relancer l’équipe>24:2370
69:977|69:1034|Trouver des renforts>24:731
69:977|69:1074|Gérer les missions>24:623
69:977|69:1092|Envoyer les relances>24:536
69:1114|69:1136|Accueil>24:31
69:1114|69:1139|Événements>24:129
69:1114|69:1149|Clôturer après le match>24:1777
69:1114|69:1151|Vue générale>24:244
69:1114|69:1153|Équipe>69:840
69:1114|69:1155|Bénévoles>69:977
69:1114|69:1159|Matériel>69:1251
69:1114|69:1161|Finances>69:1388
69:1114|69:1163|Messages>69:1525
69:1114|69:1170|Relancer l’équipe>24:2370
69:1114|69:1171|Préparer la commande>24:731
69:1114|69:1211|Gérer l’équipe>24:623
69:1114|69:1229|Ouvrir la caisse>24:536
69:1251|69:1273|Accueil>24:31
69:1251|69:1276|Événements>24:129
69:1251|69:1286|Clôturer après le match>24:1777
69:1251|69:1288|Vue générale>24:244
69:1251|69:1290|Équipe>69:840
69:1251|69:1292|Bénévoles>69:977
69:1251|69:1294|Buvette>69:1114
69:1251|69:1298|Finances>69:1388
69:1251|69:1300|Messages>69:1525
69:1251|69:1307|Signaler un manque>24:2370
69:1251|69:1308|Finaliser la checklist>24:731
69:1251|69:1348|Affecter le matériel>24:623
69:1251|69:1366|Valider les contrôles>24:536
69:1388|69:1410|Accueil>24:31
69:1388|69:1413|Événements>24:129
69:1388|69:1423|Clôturer après le match>24:1777
69:1388|69:1425|Vue générale>24:244
69:1388|69:1427|Équipe>69:840
69:1388|69:1429|Bénévoles>69:977
69:1388|69:1431|Buvette>69:1114
69:1388|69:1433|Matériel>69:1251
69:1388|69:1437|Messages>69:1525
69:1388|69:1444|Exporter le budget>24:2370
69:1388|69:1445|Ajouter une dépense>24:731
69:1388|69:1485|Voir les dépenses>24:623
69:1388|69:1503|Valider les pièces>24:536
69:1525|69:1547|Accueil>24:31
69:1525|69:1550|Événements>24:129
69:1525|69:1560|Clôturer après le match>24:1777
69:1525|69:1562|Vue générale>24:244
69:1525|69:1564|Équipe>69:840
69:1525|69:1566|Bénévoles>69:977
69:1525|69:1568|Buvette>69:1114
69:1525|69:1570|Matériel>69:1251
69:1525|69:1572|Finances>69:1388
69:1525|69:1581|Voir les réponses>24:2370
69:1525|69:1582|Nouveau message>24:731
69:1525|69:1622|Gérer les contacts>24:623
69:1525|69:1640|Voir l’historique>24:536
```
