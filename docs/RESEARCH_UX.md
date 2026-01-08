# Recherche UX - Plateformes de Cours en Ligne

> Document de recherche pour Schoolaris - Meilleures pratiques UX EdTech
> Date: Janvier 2026

## Table des Matieres

1. [Onboarding](#1-onboarding)
2. [Recherche et Decouverte](#2-recherche--decouverte)
3. [Page Cours](#3-page-cours)
4. [Experience d'Apprentissage](#4-experience-dapprentissage)
5. [Experience Mobile](#5-experience-mobile)
6. [Considerations Specifiques Enfants](#6-considerations-specifiques-enfants)
7. [Recommandations Actionnables](#7-recommandations-actionnables-pour-schoolaris)

---

## 1. Onboarding

### Statistiques Cles

| Metrique                                       | Valeur | Source                                                                     |
| ---------------------------------------------- | ------ | -------------------------------------------------------------------------- |
| Utilisateurs abandonnant apres 1 session       | 25%    | [UserGuiding](https://userguiding.com/blog/user-onboarding-best-practices) |
| Amelioration retention avec bon onboarding     | +50%   | [UserGuiding](https://userguiding.com/blog/user-onboarding-best-practices) |
| Utilisateurs preferant self-service            | 67%    | [Userpilot](https://userpilot.com/blog/user-onboarding/)                   |
| Utilisateurs voulant ressources personnalisees | 91%    | [Userpilot](https://userpilot.com/blog/user-onboarding/)                   |

### Best Practices

#### 1.1 Personnalisation et Segmentation

Pas deux utilisateurs ne sont identiques. Adapter l'experience d'onboarding au role, niveau ou objectif de l'utilisateur.

**Implementation recommandee pour Schoolaris:**

- Question initiale: "Qui etes-vous?" (Parent / Eleve / Enseignant)
- Pour parents: "Quel est le niveau de votre enfant?" (CP -> Terminale)
- Pour eleves: "Quelle matiere voulez-vous ameliorer?"
- Adapter le contenu montre en fonction des reponses

#### 1.2 Divulgation Progressive (Progressive Disclosure)

Ne pas submerger l'utilisateur avec trop d'information. Reveler etape par etape.

**Pattern recommande:**

```
Etape 1: Selection du profil (Parent/Eleve)
Etape 2: Configuration basique (niveau scolaire)
Etape 3: Premier cours gratuit (valeur immediate)
Etape 4: Inscription complete (apres avoir goute le produit)
```

#### 1.3 Approche "Learn by Doing"

Duolingo est le meilleur exemple: l'utilisateur commence a apprendre AVANT de creer un compte.

> "La strategie 'jouer d'abord, profil ensuite' est l'une des decisions UX les plus intelligentes de Duolingo. Ils demontrent la valeur en 15 minutes: lecon complete, XP gagnes, 10% de progression." - [Usability Geek](https://usabilitygeek.com/ux-case-study-duolingo/)

**Pour Schoolaris:**

- Permettre un quiz ou mini-lecon AVANT l'inscription
- Montrer les resultats et progression potentielle
- Demander l'inscription uniquement apres cette demonstration de valeur

#### 1.4 Indicateurs de Progression Clairs

Les utilisateurs aiment savoir ou ils en sont dans le processus.

**Elements a implementer:**

- Barre de progression (ex: "Etape 2/4")
- Checklist d'onboarding visible
- Pourcentage de completion du profil

#### 1.5 Report de la Creation de Compte

> "Duolingo reporte l'inscription le plus longtemps possible - generalement jusqu'au moment ou l'utilisateur doit s'inscrire pour progresser davantage." - [Appcues](https://www.appcues.com/blog/the-10-best-user-onboarding-experiences)

**Resultat mesure:** +20% de retention jour suivant quand l'inscription est reportee apres la premiere lecon.

---

## 2. Recherche & Decouverte

### Statistiques Cles

| Metrique                                       | Valeur | Source                                                                          |
| ---------------------------------------------- | ------ | ------------------------------------------------------------------------------- |
| Clients attendant une experience personnalisee | 63%    | [Meilisearch](https://www.meilisearch.com/blog/personalization-recommendations) |

### Best Practices

#### 2.1 Recherche Instantanee avec Suggestions

> "Coursera genere des suggestions de recherche pendant que l'utilisateur tape, offrant de nombreuses options." - [Algolia](https://www.algolia.com/blog/ux/best-practices-for-site-search-ui-design-patterns)

**Implementation:**

- Autocomplete en temps reel
- Suggestions basees sur les termes populaires
- Recherche tolerante aux fautes de frappe
- Historique des recherches recentes

#### 2.2 Filtres Dynamiques

Les filtres doivent s'adapter au contexte de recherche.

**Filtres recommandes pour Schoolaris:**

- Niveau scolaire (CP, CE1, CE2, CM1, CM2, 6e, 5e, 4e, 3e, 2nde, 1ere, Terminale)
- Matiere (Maths, Francais, Histoire-Geo, Sciences, Langues...)
- Type de contenu (Video, Quiz, Exercices, Cours)
- Duree estimee
- Gratuit / Premium
- Note moyenne

#### 2.3 Equilibre Personnalisation / Decouverte

> "La personnalisation peut creer des 'bulles de filtre' ou l'utilisateur ne voit que du contenu similaire a son historique. Cela limite la decouverte." - [Meilisearch](https://www.meilisearch.com/blog/personalization-recommendations)

**Solution:**

- Combiner "Base sur votre historique" avec "Tendances actuelles"
- Offrir un bouton "Reinitialiser mes preferences"
- Section "Decouvrir autre chose"

#### 2.4 Browse vs Search

| Mode       | Usage                           | Implementation                        |
| ---------- | ------------------------------- | ------------------------------------- |
| **Browse** | Exploration, pas d'idee precise | Categories visuelles, cartes de cours |
| **Search** | Objectif precis                 | Barre de recherche proeminente        |

**Recommandation:** Les deux modes doivent etre accessibles depuis la page d'accueil.

---

## 3. Page Cours

### Statistiques Cles - Social Proof

| Metrique                                             | Valeur | Source                                                               |
| ---------------------------------------------------- | ------ | -------------------------------------------------------------------- |
| Augmentation conversions avec testimonials           | +34%   | [Instapage](https://instapage.com/blog/social-proof-examples)        |
| Probabilite d'achat avec 5+ reviews                  | +270%  | [WiserNotify](https://wisernotify.com/blog/social-proof-statistics/) |
| Millennials faisant confiance aux reviews comme amis | 91%    | [WiserNotify](https://wisernotify.com/blog/social-proof-statistics/) |
| Confiance accrue avec mix avis positifs/negatifs     | 68%    | [WiserNotify](https://wisernotify.com/blog/social-proof-statistics/) |

### 3.1 Elements de Confiance (Social Proof)

#### Types de Social Proof a Integrer

1. **Temoignages avec photo/video**

   > "Voir le visage et le langage corporel, entendre la voix rend le temoignage bien plus credible. La volonte d'etre filme montre la sincerite." - [Orbit Media](https://www.orbitmedia.com/blog/social-proof-web-design/)

2. **Notes et Avis**
   - Afficher le nombre total d'avis
   - Inclure des avis negatifs (augmente la confiance de 2%)
   - Date des avis visible

3. **Statistiques d'Usage**
   - "12,500 eleves inscrits"
   - "Note moyenne: 4.7/5"
   - "Taux de completion: 89%"

4. **Badges de Confiance**
   - Paiement securise
   - Garantie satisfait ou rembourse
   - Certification/Agrement Education Nationale (si applicable)

#### Placement du Social Proof

> "Evitez de creer une page testimonials. Faites plutot de CHAQUE page une page testimonials." - [Orbit Media](https://www.orbitmedia.com/blog/social-proof-web-design/)

**Placement strategique:**

- A cote du bouton d'inscription
- Pres du prix
- Dans le formulaire de paiement

### 3.2 Pricing Psychology

#### Taux de Conversion par Modele

| Modele                         | Taux Conversion | Source                                                                              |
| ------------------------------ | --------------- | ----------------------------------------------------------------------------------- |
| Freemium (visiteur -> gratuit) | 13.3%           | [CrazyEgg](https://www.crazyegg.com/blog/free-to-paid-conversion-rate/)             |
| Freemium (gratuit -> payant)   | 2.6%            | [CrazyEgg](https://www.crazyegg.com/blog/free-to-paid-conversion-rate/)             |
| Free Trial Opt-in              | 18.2%           | [CrazyEgg](https://www.crazyegg.com/blog/free-to-paid-conversion-rate/)             |
| Free Trial Opt-out             | 48.8%           | [CrazyEgg](https://www.crazyegg.com/blog/free-to-paid-conversion-rate/)             |
| Freemium healthy               | 3-10%           | [Binary Stream](https://binarystream.com/the-definitive-guide-to-freemium-pricing/) |

#### Principes Psychologiques

1. **Effet de Dotation (Endowment Effect)**

   > "L'acces freemium ou free-trial augmente le sentiment de possession et donc la valeur percue." - [RevenueCat](https://www.revenuecat.com/blog/growth/subscription-pricing-psychology-how-to-influence-purchasing-decisions/)

2. **Aversion a la Perte**

   > "Les utilisateurs craignent de perdre ce qu'ils ont plus qu'ils ne valorisent ce qu'ils pourraient gagner." - [Monetizely](https://www.getmonetizely.com/articles/how-do-saas-free-trials-convert-prospects-into-loyal-customers-the-psychology-behind-trial-conversion)

3. **Ancrage de Prix**
   Afficher un plan premium a cote du plan standard fait paraitre le standard plus abordable.

#### Recommandations pour Schoolaris

- **Trial optimal:** 7 jours pour abonnement mensuel, 14 jours pour annuel
- **Collecter paiement upfront:** Convertit 5x mieux que "payer apres"
- **Timing:** 72h pour la plupart des decisions, pas a la fin du trial
- **Feature gating intelligent:** Les fonctions gratuites demontrent la valeur, les premium resolvent des besoins cruciaux

### 3.3 CTAs Qui Convertissent

#### Resultats de Tests A/B

| Test                           | Resultat                | Source                                                                                                                    |
| ------------------------------ | ----------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| "SIGN UP" vs "LEARN MORE"      | Difference de 60M$      | [Deskera](https://www.deskera.com/blog/call-to-action-examples/)                                                          |
| "Get a Demo" vs "Free Demo"    | +forte augmentation CTR | [WiseVu](https://www.wisevu.com/blog/cta-button-text-a-b-testing-case-study/)                                             |
| "Book a Demo" vs "Get Started" | +111.55% conversion     | [WebFX](https://www.webfx.com/blog/conversion-rate-optimization/important-lessons-from-3-call-to-action-ab-case-studies/) |
| CTA specifique et clair        | +161% conversion        | [AB Tasty](https://www.abtasty.com/blog/call-to-action-guide/)                                                            |
| CTA en bas de page longue      | +304% conversion        | [VWO](https://vwo.com/blog/call-to-action-buttons-ultimate-guide/)                                                        |
| Ajout espace blanc autour CTA  | +232% conversion        | [Landingi](https://landingi.com/conversion-optimization/case-studies-examples/)                                           |

#### Best Practices CTA

1. **Utiliser "GRATUIT" dans le texte**

   > "Le terme 'FREE QUOTE' capture le plus efficacement l'attention." - [WiseVu](https://www.wisevu.com/blog/cta-button-text-a-b-testing-case-study/)

2. **Formulations recommandees pour Schoolaris:**
   - "Commencer gratuitement"
   - "Essayer ce cours"
   - "Rejoindre 10,000 eleves" (social proof + action)
   - "Debloquer l'acces"

3. **Design du bouton:**
   - Couleur contrastante avec le fond
   - Taille suffisante (zone de clic confortable)
   - Espace blanc autour

---

## 4. Experience d'Apprentissage

### 4.1 Video Player Features

#### Fonctionnalites Essentielles

| Feature                         | Importance | Implementation                 |
| ------------------------------- | ---------- | ------------------------------ |
| Controle de vitesse (0.5x - 2x) | Haute      | Permettre adaptation au rythme |
| Sous-titres                     | Haute      | Accessibilite + comprehension  |
| Mode picture-in-picture         | Moyenne    | Multi-tache                    |
| Saut de 10s avant/arriere       | Haute      | Navigation rapide              |
| Qualite video adaptative        | Haute      | Performance reseau             |
| Reprise automatique             | Haute      | Continuite experience          |

### 4.2 Note-Taking & Annotations

> "Panopto permet aux etudiants d'ajouter leurs propres signets a une video, pour marquer un endroit ou ils veulent revenir plus tard. Les signets sont prives." - [UWE Digital Learning](https://digitallearning.uwe.ac.uk/using-panopto-bookmarks-notes-and-discussions-tools/)

#### Features Recommandees

1. **Signets timestampes**
   - Clic pour ajouter un signet
   - Navigation rapide vers les signets
   - Signets prives par defaut

2. **Notes contextuelles**
   - Notes attachees a un moment precis de la video
   - Export des notes en PDF/texte
   - Synchronisation multi-appareils

3. **Surlignage de texte** (pour cours textuels)
   - Couleurs multiples
   - Annotations en marge
   - Partage optionnel avec enseignant

### 4.3 Progression Tracking

> "Montrer aux etudiants les objectifs qu'ils essaient d'atteindre avec leur progression est essentiel. Les barres de progression visuelles, camemberts ou pourcentages permettent de controler l'apparence." - [BuddyBoss](https://buddyboss.com/blog/gamification-for-learning-to-boost-engagement-with-points-badges-rewards/)

#### Elements a Afficher

- Progression globale du cours (%)
- Chapitres completes / restants
- Temps estime restant
- Objectifs atteints
- Prochaine etape claire

### 4.4 Gamification

#### Impact Mesure

| Element                  | Impact          | Source                                                              |
| ------------------------ | --------------- | ------------------------------------------------------------------- |
| Visual progress tracking | +48% completion | [AcademyOcean](https://academyocean.com/features/gamification-lms)  |
| XP Leaderboards          | +40% engagement | [Orizon](https://www.orizon.co/blog/duolingos-gamification-secrets) |
| Badges                   | +30% completion | [Orizon](https://www.orizon.co/blog/duolingos-gamification-secrets) |

#### Elements de Gamification Recommandes

1. **Points et XP**
   - Gagner des points pour chaque lecon completee
   - Bonus pour quiz reussis du premier coup
   - XP quotidiens minimum a atteindre

2. **Badges**

   > "Les badges servent a: motiver l'action et la participation, marquer la progression, recompenser, permettre la definition d'objectifs." - [Growth Engineering](https://www.growthengineering.co.uk/gamification-badges-lms/)

   Exemples de badges:
   - "Premier cours termine"
   - "Serie de 7 jours"
   - "Maitre des maths" (complete une section)
   - "Explorateur" (essaye 3 matieres differentes)

3. **Streaks (Series)**

   > "Les utilisateurs avec un streak de 7+ jours sont 2.3x plus susceptibles de s'engager quotidiennement." - [Orizon](https://www.orizon.co/blog/duolingos-gamification-secrets)

   **Best Practices pour les streaks:**
   - Afficher le streak de facon visible
   - Option "Streak Freeze" (comme Duolingo)
   - Notifications strategiques de rappel
   - Faciliter le maintien (une seule lecon = streak maintenu)

   > "Duolingo a facilite le maintien du streak en permettant de l'etendre avec une seule lecon par jour. Cela a conduit a des millions de personnes supplementaires apprenant pendant au moins une semaine." - [StriveCloud](https://strivecloud.io/blog/gamification-examples-boost-user-retention-duolingo)

4. **Classements**
   - Classement hebdomadaire entre amis/classe
   - Divisions/Ligues (comme Duolingo)
   - Option de desactiver (eviter pression negative)

#### Attention aux Pieges

> "Les streaks et rappels doivent encourager, pas culpabiliser. Les meilleurs produits soutiennent ce que les utilisateurs veulent deja accomplir, plutot que de les pieger dans des comportements benefiques pour le produit." - [Mind the Product](https://www.mindtheproduct.com/designing-streaks-for-long-term-user-growth/)

---

## 5. Experience Mobile

### Statistiques Importantes

| Probleme                  | Impact          | Source                                                                                                   |
| ------------------------- | --------------- | -------------------------------------------------------------------------------------------------------- |
| Delai de 1 seconde        | -7% conversions | [Genesys Growth](https://genesysgrowth.com/blog/landing-page-conversion-stats-for-marketing-leaders)     |
| Optimisation mobile seule | +27% conversion | [Invesp via Genesys](https://genesysgrowth.com/blog/landing-page-conversion-stats-for-marketing-leaders) |

### 5.1 Approche Mobile-First

> "L'approche mobile-first est generalement la meilleure car elle force la clarte et aide a prioriser l'essentiel des le depart." - [LogRocket](https://blog.logrocket.com/ux-design/app-designers-guide-responsive-mobile-ux/)

### 5.2 Design Responsive

> "Le design responsive pour l'e-learning adapte la taille, la disposition et les interactions selon la taille de l'ecran de l'appareil utilise." - [Elucidat](https://www.elucidat.com/blog/responsive-elearning-design-examples/)

#### Breakpoints Recommandes

| Appareil | Largeur    | Adaptations                                               |
| -------- | ---------- | --------------------------------------------------------- |
| Mobile   | < 768px    | Navigation hamburger, boutons plus grands, contenu empile |
| Tablette | 768-1024px | Navigation hybride, grille 2 colonnes                     |
| Desktop  | > 1024px   | Navigation complete, sidebar, grille multi-colonnes       |

### 5.3 Acces Offline

> "Certains utilisateurs ont une connectivite limitee. Ils ont besoin d'un acces hors ligne aux cours pour continuer a utiliser votre produit." - [Shakuro](https://shakuro.com/blog/e-learning-app-design-and-how-to-make-it-better)

**Features offline recommandees:**

- Telechargement de lecons pour acces hors ligne
- Sauvegarde automatique de la progression
- Synchronisation quand la connexion revient
- Indication claire du contenu disponible offline

### 5.4 Interactions Tactiles

#### Best Practices

1. **Zones de clic minimum 44x44px** (guidelines Apple)
2. **Gestes intuitifs:**
   - Swipe pour naviguer entre lecons
   - Pull-to-refresh
   - Double-tap pour zoom
3. **Feedback haptique** pour les interactions importantes
4. **Eviter hover states** (pas de souris sur mobile)

### 5.5 Erreurs Communes a Eviter

> "Texte illisible, images mal dimensionnees, ou boutons non responsifs peuvent alienner les utilisateurs et reduire le taux de completion des cours." - [PinLearn](https://pinlearn.com/ux-best-practices-for-e-learning-platforms/)

---

## 6. Considerations Specifiques Enfants

### Context Legal et Ethique

> "Concevoir des apps pour enfants est l'un des types de developpement les plus complexes car vous ne concevez pas seulement pour les utilisateurs - vous concevez pour leurs parents, leurs enseignants, les organismes de regulation et leur securite." - [Glance](https://thisisglance.com/learning-centre/how-do-i-design-apps-that-kids-can-use-safely)

### 6.1 Controles Parentaux

**Features essentielles:**

- Dashboard parent separe
- Suivi du temps passe
- Rapport de progression enfant
- Limites de temps configurables
- Approbation pour nouveaux contenus

> "Google Family Link permet de bloquer les sites inappropries, exiger une approbation pour les nouvelles apps, et gerer les permissions. Vous pouvez definir des limites de temps par app, avec du temps illimite pour les apps educatives." - [Google Family Link](https://families.google/familylink/)

### 6.2 Design pour Enfants

**Principes UX:**

- Navigation simplifiee et visuelle
- Icones grandes et colorees
- Instructions vocales/audio
- Feedback positif constant
- Pas de publicites intrusives
- Pas de liens externes non supervises

### 6.3 Approche Collaborative Parent-Enfant

> "Une etude qualitative avec des parents et enfants de 6-8 ans a revele une reponse favorable a l'approche collaborative. Les parents ont estime que cela aidait a faciliter les discussions avec leurs enfants." - [ResearchGate](https://www.researchgate.net/publication/320663410_User_interface_design_model_for_parental_control_application_on_mobile_smartphone_using_user_centered_design_method)

**Implementation:**

- Premiere configuration faite ensemble
- Objectifs definis conjointement
- Celebration des reussites partagee
- Communication parent-enfant in-app

### 6.4 Conformite RGPD/COPPA

**Obligations:**

- Consentement parental verifiable pour < 15 ans
- Minimisation des donnees collectees
- Pas de tracking publicitaire
- Droit a l'effacement des donnees

---

## 7. Recommandations Actionnables pour Schoolaris

### Phase 1: Foundation (Sprint 1-2)

#### Onboarding

- [ ] Implementer flow d'onboarding en 4 etapes max
- [ ] Creer quiz diagnostic AVANT inscription
- [ ] Ajouter barre de progression visible
- [ ] Reporter creation de compte apres premiere valeur

#### Navigation & Recherche

- [ ] Implementer recherche instantanee avec autocomplete
- [ ] Creer filtres par niveau + matiere + type
- [ ] Ajouter section "Recommande pour vous"

### Phase 2: Engagement (Sprint 3-4)

#### Page Cours

- [ ] Ajouter compteur d'eleves inscrits
- [ ] Implementer systeme de notes/avis
- [ ] Creer section temoignages video
- [ ] Optimiser CTA avec texte "Commencer gratuitement"

#### Video Player

- [ ] Controle de vitesse 0.5x - 2x
- [ ] Boutons +10s / -10s
- [ ] Reprise automatique
- [ ] Signets utilisateur

### Phase 3: Retention (Sprint 5-6)

#### Gamification

- [ ] Systeme de points/XP
- [ ] 10-15 badges de base
- [ ] Streak quotidien avec freeze option
- [ ] Classement hebdomadaire optionnel

#### Progression

- [ ] Dashboard progression visuel
- [ ] Objectifs hebdomadaires
- [ ] Notifications de rappel intelligentes

### Phase 4: Mobile & Parents (Sprint 7-8)

#### Mobile

- [ ] Audit responsive complet
- [ ] Implementation download offline
- [ ] Optimisation performances (< 3s load)

#### Espace Parent

- [ ] Dashboard parent separe
- [ ] Rapports de progression enfant
- [ ] Controles de temps
- [ ] Notifications de reussite

---

## Metriques a Suivre

| Metrique                           | Cible   | Priorite |
| ---------------------------------- | ------- | -------- |
| Taux completion onboarding         | > 70%   | Haute    |
| Conversion visiteur -> inscription | > 15%   | Haute    |
| Conversion freemium -> payant      | > 5%    | Haute    |
| Retention J7                       | > 40%   | Haute    |
| Retention J30                      | > 25%   | Haute    |
| Taux completion cours              | > 60%   | Moyenne  |
| NPS (Net Promoter Score)           | > 40    | Moyenne  |
| Temps moyen par session            | > 15min | Moyenne  |

---

## Sources et References

### Onboarding

- [UX Design Institute - UX Onboarding Best Practices](https://www.uxdesigninstitute.com/blog/ux-onboarding-best-practices-guide/)
- [Appcues - Best User Onboarding Examples](https://www.appcues.com/blog/the-10-best-user-onboarding-experiences)
- [UserGuiding - User Onboarding Best Practices](https://userguiding.com/blog/user-onboarding-best-practices)
- [Userpilot - User Onboarding](https://userpilot.com/blog/user-onboarding/)

### Recherche & Decouverte

- [Algolia - Best Practices for Site Search](https://www.algolia.com/blog/ux/best-practices-for-site-search-ui-design-patterns)
- [Meilisearch - Personalization and Recommendations](https://www.meilisearch.com/blog/personalization-recommendations)

### Conversion & Landing Pages

- [Unbounce - Conversion Rate Benchmarks](https://unbounce.com/landing-pages/whats-a-good-conversion-rate/)
- [CXL - Landing Page Case Study](https://cxl.com/blog/case-study-how-we-improved-landing-page-conversion/)
- [Genesys Growth - Landing Page Stats](https://genesysgrowth.com/blog/landing-page-conversion-stats-for-marketing-leaders)

### Social Proof

- [Instapage - Social Proof Examples](https://instapage.com/blog/social-proof-examples)
- [WiserNotify - Social Proof Statistics](https://wisernotify.com/blog/social-proof-statistics/)
- [Orbit Media - Social Proof Web Design](https://www.orbitmedia.com/blog/social-proof-web-design/)

### Pricing & Freemium

- [CrazyEgg - Free to Paid Conversion Rates](https://www.crazyegg.com/blog/free-to-paid-conversion-rate/)
- [RevenueCat - Subscription Pricing Psychology](https://www.revenuecat.com/blog/growth/subscription-pricing-psychology-how-to-influence-purchasing-decisions/)

### Gamification

- [Orizon - Duolingo Gamification Secrets](https://www.orizon.co/blog/duolingos-gamification-secrets)
- [BuddyBoss - Gamification for Learning](https://buddyboss.com/blog/gamification-for-learning-to-boost-engagement-with-points-badges-rewards/)
- [StriveCloud - Duolingo Gamification](https://strivecloud.io/blog/gamification-examples-boost-user-retention-duolingo)
- [AcademyOcean - Gamification LMS](https://academyocean.com/features/gamification-lms)

### Mobile & E-Learning Design

- [Shakuro - E-Learning App Design](https://shakuro.com/blog/e-learning-app-design-and-how-to-make-it-better)
- [PinLearn - UX Best Practices for E-Learning](https://pinlearn.com/ux-best-practices-for-e-learning-platforms/)
- [Elucidat - Responsive E-Learning Design](https://www.elucidat.com/blog/responsive-elearning-design-examples/)

### Case Studies

- [Usability Geek - Duolingo UX Case Study](https://usabilitygeek.com/ux-case-study-duolingo/)
- [Medium - Coursera App Redesign](https://medium.com/@gretus/ui-ux-case-study-coursera-app-redesign-to-enhance-learner-retention-0b24386039d0)

### Design pour Enfants

- [Glance - Designing Safe Apps for Kids](https://thisisglance.com/learning-centre/how-do-i-design-apps-that-kids-can-use-safely)
- [Gapsy Studio - UX Design for Kids](https://gapsystudio.com/blog/ux-design-for-kids/)
