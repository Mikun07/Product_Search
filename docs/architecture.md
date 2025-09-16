# Software Architecture

**Project:** MikunStore  
**Version:** v0.1.0  
**Date:** 2025-06-28  
**Author:** Festus-Olaleye Ayomikun  
**Status:** Approved

---

## Table of Contents

1. [Architecture Drivers](#1-architecture-drivers)
2. [Domain Decomposition](#2-domain-decomposition)
3. [Architecture Style](#3-architecture-style)
4. [Component Architecture](#4-component-architecture)
5. [Data Architecture](#5-data-architecture)
6. [Quality Attribute Analysis](#6-quality-attribute-analysis)
7. [Cross-Cutting Concerns](#7-cross-cutting-concerns)
8. [Deployment Architecture](#8-deployment-architecture)
9. [Architecture Decision Records](#9-architecture-decision-records)
10. [Testability Assessment](#10-testability-assessment)
11. [Maintainability Assessment](#11-maintainability-assessment)
12. [Risk Assessment](#12-risk-assessment)

---

## 1. Architecture Drivers

The following quality attributes drive all architectural decisions, ranked by priority:

| Rank | Driver | Source Requirement |
|---|---|---|
| 1 | Maintainability | NFR-013, NFR-014: modular stores, single-responsibility components |
| 2 | Testability | Quality gate: all views and composables must be independently testable |
| 3 | Performance | NFR-001: Lighthouse score 90+; NFR-002: bundle under 250 KB gzipped |
| 4 | Security | NFR-007 through NFR-010: JWT in memory, HTTP-only cookies, bcrypt |
| 5 | Reliability | NFR-005, NFR-006: offline capability, state persistence |
| 6 | Accessibility | NFR-011, NFR-012: WCAG 2.1 AA, keyboard navigation |

---

## 2. Domain Decomposition

### Core Domain: Shopping

Responsible for product browsing, cart management, and checkout. This is the primary business-critical capability. All other domains support it.

Subdomains:
- Catalogue: product listing, filtering, sorting, pagination
- Product: single product detail
- Cart: item collection, quantity management, price calculation
- Checkout: receipt generation

### Supporting Domain: User Preferences

Responsible for currency conversion, language translation, and theme selection. Preferences are cross-cutting but do not drive business logic. They decorate output rather than change it.

### Supporting Domain: Favourites

Responsible for allowing a shopper to bookmark products. Not required for purchase. Stored locally for v0.1.0; server-side for v1.0.0.

### Supporting Domain: Comparison

Responsible for side-by-side product evaluation. Pure client-side logic with no persistence requirement.

### Generic Domain: Authentication (v1.0.0)

Standard identity and session management. Implemented following established JWT patterns rather than custom approaches.

---

## 3. Architecture Style

### Selected Style: Single-Page Application (SPA) with Client-Side Routing

**Justification:**

The application is catalogue-driven with real-time filtering and state that spans views (cart badge, favourites count). A server-rendered approach would require round-trips for every filter and sort interaction, introducing latency that conflicts with NFR-004 (100 ms filter response). An SPA eliminates this by keeping all filtering and state management in the browser.

**Rejected alternatives:**

| Style | Reason for rejection |
|---|---|
| Server-Side Rendering (SSR/Nuxt) | Unnecessary complexity for a catalogue with static product data; adds a Node.js server requirement that conflicts with the Vercel CDN deployment strategy |
| Multi-Page Application | Full page reload on navigation breaks the perceived performance of real-time filter interactions |
| Micro-frontends | No team boundary or independent deployment need; unjustified complexity for a single-developer project |

### Backend Style: Modular Monolith (v1.0.0)

The backend will be implemented as a modular monolith in a separate repository. Modules: Auth, Products, Cart, Orders. This satisfies the testability and maintainability drivers without the operational overhead of microservices.

**Justification:** No separate scaling requirement exists for any individual domain at this stage. Microservices would introduce distributed tracing, inter-service communication, and deployment complexity that provides no benefit at current scale.

---

## 4. Component Architecture

### Frontend Component Tree

```
App.vue
├── AppHeader.vue          (navigation: theme, language, currency, cart badge, favourites badge)
├── RouterView
│   ├── CatalogView.vue    (search, filter, sort, pagination, comparison trigger)
│   │   ├── SearchBar.vue
│   │   ├── CategoryFilter.vue
│   │   ├── SortControl.vue
│   │   ├── ProductCard.vue (repeated)
│   │   └── ComparisonModal.vue (conditional)
│   ├── ProductView.vue    (single product detail, quantity stepper, add to cart)
│   ├── CartView.vue       (item list, quantity controls, order summary, checkout)
│   └── FavoritesView.vue  (saved products, add to cart, remove)
└── AppFooter.vue
```

### Store Layer (Pinia)

```
cartStore      items, itemCount, subtotal, addItem, removeItem, updateQuantity, clearCart
favoritesStore favorites, addFavorite, removeFavorite, isFavorite
uiStore        isDark, lang, currency, t(), format(), CURRENCIES, LANGUAGES
```

### Composable Layer

```
useProducts(products, search, category, sort)  returns computed filtered+sorted list
```

### Routing

```
/                  CatalogView    (lazy-loaded)
/product/:id       ProductView    (lazy-loaded)
/cart              CartView       (lazy-loaded)
/favorites         FavoritesView  (lazy-loaded)
/:pathMatch(.*)    redirect to /
```

---

## 5. Data Architecture

### v0.1.0 Data Sources

| Data | Storage | Persistence |
|---|---|---|
| Product catalogue | `src/data/product.json` (static) | Build-time; no mutation |
| Cart state | Pinia reactive store (memory) | Lost on page reload |
| Favourites state | Pinia store + localStorage | Survives page reload |
| UI preferences (theme, lang, currency) | Pinia store + localStorage | Survives page reload |

### v1.0.0 Data Sources (planned)

| Data | Storage | Persistence |
|---|---|---|
| Product catalogue | PostgreSQL via REST API | Server-side, permanent |
| Cart state | PostgreSQL (per authenticated user) | Server-side, permanent |
| Favourites | PostgreSQL | Server-side, permanent |
| User accounts | PostgreSQL | Server-side, permanent |
| JWT access token | JavaScript memory (Pinia authStore) | Session only |
| Refresh token | HTTP-only cookie | 7-day expiry |

### Product Data Shape

```json
{
  "id": 1,
  "name": "string",
  "brand": "string",
  "category": "string",
  "price": 0.00,
  "discountPercentage": 0,
  "rating": 0.0,
  "description": "string",
  "image": "https://unsplash.com/..."
}
```

### Price Calculation Rule

```
effectivePrice = discountPercentage > 0
  ? price * (1 - discountPercentage / 100)
  : price
```

This rule is applied consistently in `cartStore.subtotal`, `ProductView.vue`, `CartView.vue`, and `FavoritesView.vue`. In v1.0.0 it will also be enforced server-side per NFR-015.

---

## 6. Quality Attribute Analysis

### Performance

- All four view components are lazy-loaded via dynamic `import()` in the router. Each becomes a separate chunk in the production build, keeping the initial bundle small.
- jsPDF (~400 KB) is dynamically imported only on checkout, satisfying NFR-003.
- Tailwind CSS purges unused styles at build time, keeping the CSS bundle minimal.
- Product filtering and sorting use `computed()` in the `useProducts` composable, which Vue only recomputes when reactive dependencies change.

### Scalability

At v0.1.0 the product catalogue is static (100 products). Filtering is O(n) in the browser. No scalability concern at this size. At v1.0.0, server-side pagination via the API will be introduced to prevent sending all products to the client.

### Reliability

- Favourites and UI preferences are written to localStorage on every mutation, satisfying NFR-006.
- The app runs entirely in the browser after initial load, satisfying NFR-005.

### Security

- No user credentials are processed in v0.1.0.
- In v1.0.0, JWT access tokens will be held in a Pinia `authStore` ref (memory only), not localStorage. A Vite proxy or HTTPS-only backend will ensure refresh token cookies can be set with `HttpOnly` and `SameSite=Strict`.

### Accessibility

- All interactive elements use semantic HTML (`<button>`, `<a>`, `<input>`).
- ARIA labels are applied to icon-only buttons (heart, cart, bin, quantity steppers).
- Colour contrast ratios for brand blue (#2079c9) on white background meet WCAG 2.1 AA (4.5:1 minimum for normal text).

### Maintainability

- The dependency direction is: components depend on composables; composables depend on stores. Stores have no UI dependencies. This satisfies NFR-013.
- Each store has a single domain responsibility: cart, favourites, or UI preferences.

---

## 7. Cross-Cutting Concerns

### State Management

Pinia stores act as the single source of truth for all shared state. Components do not hold shared state in local `ref()` variables.

### Localisation

The `uiStore.t(key)` function provides a lookup into a translations object keyed by language code. All UI text that appears in templates is routed through `t()`. Fallback is always English.

### Currency Formatting

The `uiStore.format(usdAmount)` function converts a USD base price to the active currency and formats it with the appropriate symbol. All price displays in templates use this function.

### Error Handling

At v0.1.0, error states are limited to:
- Empty search results: displayed as a localised "no results" message
- PDF generation failure: caught with a try/catch; an error toast is shown

At v1.0.0, API errors will be handled by an Axios interceptor in `src/services/apiClient.js` that maps HTTP status codes to user-facing messages and handles token refresh on 401.

### Notifications

All user-facing feedback (add to cart, add to favourites, errors) is delivered via `vue-toastification`. Toast calls are centralised in view components, not in stores, to keep stores UI-agnostic.

### Theme

Dark mode is toggled by adding or removing the `dark` class on `document.documentElement`. Tailwind CSS processes this class to apply dark-mode variants. The class toggle is handled by a `watch()` in `uiStore` so no component needs to interact with the DOM directly.

---

## 8. Deployment Architecture

### v0.1.0 Deployment

```
Developer machine
      |
      | git push
      v
GitHub (main branch)
      |
      | GitHub Actions CI (lint + build + E2E)
      v
Vercel (automatic deploy on CI pass)
      |
      | CDN edge network
      v
Browser (static assets: HTML, JS chunks, CSS)
```

**Platform:** Vercel  
**Build command:** `npm run build`  
**Output directory:** `dist/`  
**Environment variables:** none required for v0.1.0  
**Estimated cost:** Free tier (Hobby plan)

### v1.0.0 Deployment (planned)

```
Frontend repo (this repo)          Backend repo (separate)
      |                                   |
  Vercel CDN                        Railway (Node/Express)
      |                                   |
      |------- HTTPS REST API ----------->|
                                          |
                                    PostgreSQL (Railway)
```

**Frontend:** Vercel CDN (same as v0.1.0)  
**Backend:** Railway (Node.js + Express)  
**Database:** PostgreSQL on Railway  
**Estimated cost:** ~$11/month (Railway Starter plan: $5 for app + $5 for DB + nominal egress)

---

## 9. Architecture Decision Records

### ADR-001: Vue 3 SPA over React or SSR

**Context:** The existing codebase was a React 18 prototype. A full framework migration was planned as part of the governance-led rebuild.

**Options considered:**
1. Retain React 18
2. Migrate to Vue 3 SPA (Vite + Vue Router + Pinia)
3. Migrate to Nuxt 3 (SSR)

**Decision:** Vue 3 SPA with Vite.

**Consequences:**
- Positive: Pinia provides a cleaner store pattern than Redux or Context API. Vue SFCs co-locate template, logic, and styles. Vite build is faster than webpack-based setups.
- Positive: No server required; the entire application is deployable to Vercel CDN.
- Negative: Vue ecosystem is smaller than React ecosystem; fewer third-party component libraries available.
- Negative: SSR benefits (SEO, initial paint) are foregone, acceptable because this is a portfolio project with no SEO requirement.

---

### ADR-002: REST API over GraphQL (v1.0.0)

**Context:** The backend API style needed to be selected before frontend API client design.

**Options considered:**
1. REST with JSON over HTTP
2. GraphQL

**Decision:** REST API at `/api/v1/`.

**Consequences:**
- Positive: No complex nested query requirements exist for this domain. Product listing, cart management, and auth are simple CRUD operations that REST handles well.
- Positive: REST is simpler to implement, test, and document than GraphQL for this use case.
- Negative: Over-fetching of product fields is possible if the catalogue grows large. Addressed at v1.0.0 by server-side pagination and field selection parameters if needed.

---

### ADR-003: JWT in Memory with HTTP-Only Refresh Cookie (v1.0.0)

**Context:** Session management strategy needed to balance security and user experience.

**Options considered:**
1. JWT stored in localStorage
2. JWT in memory + HTTP-only cookie for refresh token
3. Session cookies only (server-side sessions)

**Decision:** JWT access token in memory (Pinia store ref) + HTTP-only refresh token cookie.

**Consequences:**
- Positive: Access token in memory is not accessible to JavaScript running in other tabs or XSS scripts, unlike localStorage.
- Positive: HTTP-only cookie prevents JavaScript from reading the refresh token.
- Negative: Access token is lost on page reload; the application must re-fetch it using the refresh token on startup. This adds a small latency on initial load.
- Negative: More complex implementation than localStorage, justified by NFR-007 and NFR-008.

---

### ADR-004: PostgreSQL over MongoDB (v1.0.0)

**Context:** A database engine needed to be selected for the backend.

**Options considered:**
1. PostgreSQL (relational)
2. MongoDB (document)
3. SQLite (embedded relational)

**Decision:** PostgreSQL.

**Consequences:**
- Positive: ACID transactions are required for NFR-015 (server-side order total calculation). MongoDB's document model does not provide native multi-document ACID transactions in free tiers.
- Positive: PostgreSQL is supported natively by Railway with automatic backups on paid plans.
- Negative: Schema migrations require more discipline than schema-less MongoDB.
- SQLite rejected: not suitable for a hosted production environment on Railway.

---

### ADR-005: Two-Repo Strategy (Frontend + Backend)

**Context:** The user specified that the backend must be in a separate repository.

**Options considered:**
1. Monorepo (frontend + backend in one repository)
2. Two separate repositories

**Decision:** Two repositories.

**Consequences:**
- Positive: Frontend can be deployed independently to Vercel without the backend being present. This supports the v0.1.0 phase where no backend exists.
- Positive: Each repository has its own CI pipeline, dependency tree, and release cadence.
- Negative: Cross-cutting type definitions (API response shapes) must be duplicated or shared via an npm package. Addressed in v1.0.0 by co-locating API types in the frontend `src/types/` directory.

---

## 10. Testability Assessment

| Layer | Testability | Notes |
|---|---|---|
| Pinia stores | High | Stores are plain JavaScript functions; no DOM required. Can be tested with Vitest in isolation. |
| Composables | High | `useProducts` takes plain refs as arguments; output is a computed ref. Testable without mounting a component. |
| View components | Medium | Require Vue Test Utils and a Pinia instance. Mounting is straightforward but requires test setup. |
| Router | High | Vue Router can be configured with memory history for tests; no browser required. |
| E2E flows | High | Cypress covers the full user journey against a running Vite preview server. |

---

## 11. Maintainability Assessment

| Concern | Assessment |
|---|---|
| Coupling | Low. Stores do not depend on components. Composables wrap stores. Components consume composables. |
| Cohesion | High. Each store has one domain. Each view has one route. |
| Complexity | Low. No circular dependencies. No shared mutable state outside stores. |
| Extensibility | Adding a new view requires: one new `.vue` file in `src/views/`, one route entry in `src/router/index.js`. No changes to existing files needed. |
| Documentation | Covered by this architecture document, the design document, and inline code comments where behaviour is non-obvious. |

---

## 12. Risk Assessment

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| vue-toastification v2 RC instability | Low | Medium | Pin to exact version in package.json; test on every CI run |
| jsPDF font limitation breaks PDF for new currencies | Low | Low | Use text prefixes (NGN, EUR) rather than Unicode symbols; documented in README |
| Vite preview server port differs from dev server in CI | Low | High | CI workflow uses `npm run preview` on port 4173 and `wait-on` to confirm readiness before Cypress runs |
| localStorage quota exceeded for large favourites lists | Very low | Low | favourites are product objects; 100 products at ~500 bytes each is ~50 KB, well within the 5 MB localStorage limit |
| v1.0.0 API contract changes break frontend | Medium | High | API versioned at `/api/v1/`; ADR-002 documents REST commitment; frontend types directory will hold response schemas |
