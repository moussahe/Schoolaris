# SCHOOLARIS - Features Roadmap

> Liste priorisee des features a implementer

---

## Prioritization Framework

### Impact vs Effort Matrix

```
                    HIGH IMPACT
                        │
    ┌───────────────────┼───────────────────┐
    │                   │                   │
    │   QUICK WINS      │   BIG BETS        │
    │   (Do First)      │   (Plan Carefully)│
    │                   │                   │
LOW ├───────────────────┼───────────────────┤ HIGH
EFFORT                  │                   EFFORT
    │                   │                   │
    │   FILL-INS        │   TIME SINKS      │
    │   (Do Later)      │   (Avoid/Delegate)│
    │                   │                   │
    └───────────────────┼───────────────────┘
                        │
                    LOW IMPACT
```

### Priority Levels

- **P0 (Critical)**: Must have for MVP - bloque le lancement
- **P1 (High)**: Important for user experience - premiere release
- **P2 (Medium)**: Nice to have - ameliore l'engagement
- **P3 (Low)**: Future enhancement - peut attendre

---

## Phase 1: MVP Foundation (M1-M3)

### Authentication & Users [P0]

| Feature             | Description                        | Effort | Status |
| ------------------- | ---------------------------------- | ------ | ------ |
| Email/Password Auth | Inscription et connexion classique | M      | Done   |
| Google OAuth        | Connexion via Google               | S      | Done   |
| Multi-role system   | Student, Parent, Teacher, Admin    | M      | Done   |
| Email verification  | Verification email avec token      | S      | Todo   |
| Password reset      | Flux de reinitialisation           | S      | Todo   |
| Onboarding flow     | Flow en 4 etapes personnalise      | M      | Todo   |

### Teacher Portal [P0]

| Feature                   | Description                       | Effort | Status      |
| ------------------------- | --------------------------------- | ------ | ----------- |
| Teacher registration      | Inscription specifique enseignant | M      | Done        |
| Stripe Connect onboarding | Connexion compte Stripe           | L      | In Progress |
| Course creation           | Creer cours avec chapitres/lecons | L      | Done        |
| Course editor             | Edition rich text + upload video  | L      | Todo        |
| Draft/Publish workflow    | Status DRAFT -> PUBLISHED         | S      | Done        |
| Teacher dashboard         | Vue d'ensemble des cours          | M      | Done        |

### Course System [P0]

| Feature                  | Description                    | Effort | Status |
| ------------------------ | ------------------------------ | ------ | ------ |
| Course catalog           | Liste des cours avec filtres   | M      | Todo   |
| Course detail page       | Page de vente du cours         | M      | Done   |
| Chapter/Lesson structure | Organisation hierarchique      | M      | Done   |
| Video player             | Player avec controles complets | L      | Todo   |
| Progress tracking        | Suivi de progression par lecon | M      | Todo   |
| Preview mode             | Preview du premier chapitre    | S      | Todo   |

### Payments [P0]

| Feature           | Description             | Effort | Status |
| ----------------- | ----------------------- | ------ | ------ |
| Stripe Checkout   | Page de paiement Stripe | M      | Todo   |
| Marketplace split | 85/15 automatique       | M      | Todo   |
| Purchase history  | Historique des achats   | S      | Todo   |
| Stripe webhooks   | Gestion events Stripe   | M      | Todo   |
| Teacher payouts   | Dashboard des paiements | M      | Todo   |

### Landing Page [P0]

| Feature          | Description                  | Effort | Status |
| ---------------- | ---------------------------- | ------ | ------ |
| Hero section WOW | Animation, CTA, social proof | M      | Todo   |
| Features section | Presentation des avantages   | S      | Done   |
| Testimonials     | Temoignages utilisateurs     | S      | Todo   |
| Pricing section  | Explication du modele        | S      | Todo   |
| Footer           | Liens, legal, social         | S      | Done   |

---

## Phase 2: Intelligence (M4-M6)

### AI Tutor [P1]

| Feature              | Description                         | Effort | Status |
| -------------------- | ----------------------------------- | ------ | ------ |
| Chat interface       | Interface de chat moderne           | M      | Todo   |
| Claude integration   | API Anthropic connectee             | M      | Todo   |
| Socratic mode        | Guidage sans donner les reponses    | L      | Todo   |
| Lesson context       | Contexte de la lecon dans le prompt | S      | Todo   |
| Conversation history | Sauvegarde des echanges             | S      | Todo   |
| Rate limiting        | Limite d'usage par jour             | S      | Todo   |

### Quiz System [P1]

| Feature               | Description                   | Effort | Status |
| --------------------- | ----------------------------- | ------ | ------ |
| Quiz creation         | Interface de creation de quiz | M      | Todo   |
| AI quiz generation    | Generation via Claude         | L      | Todo   |
| Quiz taking           | Interface de passage          | M      | Todo   |
| Results & explanation | Resultats avec explications   | M      | Todo   |
| Quiz attempts history | Historique des tentatives     | S      | Todo   |
| Adaptive difficulty   | Difficulte selon le niveau    | L      | Todo   |

### Search & Discovery [P1]

| Feature          | Description                     | Effort | Status |
| ---------------- | ------------------------------- | ------ | ------ |
| Full-text search | Recherche dans les cours        | M      | Todo   |
| Instant search   | Autocomplete en temps reel      | M      | Todo   |
| Advanced filters | Filtres niveau, matiere, prix   | M      | Todo   |
| Recommendations  | Cours suggeres selon historique | L      | Todo   |
| Search history   | Recherches recentes             | S      | Todo   |

### Teacher Analytics [P1]

| Feature              | Description                 | Effort | Status |
| -------------------- | --------------------------- | ------ | ------ |
| Revenue dashboard    | CA, commissions, tendances  | M      | Todo   |
| Student analytics    | Stats par cours, completion | M      | Todo   |
| Review management    | Gestion des avis            | S      | Todo   |
| Performance insights | Conseils d'amelioration     | M      | Todo   |

---

## Phase 3: Engagement (M7-M9)

### Gamification [P2]

| Feature             | Description                   | Effort | Status |
| ------------------- | ----------------------------- | ------ | ------ |
| XP system           | Points d'experience           | M      | Todo   |
| Level progression   | Niveaux avec seuils           | S      | Todo   |
| Badges/Achievements | 20+ badges a debloquer        | M      | Todo   |
| Daily streak        | Compteur de jours consecutifs | M      | Todo   |
| Streak freeze       | Option de gel du streak       | S      | Todo   |
| Leaderboards        | Classements hebdomadaires     | M      | Todo   |
| Celebrations        | Animations de succes          | S      | Todo   |

### Notifications [P2]

| Feature             | Description                 | Effort | Status |
| ------------------- | --------------------------- | ------ | ------ |
| Email notifications | Emails transactionnels      | M      | Todo   |
| Push notifications  | Notifications navigateur    | M      | Todo   |
| Streak reminders    | Rappels pour le streak      | S      | Todo   |
| Course updates      | Notifications de nouveautes | S      | Todo   |
| Preferences         | Gestion des preferences     | S      | Todo   |

### Social Features [P2]

| Feature           | Description                 | Effort | Status |
| ----------------- | --------------------------- | ------ | ------ |
| Reviews & ratings | Systeme d'avis 5 etoiles    | M      | Todo   |
| Teacher responses | Reponses aux avis           | S      | Todo   |
| Social sharing    | Partage sur reseaux sociaux | S      | Todo   |
| Referral program  | Programme de parrainage     | M      | Todo   |

### Parent Portal [P2]

| Feature            | Description             | Effort | Status |
| ------------------ | ----------------------- | ------ | ------ |
| Child management   | Ajouter/gerer enfants   | M      | Done   |
| Progress dashboard | Vue progression enfants | M      | Todo   |
| Weekly reports     | Rapports hebdomadaires  | M      | Todo   |
| Smart alerts       | Alertes sur difficultes | M      | Todo   |
| Time controls      | Limites de temps        | S      | Todo   |
| Parent tips        | Conseils personnalises  | S      | Todo   |

---

## Phase 4: Growth (M10-M12)

### PWA & Mobile [P1]

| Feature            | Description                  | Effort | Status |
| ------------------ | ---------------------------- | ------ | ------ |
| PWA setup          | Service worker, manifest     | M      | Todo   |
| Offline access     | Telechargement lecons        | L      | Todo   |
| Install prompt     | Invitation a installer       | S      | Todo   |
| Push notifications | Notifications push mobile    | M      | Todo   |
| Responsive polish  | Optimisation mobile complete | M      | Todo   |

### Performance [P1]

| Feature            | Description                | Effort | Status |
| ------------------ | -------------------------- | ------ | ------ |
| ISR optimization   | Pages statiques optimisees | M      | Todo   |
| Image optimization | AVIF, lazy loading         | M      | Todo   |
| Code splitting     | Chunks optimises           | M      | Todo   |
| Edge caching       | Cache au plus pres         | M      | Todo   |
| Core Web Vitals    | LCP < 2.5s, CLS < 0.1      | L      | Todo   |

### Content Expansion [P2]

| Feature               | Description                   | Effort | Status |
| --------------------- | ----------------------------- | ------ | ------ |
| Video hosting         | Integration Cloudflare Stream | L      | Todo   |
| Rich text editor      | Editeur de contenu avance     | M      | Todo   |
| File attachments      | PDF, documents                | S      | Todo   |
| Interactive exercises | Exercices interactifs         | L      | Todo   |

### Admin Panel [P2]

| Feature             | Description              | Effort | Status |
| ------------------- | ------------------------ | ------ | ------ |
| User management     | Gestion des utilisateurs | M      | Todo   |
| Course moderation   | Validation des cours     | M      | Todo   |
| Analytics dashboard | Metriques globales       | M      | Todo   |
| Feature flags       | Activation de features   | S      | Todo   |
| Content moderation  | Moderation des contenus  | M      | Todo   |

---

## Feature Specifications

### F001: AI Tutor Chat

**Priority**: P1
**Effort**: Large
**Dependencies**: Claude API key, Lesson system

**Description**:
Interface de chat permettant aux eleves d'obtenir de l'aide sur une lecon specifique via un tuteur IA propulse par Claude.

**User Stories**:

- En tant qu'eleve, je veux poser des questions sur une lecon pour mieux comprendre
- En tant qu'eleve, je veux recevoir des indices sans la reponse directe
- En tant que parent, je veux voir l'historique des conversations de mon enfant

**Acceptance Criteria**:

- [ ] Interface de chat moderne et reactive
- [ ] Integration Claude API fonctionnelle
- [ ] Mode socratique implemente (pas de reponses directes)
- [ ] Contexte de la lecon injecte dans le prompt
- [ ] Historique des conversations sauvegarde
- [ ] Rate limiting (50 messages/jour/user)
- [ ] Indicateur de chargement pendant la reponse
- [ ] Gestion des erreurs gracieuse

**Technical Notes**:

- Utiliser streaming pour les reponses longues
- Stocker les conversations dans PostgreSQL
- Implementer une queue pour les requetes API

---

### F002: Stripe Connect Marketplace

**Priority**: P0
**Effort**: Large
**Dependencies**: Stripe account

**Description**:
Integration complete de Stripe Connect pour permettre aux enseignants de recevoir 85% des ventes automatiquement.

**User Stories**:

- En tant qu'enseignant, je veux connecter mon compte bancaire pour recevoir mes paiements
- En tant qu'eleve, je veux acheter un cours en un clic
- En tant qu'enseignant, je veux voir mes revenus en temps reel

**Acceptance Criteria**:

- [ ] Onboarding Stripe Connect Standard fonctionnel
- [ ] Creation de PaymentIntent avec application_fee
- [ ] Split automatique 85/15
- [ ] Webhooks pour payment_intent.succeeded
- [ ] Dashboard des paiements pour enseignants
- [ ] Historique des transactions
- [ ] Gestion des remboursements

**Technical Notes**:

- Utiliser Stripe Connect Standard (pas Express)
- Webhooks en endpoint separe avec signature verification
- Stocker stripe_account_id sur le User

---

### F003: Gamification System

**Priority**: P2
**Effort**: Medium
**Dependencies**: Progress tracking

**Description**:
Systeme de gamification complet inspire de Duolingo pour maximiser l'engagement.

**User Stories**:

- En tant qu'eleve, je veux gagner des XP pour chaque activite completee
- En tant qu'eleve, je veux maintenir mon streak quotidien
- En tant qu'eleve, je veux debloquer des badges et voir ma progression

**Acceptance Criteria**:

- [ ] Systeme XP (10 XP/lecon, 25 XP/quiz, bonus completion)
- [ ] Niveaux (1-50) avec seuils progressifs
- [ ] 20+ badges avec criteres varies
- [ ] Streak quotidien avec gel optionnel
- [ ] Leaderboard hebdomadaire (opt-in)
- [ ] Animations de celebration
- [ ] Sons de feedback (optionnels)

**Technical Notes**:

- Calculer XP cote serveur pour eviter triche
- Utiliser transactions Prisma pour atomicite
- Lottie pour animations complexes

---

### F004: Video Player Pro

**Priority**: P0
**Effort**: Medium
**Dependencies**: Video hosting solution

**Description**:
Player video personnalise avec toutes les fonctionnalites attendues pour l'apprentissage.

**User Stories**:

- En tant qu'eleve, je veux controler la vitesse de lecture
- En tant qu'eleve, je veux reprendre ou j'en etais
- En tant qu'eleve, je veux ajouter des marque-pages

**Acceptance Criteria**:

- [ ] Controles play/pause, volume, fullscreen
- [ ] Vitesse de lecture (0.5x - 2x)
- [ ] Boutons +10s / -10s
- [ ] Reprise automatique a la derniere position
- [ ] Marque-pages personnels
- [ ] Qualite adaptative (HLS)
- [ ] Mode picture-in-picture
- [ ] Sous-titres (si disponibles)

**Technical Notes**:

- Utiliser Video.js ou Plyr
- Sauvegarder position toutes les 10 secondes
- Format HLS pour streaming adaptatif

---

### F005: Smart Search

**Priority**: P1
**Effort**: Medium
**Dependencies**: Course data

**Description**:
Recherche instantanee avec autocomplete et filtres avances.

**User Stories**:

- En tant qu'eleve, je veux trouver rapidement un cours par mot-cle
- En tant qu'eleve, je veux filtrer par niveau et matiere
- En tant qu'eleve, je veux voir des suggestions pendant la frappe

**Acceptance Criteria**:

- [ ] Recherche full-text dans titre et description
- [ ] Autocomplete en < 200ms
- [ ] Filtres: niveau, matiere, prix (gratuit/payant), note
- [ ] Tri: pertinence, popularite, note, date
- [ ] Historique des recherches recentes
- [ ] Tolerance aux fautes de frappe
- [ ] Recherche vocale (mobile)

**Technical Notes**:

- Option 1: PostgreSQL full-text search (simple)
- Option 2: Meilisearch (si scale necessaire)
- Debounce 300ms sur l'input

---

## Backlog (Future)

### P3 - Future Enhancements

| Feature         | Description                         |
| --------------- | ----------------------------------- |
| Live tutoring   | Sessions video 1:1 avec enseignants |
| Group courses   | Cohortes avec dates de debut        |
| Certificates    | Certificats de completion           |
| API publique    | API pour integrations tierces       |
| Mobile apps     | Apps natives iOS/Android            |
| LMS integration | Integration Canvas, Moodle          |
| B2B licensing   | Licences pour ecoles                |
| Multi-language  | Support EN, ES, DE                  |
| Accessibility+  | WCAG AAA compliance                 |
| AI voice        | Interaction vocale avec le tuteur   |

---

## Success Metrics

### Phase 1 (M3)

| Metric            | Target |
| ----------------- | ------ |
| Registered users  | 1,000  |
| Published courses | 50     |
| Teacher signups   | 20     |
| Build time        | < 2min |
| Lighthouse score  | > 80   |

### Phase 2 (M6)

| Metric               | Target |
| -------------------- | ------ |
| Monthly active users | 2,500  |
| Courses completed    | 500    |
| AI tutor sessions    | 5,000  |
| Quiz attempts        | 10,000 |
| Conversion rate      | > 10%  |

### Phase 3 (M9)

| Metric               | Target   |
| -------------------- | -------- |
| Monthly active users | 5,000    |
| 7-day retention      | > 40%    |
| Average streak       | > 5 days |
| NPS                  | > 40     |
| Revenue (GMV)        | 100K EUR |

### Phase 4 (M12)

| Metric               | Target   |
| -------------------- | -------- |
| Registered users     | 10,000   |
| Monthly active users | 5,000    |
| Teacher creators     | 200      |
| Published courses    | 500      |
| Revenue (GMV)        | 500K EUR |
| Platform revenue     | 75K EUR  |

---

_Features Roadmap v1.0_
_Schoolaris - Janvier 2026_
