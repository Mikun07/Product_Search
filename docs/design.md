# Software Design

**Project:** MikunStore  
**Version:** v0.1.0  
**Date:** 2025-06-28  
**Author:** Festus-Olaleye Ayomikun  
**Status:** Approved

---

## Table of Contents

1. [Module Catalog](#1-module-catalog)
2. [Interface Specifications](#2-interface-specifications)
3. [Domain Model Design](#3-domain-model-design)
4. [API Design (v1.0.0)](#4-api-design-v100)
5. [Data Access Design](#5-data-access-design)
6. [Dependency Analysis](#6-dependency-analysis)
7. [Error Handling Design](#7-error-handling-design)
8. [Security Design](#8-security-design)
9. [Testability Assessment](#9-testability-assessment)
10. [Maintainability Assessment](#10-maintainability-assessment)
11. [Design Decision Records](#11-design-decision-records)

---

## 1. Module Catalog

### Stores (Pinia)

| Module | File | Responsibility | Inputs | Outputs |
|---|---|---|---|---|
| cartStore | `src/stores/cartStore.js` | Manages the cart item list, counts, and subtotal | Product objects via `addItem()` | `items`, `itemCount`, `subtotal`, mutation functions |
| favoritesStore | `src/stores/favoritesStore.js` | Manages the saved favourites list; persists to localStorage | Product ids via `addFavorite()`, `removeFavorite()` | `favorites` array, `isFavorite()` |
| uiStore | `src/stores/uiStore.js` | Manages theme, language, and currency; provides `t()` and `format()` helpers | User preference selections | `isDark`, `lang`, `currency`, `t()`, `format()`, `CURRENCIES`, `LANGUAGES` |

### Composables

| Module | File | Responsibility | Inputs | Outputs |
|---|---|---|---|---|
| useProducts | `src/composables/useProducts.js` | Filters and sorts a product array based on reactive search, category, and sort refs | `products` array, `search` ref, `category` ref, `sort` ref | `computed` filtered+sorted product array |

### Views

| Module | File | Responsibility |
|---|---|---|
| CatalogView | `src/views/CatalogView.vue` | Search, filter, sort, paginate, select for comparison, open comparison modal |
| ProductView | `src/views/ProductView.vue` | Display single product detail; select quantity; add to cart; toggle favourite |
| CartView | `src/views/CartView.vue` | Display cart items; update quantities; show order summary; trigger checkout |
| FavoritesView | `src/views/FavoritesView.vue` | Display saved products; add to cart from list; remove from list |

### Components

| Module | File | Responsibility |
|---|---|---|
| AppHeader | `src/components/AppHeader.vue` | Logo, theme toggle, language selector, currency selector, cart nav, favourites nav |
| AppFooter | `src/components/AppFooter.vue` | Copyright notice |
| ProductCard | `src/components/ProductCard.vue` | Product thumbnail, price, discount badge, heart toggle, comparison checkbox, add-to-cart |
| SearchBar | `src/components/SearchBar.vue` | Controlled text input; emits `update:modelValue` |
| CategoryFilter | `src/components/CategoryFilter.vue` | Pill row of category options; emits `select` |
| SortControl | `src/components/SortControl.vue` | Sort dropdown; emits `update:modelValue` |
| ComparisonModal | `src/components/ComparisonModal.vue` | Overlay showing selected products grouped by category; emits `close` |

### Utilities

| Module | File | Responsibility |
|---|---|---|
| generateReceipt | `src/utils/generateReceipt.js` | Builds and downloads a jsPDF receipt; lazy-loaded on checkout |

---

## 2. Interface Specifications

### cartStore public interface

```js
// State
items: Ref<CartItem[]>

// Computed
itemCount: ComputedRef<number>   // sum of all item quantities
subtotal: ComputedRef<number>    // sum of effectivePrice * quantity per item, in USD

// Mutations
addItem(product: Product): void           // adds or increments quantity
removeItem(productId: number): void       // removes item by id
updateQuantity(productId: number, delta: number): void  // applies delta; removes if qty <= 0
clearCart(): void                          // empties the cart
```

### favoritesStore public interface

```js
// State
favorites: Ref<Product[]>

// Actions
addFavorite(product: Product): void
removeFavorite(productId: number): void
isFavorite(productId: number): boolean
```

### uiStore public interface

```js
// State
isDark: Ref<boolean>
lang: Ref<string>        // 'en' | 'fr' | 'nl' | 'de' | 'sv'
currency: Ref<string>    // 'USD' | 'GBP' | 'EUR' | 'NGN'

// Constants
CURRENCIES: Array<{ code, symbol, label }>
LANGUAGES: Array<{ code, label }>

// Methods
t(key: string): string           // returns translated string; falls back to English
format(usdAmount: number): string // converts USD to active currency; returns formatted string
```

### useProducts composable interface

```js
// Inputs
useProducts(
  products: Product[],      // static source array
  search: Ref<string>,      // reactive search query
  category: Ref<string>,    // reactive category filter
  sort: Ref<string>         // reactive sort key
): ComputedRef<Product[]>   // filtered and sorted result
```

### ProductCard component interface

```
Props:
  product: Product     (required)
  isSelected: boolean  (required) — comparison checkbox state

Emits:
  toggle-select        — user clicked the comparison checkbox
```

### SearchBar component interface

```
Props:
  modelValue: string   (required)

Emits:
  update:modelValue(value: string)
```

### CategoryFilter component interface

```
Props:
  modelValue: string   (required) — active category

Emits:
  update:modelValue(value: string)
```

### SortControl component interface

```
Props:
  modelValue: string   (required) — active sort key

Emits:
  update:modelValue(value: string)
```

### ComparisonModal component interface

```
Props:
  products: Product[]   (required) — selected products to compare

Emits:
  close                 — user dismissed the modal
```

### generateReceipt interface

```js
generateReceipt({
  items: CartItem[],
  subtotal: number,      // in USD
  currency: string,      // 'USD' | 'GBP' | 'EUR' | 'NGN'
  rates: Record<string, number>
}): void                 // triggers browser file download; returns nothing
```

---

## 3. Domain Model Design

### Entities

**Product**
- Defined in `src/data/product.json` at v0.1.0; served via API at v1.0.0
- Immutable from the client perspective; no mutation allowed
- Attributes: `id` (number), `name` (string), `brand` (string), `category` (string), `price` (number, USD), `discountPercentage` (number, 0-100), `rating` (number, 0-5), `description` (string), `image` (URL string)

**CartItem**
- Derived from Product when added to cart
- Extends Product with `quantity: number`
- Mutable: quantity changes via `cartStore.updateQuantity()`

**Favourite**
- A full Product object stored in `favoritesStore.favorites`
- Persisted to localStorage as a JSON array on every mutation

**UIPreference (Value Object)**
- No identity; just the combination of `isDark`, `lang`, and `currency`
- Each is persisted independently to localStorage

### Business Rules Location

All price calculation logic lives in the store layer or utility functions, not in templates:

| Rule | Location |
|---|---|
| Effective price | `effectivePrice()` helper in each view (CartView, FavoritesView, ProductView) |
| Cart subtotal | `cartStore.subtotal` computed property |
| Currency formatting | `uiStore.format()` |
| PDF currency conversion | `generateReceipt.js` internal conversion using passed `rates` map |

Templates never perform arithmetic. They consume computed values and call store actions.

---

## 4. API Design (v1.0.0)

All endpoints are prefixed with `/api/v1/`. All responses use `Content-Type: application/json`. Errors return a `{ message: string, code: string }` body.

### Authentication

| Method | Path | Description | Auth required |
|---|---|---|---|
| POST | `/api/v1/auth/register` | Create new user | No |
| POST | `/api/v1/auth/login` | Issue access + refresh tokens | No |
| POST | `/api/v1/auth/refresh` | Rotate refresh token; issue new access token | Cookie |
| POST | `/api/v1/auth/logout` | Invalidate refresh token | Cookie |

### Products

| Method | Path | Description | Auth required |
|---|---|---|---|
| GET | `/api/v1/products` | List products with optional `?search=`, `?category=`, `?sort=`, `?page=`, `?limit=` | No |
| GET | `/api/v1/products/:id` | Get single product | No |

### Cart (v1.0.0)

| Method | Path | Description | Auth required |
|---|---|---|---|
| GET | `/api/v1/cart` | Get current user's cart | Yes |
| POST | `/api/v1/cart/items` | Add item to cart | Yes |
| PATCH | `/api/v1/cart/items/:productId` | Update quantity | Yes |
| DELETE | `/api/v1/cart/items/:productId` | Remove item | Yes |
| DELETE | `/api/v1/cart` | Clear cart | Yes |

### Orders (v1.0.0)

| Method | Path | Description | Auth required |
|---|---|---|---|
| POST | `/api/v1/orders` | Create order from current cart; calculates total server-side | Yes |
| GET | `/api/v1/orders` | List user's orders | Yes |
| GET | `/api/v1/orders/:orderId` | Get order detail | Yes |

---

## 5. Data Access Design

### v0.1.0

Product data is imported directly as a JSON module in `CatalogView.vue`:

```js
import products from '../data/product.json'
```

No repository pattern is needed at this stage because data is read-only and does not change at runtime.

### v1.0.0 (planned)

A centralised API client will be created at `src/services/apiClient.js`. It will be an Axios instance configured with:
- `baseURL` pointing to the backend API
- A request interceptor that attaches the JWT access token from `authStore`
- A response interceptor that catches 401 errors, calls the refresh endpoint, retries the failed request once, and logs the user out if the retry also fails

Service modules will wrap the API client:

```
src/services/
  apiClient.js          Axios instance + interceptors
  productService.js     getProducts(), getProduct(id)
  cartService.js        getCart(), addItem(), updateQuantity(), removeItem(), clearCart()
  orderService.js       createOrder(), getOrders(), getOrder(id)
  authService.js        register(), login(), refresh(), logout()
```

Stores will call service modules, not the API client directly. This ensures stores remain testable by mocking the service layer.

---

## 6. Dependency Analysis

### Dependency Direction (enforced)

```
Templates (Vue SFCs)
    |
    v
Composables (useProducts)
    |
    v
Pinia Stores (cartStore, favoritesStore, uiStore)
    |
    v (v1.0.0 only)
Service modules (apiClient wrappers)
    |
    v
External API / localStorage / JSON file
```

Components do not import stores directly. This is the Dependency Inversion enforcement described in NFR-013.

### Violations to Prevent

- A store must not import another store (would create circular reactive dependencies).
- A composable must not import a view component.
- A utility function (`generateReceipt`) must not import any store. It receives all data it needs as function arguments.

### Current Dependency Map

| Module | Depends On |
|---|---|
| AppHeader.vue | uiStore, favoritesStore, cartStore, vue-router |
| CatalogView.vue | useProducts, cartStore, favoritesStore, uiStore |
| ProductView.vue | cartStore, favoritesStore, uiStore, vue-router |
| CartView.vue | cartStore, uiStore, generateReceipt (lazy) |
| FavoritesView.vue | favoritesStore, cartStore, uiStore |
| useProducts.js | (none — pure function accepting refs) |
| cartStore.js | pinia |
| favoritesStore.js | pinia |
| uiStore.js | pinia |
| generateReceipt.js | jspdf (lazy import at call site) |

---

## 7. Error Handling Design

### Validation Errors (v0.1.0)

| Scenario | Handling |
|---|---|
| Product not found by route id | `ProductView` displays a localised "not found" message; no redirect |
| Empty search results | `CatalogView` displays a localised "no results" message |
| PDF generation fails | Caught in `CartView.handleCheckout()` try/catch; error toast shown |

### Infrastructure Failures (v1.0.0)

| Scenario | Handling |
|---|---|
| API request fails (network error) | Axios interceptor catches; toast shown; no state mutation |
| 401 Unauthorized | Interceptor calls refresh endpoint; retries once; logs out on second failure |
| 422 Validation error | Extracted from response body; displayed in the relevant form field |
| 500 Server error | Generic "Something went wrong" toast; error logged to console |

### Error Handling Principles

- Errors are never silently swallowed.
- Every catch block either shows a user-facing message or rethrows.
- Toast messages use the `uiStore.t()` translation function so they respect the active language.

---

## 8. Security Design

### v0.1.0

No authentication or sensitive data handling exists. The only browser storage used is localStorage for preferences and favourites, which contain no PII.

### v1.0.0

| Concern | Control |
|---|---|
| XSS prevention | Vue's template binding escapes HTML by default; no use of `v-html` with user-provided data |
| CSRF prevention | JWT in memory (not cookie) for access; refresh cookie uses `SameSite=Strict` |
| Credential exposure | Passwords never stored or logged on the frontend; only submitted to `/api/v1/auth/login` |
| Token storage | Access token in Pinia `authStore.token` ref (JavaScript memory only) |
| Input validation | All form inputs validated client-side before submission; backend re-validates independently |
| Sensitive data in localStorage | No tokens in localStorage; only preferences and favourites |

---

## 9. Testability Assessment

| Module | Strategy | Difficulty |
|---|---|---|
| cartStore | Create with `setActivePinia(createPinia())`; call actions; assert state | Low |
| favoritesStore | Same as cartStore; mock localStorage with `vi.stubGlobal` | Low |
| uiStore | Assert `t()` returns correct translation keys; assert `format()` output | Low |
| useProducts | Pass plain arrays and refs; assert computed output | Low |
| ProductCard | Mount with `@vue/test-utils`; verify emit on button click | Medium |
| CatalogView | Mount with router and Pinia; simulate search input; assert product count | Medium |
| CartView | Mount with items pre-loaded in cartStore; assert subtotal display | Medium |
| E2E (Cypress) | Run against `npm run preview`; assert DOM against data-testid attributes | Low (already in place) |

---

## 10. Maintainability Assessment

### What makes this design easy to extend

- Adding a new currency requires one entry in `uiStore.CURRENCIES` and one entry in `uiStore.RATES`. No component changes.
- Adding a new language requires one translation object in `uiStore.translations` and one entry in `uiStore.LANGUAGES`. No component changes.
- Adding a new view requires one `.vue` file in `src/views/` and one route in `src/router/index.js`.
- Adding a new sort option requires one entry in the `SORT_FNS` map in `useProducts.js`. No view changes.

### What carries technical debt

- `effectivePrice()` is defined as a local function in three separate view files (CartView, FavoritesView, ProductView). It should be extracted to a shared composable or utility in v1.0.0 when unit tests are added.
- The `RATES` exchange rate map is duplicated between `uiStore.js` and `CartView.vue` (for PDF generation). In v1.0.0 this should move to a single `src/constants/rates.js` file.

---

## 11. Design Decision Records

### DDR-001: Pinia over Vuex

**Context:** Vue 3 state management library needed to be selected.

**Options considered:**
1. Vuex 4 (official Vue 3 compatible version)
2. Pinia (official Vue 3 successor to Vuex)

**Decision:** Pinia.

**Consequences:**
- Positive: Pinia uses the Composition API natively. Store definitions look identical to `<script setup>` component logic. No mutations layer required (Vuex had `mutations` as a separate concept from `actions`).
- Positive: Pinia is the officially recommended store for Vue 3 as of 2022.
- Negative: Pinia 3 (used here) has minor API differences from Pinia 2 documentation that is more widely available online. All patterns used are compatible with both versions.

---

### DDR-002: Composables over Direct Store Imports in Components

**Context:** Components need access to filtered and sorted product lists. The filter and sort logic could live in the component, in a store, or in a composable.

**Options considered:**
1. Filter and sort logic in `CatalogView.vue` directly
2. Filter and sort logic in a `productStore`
3. Filter and sort logic in a `useProducts` composable

**Decision:** `useProducts` composable (option 3), satisfying NFR-013.

**Consequences:**
- Positive: The composable is independently testable without mounting a component.
- Positive: The composable can be reused in any future view that needs a filtered product list.
- Positive: `CatalogView.vue` is responsible only for rendering and user interaction, not data transformation.
- Negative: One additional file. Acceptable given the testability and reuse benefit.

---

### DDR-003: Unicode Symbols over an Icon Library

**Context:** Interactive controls in the UI require icons (heart, cart, bin, star, theme toggle).

**Options considered:**
1. react-icons (React-specific; not applicable after migration)
2. Heroicons for Vue (additional npm dependency)
3. Unicode characters and emoji

**Decision:** Unicode characters.

**Consequences:**
- Positive: Zero additional npm dependency; zero additional bundle size.
- Positive: No import required in any component file.
- Negative: Limited to available Unicode characters; custom icon designs are not possible without SVG.
- Negative: Rendering varies slightly across operating systems for emoji. Acceptable for a portfolio project.
- Future consideration: If a consistent icon set becomes a visual requirement, Heroicons (MIT-licensed, tree-shakeable) is the preferred replacement.
