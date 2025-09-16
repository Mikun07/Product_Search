# Quality Engineering and Testing Strategy

**Project:** MikunStore  
**Version:** v0.1.0  
**Date:** 2025-06-28  
**Author:** Festus-Olaleye Ayomikun  
**Status:** Approved

---

## Table of Contents

1. [Quality Attribute Analysis](#1-quality-attribute-analysis)
2. [Quality Risk Assessment](#2-quality-risk-assessment)
3. [Test Strategy](#3-test-strategy)
4. [Unit Testing Plan](#4-unit-testing-plan)
5. [Integration Testing Plan](#5-integration-testing-plan)
6. [E2E Testing Plan](#6-e2e-testing-plan)
7. [Performance Testing Plan](#7-performance-testing-plan)
8. [Accessibility Testing Plan](#8-accessibility-testing-plan)
9. [Quality Gates](#9-quality-gates)
10. [Test Data Strategy](#10-test-data-strategy)
11. [Defect Management](#11-defect-management)
12. [Quality Metrics](#12-quality-metrics)
13. [Learning Concept: Mutation Testing](#13-learning-concept-mutation-testing)

---

## 1. Quality Attribute Analysis

Quality attributes are ranked by business impact for MikunStore v0.1.0:

| Rank | Attribute | Source | Target |
|---|---|---|---|
| 1 | Correctness | FR-001 to FR-028 | All acceptance criteria pass |
| 2 | Reliability | NFR-005, NFR-006 | State survives reload; app works offline after load |
| 3 | Performance | NFR-001, NFR-002, NFR-004 | Lighthouse 90+; bundle under 250 KB; filter in under 100 ms |
| 4 | Accessibility | NFR-011, NFR-012 | Zero critical axe violations; full keyboard navigation |
| 5 | Maintainability | NFR-013, NFR-014 | 80% branch coverage; no direct store imports in components |
| 6 | Security | NFR-007 to NFR-010 | v1.0.0 target; no user credentials in v0.1.0 |

---

## 2. Quality Risk Assessment

### Business Risks

| Risk | Impact | Probability | Mitigation |
|---|---|---|---|
| Cart subtotal displays incorrect amount | High: user pays wrong total | Medium | Unit test `cartStore.subtotal` with discounted and non-discounted products |
| Favourites lost on reload | Medium: poor user experience | Low | Unit test localStorage persistence in `favoritesStore` |
| PDF receipt shows wrong currency total | Medium: misleading receipt | Low | Unit test `generateReceipt` with all four supported currencies |
| Comparison modal shows wrong cheapest product | Medium: misleading comparison | Low | Unit test the `cheapestProduct` computed property in `CatalogView` |

### Technical Risks

| Risk | Impact | Probability | Mitigation |
|---|---|---|---|
| `useProducts` filter returns wrong results when search and category are both active | High: no products shown | Medium | Unit test filter composable with combined search + category inputs |
| Page does not reset to 1 on filter change | Low: user sees stale page | Medium | Cypress E2E test: change filter while on page 2; assert page resets |
| vue-toastification renders outside the mounted component tree in tests | Low: tests fail spuriously | Medium | Configure Vitest with `@vue/test-utils` global plugins to include toast container |
| Cypress tests fail because `data-testid` attributes are missing from Vue components | High: E2E suite unusable | High | Audit all components for required `data-testid` attributes before E2E run |

### Security Risks (v1.0.0)

| Risk | Impact | Probability | Mitigation |
|---|---|---|---|
| JWT stored in localStorage | High: XSS can steal token | Low (by design decision ADR-003) | Token stored in Pinia ref only |
| Refresh token readable by JavaScript | High: session hijacking | Low (by design) | HTTP-only cookie enforced server-side |
| Password submitted over HTTP | High: credential exposure | Low | HTTPS enforced at deployment level (NFR-009) |

---

## 3. Test Strategy

### Testing Pyramid

```
         /\
        /  \
       / E2E \          Cypress — 6 critical user journeys
      /--------\
     / Integration\     Vitest + MSW — API client, store + service interactions (v1.0.0)
    /--------------\
   /   Unit Tests   \   Vitest — stores, composables, utilities
  /------------------\
```

### What will be tested

- Pinia stores: all actions, all computed properties, all edge cases
- Composables: all filter and sort combinations in `useProducts`
- Utilities: `generateReceipt` with mocked jsPDF
- E2E: product load, search, category filter, comparison, responsive layout

### What will not be tested at v0.1.0

- Vue component rendering unit tests (deferred to v1.0.0 when Vitest is installed)
- API integration tests (no API exists yet)
- Security tests (no auth exists yet)

### Test execution

| Phase | Tool | When |
|---|---|---|
| Lint | ESLint | Every commit (pre-push hook planned for v1.0.0) |
| Unit | Vitest (v1.0.0) | Every CI run |
| E2E | Cypress | Every CI run (against `npm run preview`) |
| Performance | Lighthouse CI (v1.0.0) | Every CI run on main branch |
| Accessibility | axe-core via cypress-axe (v1.0.0) | Every CI run |

---

## 4. Unit Testing Plan

**Framework:** Vitest (to be installed at v1.0.0)  
**Coverage target:** 80% branch coverage on stores and composables  
**Coverage tool:** `@vitest/coverage-v8`

### cartStore tests

| Test case | Assertion |
|---|---|
| `addItem` with a new product | `items` length increases by 1; `itemCount` is 1 |
| `addItem` with an existing product | `items` length stays the same; existing item quantity increments |
| `removeItem` | Item is removed from `items`; `itemCount` decreases |
| `updateQuantity` with positive delta | Item quantity increases |
| `updateQuantity` with delta that brings quantity to 0 | Item is removed |
| `clearCart` | `items` is empty; `itemCount` is 0; `subtotal` is 0 |
| `subtotal` with no discount | Sum of `price * quantity` for all items |
| `subtotal` with discount | Sum of `price * (1 - discountPercentage / 100) * quantity` |
| `subtotal` with mixed discounted and non-discounted items | Correct combined total |

### favoritesStore tests

| Test case | Assertion |
|---|---|
| `addFavorite` | Product appears in `favorites` |
| `addFavorite` duplicate | Product appears only once |
| `removeFavorite` | Product is removed from `favorites` |
| `isFavorite` for saved product | Returns `true` |
| `isFavorite` for unsaved product | Returns `false` |
| localStorage persistence | After `addFavorite`, localStorage contains the product |
| Initialisation from localStorage | Store loads previously persisted favourites on creation |

### uiStore tests

| Test case | Assertion |
|---|---|
| `t('addToCart')` with `lang = 'en'` | Returns `'Add to Cart'` |
| `t('addToCart')` with `lang = 'fr'` | Returns `'Ajouter au panier'` |
| `t` with unknown key | Returns the key string (fallback) |
| `format(10)` with `currency = 'USD'` | Returns `'$10.00'` |
| `format(10)` with `currency = 'GBP'` | Returns `'£7.90'` |
| `format(10)` with `currency = 'NGN'` | Returns `'₦16,200'` |
| Theme toggle | `isDark` toggles; `document.documentElement` class updated |

### useProducts composable tests

| Test case | Assertion |
|---|---|
| No filters | Returns full product array |
| Search by name (exact, case-insensitive) | Returns matching products only |
| Search by brand | Returns matching products only |
| Search by category | Returns matching products only |
| Category filter | Returns only products in that category |
| Search + category combined | Returns intersection |
| Sort by name A-Z | Array is alphabetically ascending by name |
| Sort by price ascending | Array is numerically ascending by price |
| Sort by price descending | Array is numerically descending by price |
| Sort by rating descending | Array is numerically descending by rating |
| Empty search on non-empty array | Returns all products |
| Search with no matches | Returns empty array |

---

## 5. Integration Testing Plan

At v0.1.0, no backend exists. Integration tests are not applicable.

At v1.0.0, integration tests will use **Mock Service Worker (MSW)** to intercept Axios requests and return controlled responses, allowing the store + service layer to be tested end-to-end without a live backend.

### Planned v1.0.0 integration test cases

| Test case | What is verified |
|---|---|
| `cartService.addItem()` succeeds | `cartStore.items` is updated; toast is shown |
| `cartService.addItem()` returns 401 | Token refresh is attempted; item is added after retry |
| `authService.login()` with valid credentials | `authStore.token` is set; user is redirected |
| `authService.login()` with invalid credentials | `authStore.token` remains null; error toast is shown |
| `productService.getProducts()` with search param | Filtered product list is returned and rendered |

---

## 6. E2E Testing Plan

**Framework:** Cypress 13  
**Base URL:** `http://localhost:4173` (Vite preview server in CI)  
**Test file:** `cypress/e2e/appTest.cy.js`

### Current test coverage

| Test | FR covered | Status |
|---|---|---|
| Page load: product cards visible | FR-001 | Passing |
| Search by product name | FR-002 | Passing |
| Search by category | FR-002, FR-003 | Passing |
| Select and deselect for comparison | FR-020 | Passing |
| Open comparison modal | FR-021, FR-022 | Passing |
| Responsive layout (375px viewport) | NFR-001 (visual) | Passing |

### Required additions for v1.0.0

| Test | FR covered |
|---|---|
| Add to cart; assert badge count | FR-009, FR-013 |
| Adjust quantity; assert subtotal | FR-010, FR-014 |
| Remove item from cart | FR-011 |
| Toggle favourite; navigate to favourites | FR-016, FR-018 |
| Switch currency; assert price format | FR-024 |
| Switch language; assert button label changes | FR-026 |
| Toggle dark mode; assert class on html element | FR-028 |
| Register new user | FR-029 |
| Login and logout | FR-030, FR-031 |
| Checkout: PDF download initiated | FR-015 |

### data-testid attribute requirements

All E2E tests must locate elements via `data-testid` attributes, not CSS classes. The following attributes are required and must be present in Vue templates:

| Attribute | Element |
|---|---|
| `data-testid="product-card"` | Each ProductCard root element |
| `data-testid="search-input"` | SearchBar input |
| `data-testid="toggle-select-button"` | Comparison checkbox button on ProductCard |
| `data-testid="compare-selected-button"` | Floating compare button in CatalogView |
| `data-testid="comparison-modal"` | ComparisonModal root element |
| `data-testid="comparison-modal-title"` | Title heading in ComparisonModal |
| `data-testid="cart-badge"` | Cart count badge in AppHeader |
| `data-testid="favourites-badge"` | Favourites count badge in AppHeader |

---

## 7. Performance Testing Plan

### Lighthouse CI (v1.0.0)

**Tool:** `@lhci/cli` (Lighthouse CI)  
**Trigger:** Every push to `main`  
**Target:** Score 90 or above in Performance category

Metrics measured:

| Metric | Target |
|---|---|
| First Contentful Paint (FCP) | Under 1.8 s |
| Largest Contentful Paint (LCP) | Under 2.5 s |
| Total Blocking Time (TBT) | Under 200 ms |
| Cumulative Layout Shift (CLS) | Under 0.1 |
| Speed Index | Under 3.4 s |

### Bundle Size Gate

**Tool:** Vite build output analysis  
**Target:** Initial JS bundle under 250 KB gzipped (NFR-002)  
**Measured:** `npm run build` produces a `dist/assets/index-*.js` file; CI will fail if it exceeds the limit

Current build output (v0.1.0): index bundle is within target. jsPDF is a separate lazy-loaded chunk (~400 KB ungzipped) and does not count toward the initial bundle size.

---

## 8. Accessibility Testing Plan

### Automated Testing (v1.0.0)

**Tool:** `cypress-axe` (wraps axe-core)  
**Standard:** WCAG 2.1 AA  
**Gate:** Zero critical violations (NFR-011)

axe-core checks added to every Cypress test:

```js
cy.injectAxe()
cy.checkA11y(null, { includedImpacts: ['critical', 'serious'] })
```

### Manual Accessibility Checks (v0.1.0)

The following checks are performed manually until cypress-axe is added:

| Check | Requirement |
|---|---|
| All icon-only buttons have `aria-label` | NFR-012 |
| Tab order follows visual reading order | NFR-012 |
| Focus ring is visible on all interactive elements | NFR-012 |
| Colour contrast on brand blue (#2079c9) on white | WCAG AA: 4.5:1 minimum |
| Colour contrast on white text on brand blue | WCAG AA: 4.5:1 minimum |
| Language switcher is keyboard-accessible | NFR-012 |
| Modal trap focus when open | WCAG 2.1 guideline 2.1.2 |

---

## 9. Quality Gates

No deployment may proceed if any gate fails.

### Gate 1: Lint

**Tool:** ESLint with `plugin:vue/vue3-recommended`  
**Command:** `npm run lint`  
**Pass criteria:** Zero errors, zero warnings (`--max-warnings 0`)

### Gate 2: Unit Tests (v1.0.0)

**Tool:** Vitest  
**Command:** `npm run test:unit`  
**Pass criteria:** All tests pass; 80% branch coverage on `src/stores/` and `src/composables/`

### Gate 3: Build

**Tool:** Vite  
**Command:** `npm run build`  
**Pass criteria:** Build completes without errors; no TypeScript errors (when TS is added)

### Gate 4: E2E Tests

**Tool:** Cypress  
**Command:** `npm run test:e2e`  
**Pass criteria:** All 6 existing tests pass

### Gate 5: Performance (v1.0.0)

**Tool:** Lighthouse CI  
**Pass criteria:** Lighthouse Performance score 90 or above

### Gate 6: Accessibility (v1.0.0)

**Tool:** cypress-axe  
**Pass criteria:** Zero critical or serious WCAG 2.1 AA violations

---

## 10. Test Data Strategy

### v0.1.0

All test data comes from `src/data/product.json` (100 products). This file is committed to the repository and is deterministic. Tests that rely on product data use specific product ids or names from this file.

E2E tests use search terms that are guaranteed to match exactly one product (e.g. "Quinoa") or all products in a category (e.g. "Accessories"), ensuring stable assertions.

### v1.0.0

A `cypress/fixtures/` directory will hold JSON fixtures for:
- A test user (email, password)
- A seeded cart state
- A seeded product list

The backend test environment will use a separate PostgreSQL schema seeded by a migration script before each E2E run. Production data is never used in tests.

---

## 11. Defect Management

### Classification

| Severity | Definition | Example | Response Time |
|---|---|---|---|
| Critical | Functionality completely broken; no workaround | Cart subtotal is always 0 | Fix before next commit |
| Major | Core feature broken; workaround exists | PDF does not download in Firefox | Fix within current sprint |
| Minor | Edge case failure; no impact on core flow | Category filter counts show incorrect number | Fix in next minor version |
| Cosmetic | Visual issue only | Discount badge misaligned on mobile | Fix in next patch |

### Root Cause Analysis

Every Critical or Major defect requires:
1. A description of the root cause
2. The test case that would have caught it (or an explanation of why no test existed)
3. A new test added to prevent regression

---

## 12. Quality Metrics

| Metric | Target | Collection Method | Review Frequency |
|---|---|---|---|
| Unit test branch coverage | 80% | Vitest `--coverage` in CI | Every CI run |
| E2E pass rate | 100% | Cypress CI output | Every CI run |
| ESLint error count | 0 | `npm run lint` output | Every CI run |
| Lighthouse Performance score | 90+ | Lighthouse CI | Every main branch push |
| axe critical violations | 0 | cypress-axe output | Every CI run |
| Build success rate | 100% | GitHub Actions history | Weekly review |

---

## 13. Learning Concept: Mutation Testing

### What it is

Mutation testing is a technique that evaluates test suite quality by introducing deliberate faults (mutations) into production code and checking whether the test suite detects them. A mutation is a small change such as replacing `>` with `>=`, removing a return statement, or negating a condition. If the tests still pass after a mutation, the mutation has "survived," indicating a gap in test coverage.

### Why it was selected

Standard code coverage (line and branch coverage) measures whether code was executed, not whether the tests actually verify correct behaviour. A test can touch every line of `cartStore.subtotal` without ever asserting the computed value. Mutation testing exposes this gap.

### How it improves quality

Mutation testing forces tests to be specific. A test that asserts `expect(subtotal.value).toBe(89.99)` will kill a mutation that changes the discount formula. A test that merely calls `cartStore.addItem(product)` without asserting `subtotal.value` will let the mutation survive.

### Tool

**Stryker Mutator** (`@stryker-mutator/vitest-runner`) is compatible with Vitest and will be introduced at v1.1.0 to measure mutation score on `src/stores/` and `src/composables/`.

**Mutation score target:** 70% (70% of introduced mutations must be killed by the test suite).

### Trade-offs

- Mutation testing runs are slow (10-30x slower than unit tests) and are not suitable for every CI run. They are best run nightly or as a pre-release gate.
- A 100% mutation score is not the goal. Some mutations produce equivalent code (no observable behaviour change) and are acceptable survivors.

### Interview discussion

Mutation testing demonstrates an advanced understanding of test quality beyond coverage percentages. It shows that you know coverage is a necessary condition, not a sufficient one. In an interview, the answer to "how do you know your tests are good?" can include: "I use mutation testing to verify the tests are actually sensitive to faults in the logic, not just reaching the code."
