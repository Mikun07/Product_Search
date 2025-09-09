# MikunStore

A full-featured e-commerce shopping application built with Vue 3 and Vite. Browse 100 products across 9 categories, manage a cart, save favourites, compare products, switch currencies and languages, and download a PDF receipt on checkout.

> **Built by Festus-Olaleye Ayomikun**

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [App Walkthrough](#app-walkthrough)
- [Receipt](#receipt)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Key Design Decisions](#key-design-decisions)
- [Version Roadmap](#version-roadmap)
- [Changelog](#changelog)

---

## Prerequisites

Ensure the following tools are installed before cloning:

| Tool    | Minimum Version | Check             |
|---------|-----------------|-------------------|
| Node.js | 18.x            | `node --version`  |
| npm     | 9.x             | `npm --version`   |

> This project was developed on **Node 22 / npm 11**. Any version at or above 18 should work.

---

## Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/Festus-Olaleye/Product_Search.git
cd Product_Search

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open **http://localhost:5173** in your browser. The app loads without a backend, without API keys, and without a `.env` file. All data comes from `src/data/product.json` and all images are served from Unsplash CDN.

---

## Available Scripts

| Command               | Description                                         |
|-----------------------|-----------------------------------------------------|
| `npm run dev`         | Start the Vite development server with hot reload   |
| `npm run build`       | Build for production (output to `dist/`)            |
| `npm run preview`     | Serve the production build locally                  |
| `npm run lint`        | Run ESLint across all `.js` and `.vue` files        |
| `npm run test:e2e`    | Run Cypress tests headlessly (CI mode)              |
| `npx cypress open`    | Open the Cypress interactive test runner            |

---

## App Walkthrough

### 1. Browsing the Catalogue (`/`)

The catalogue page displays all 100 products on load.

- **Search:** type in the search bar to filter by product name, brand, or category
- **Category filter:** click a pill to show only products in that category (All, Food, Drinks, Devices, Accessories, Games, Game Consoles, Lego, Books)
- **Sort:** use the dropdown to sort by Name A-Z, Price Low-High, Price High-Low, or Top Rated
- **Pagination:** products are shown 20 per page; use the navigation buttons at the bottom to move between pages

### 2. Product Card Actions

Each card exposes three interactive controls:

| Control       | Location on card       | What it does                                     |
|---------------|------------------------|--------------------------------------------------|
| Heart button  | Top-right corner       | Adds or removes the product from Favourites      |
| Checkbox      | Bottom-left of image   | Selects the product for comparison               |
| Cart button   | Bottom-right of info   | Adds one unit to the cart                        |

### 3. Product Detail Page

Click anywhere on a card (excluding the action buttons) to open the full detail page:

- View the large product image, description, brand, and rating
- Use the quantity stepper to choose how many units to add before confirming
- The cart button reflects how many units are already in your cart
- The heart button is fully synchronised with the Favourites page

### 4. Cart (`/cart`)

Access the cart via the cart icon in the header. A live badge shows the current item count.

- Adjust quantities with the stepper controls or remove items individually
- The order summary panel shows subtotal, free shipping, and total
- Click **Checkout** to download a PDF receipt

### 5. Favourites (`/favorites`)

Access favourites via the heart icon in the header. A live badge shows the current count.

- Every product you saved appears here with its image, price, and discount
- Add a product directly to the cart without leaving the page
- Remove a product from favourites using the bin button

### 6. Product Comparison

- On any product card, click the checkbox (bottom-left of the image) to select it
- Select at least two products and a floating **Compare Selected (n)** button appears at the bottom right
- Click it to open the comparison modal, which groups products by category, highlights the lowest price in green, and shows potential savings

### 7. Language

Click the globe icon in the header to switch between:

- English, Francais, Nederlands, Deutsch, Svenska

All UI text, including labels, toasts, buttons, and empty states, updates immediately. The selection is saved to `localStorage` and restored on the next visit.

### 8. Currency

Click the currency button (for example, **$ USD**) in the header to switch between:

- USD ($), GBP (£), EUR, NGN

All prices throughout the app, including catalogue cards, the detail page, cart totals, and the PDF receipt, update in real time.

### 9. Dark and Light Mode

Click the sun or moon icon in the header to toggle the theme. The selection is saved to `localStorage`.

---

## Receipt

Clicking **Checkout** generates and downloads a PDF named `MikunStore_Receipt_MKN-XXXXXX.pdf`. The PDF is built entirely in the browser using jsPDF. No server request is made.

The receipt includes:

- Mikun Store logo (drawn as vector shapes) and wordmark
- Unique receipt number, date, time, and purchaser name
- Green **PAID** badge drawn with a vector checkmark
- Itemised table: category, product name, brand, discount, quantity, unit price, and line total
- Subtotal, free shipping indicator, and grand total in the selected currency
- Thank-you footer with support contact

> **Currency symbol note:** jsPDF's built-in Helvetica font covers only Latin-1 characters. The Nigerian Naira (NGN) and Euro (EUR) symbols fall outside this range, so the receipt uses text prefixes rather than currency symbols to ensure the PDF renders correctly without embedding a custom font.

---

## Testing

End-to-end tests are written with **Cypress** and located in `cypress/e2e/appTest.cy.js`.

### Run the tests

```bash
# The development server must be running first
npm run dev

# In a second terminal, open the interactive runner
npx cypress open

# Or run headlessly
npx cypress run
```

### What the tests cover

| Test                  | What it checks                                                                          |
|-----------------------|-----------------------------------------------------------------------------------------|
| Page load             | Product cards are visible on the home page                                              |
| Search by name        | Typing "Quinoa" filters to the matching product                                         |
| Search by category    | Typing "Accessories" shows only Accessories cards                                       |
| Compare select        | The toggle checkbox changes state on click                                              |
| Comparison modal      | Selecting two products and clicking Compare opens the modal with the correct title      |
| Responsive layout     | Cards remain visible at iPhone 6, 8, X, and 14 viewport sizes (375px wide)             |

---

## Project Structure

```
Product_Search/
├── public/
│   └── mikun-logo.svg              # SVG logo (also used as browser favicon)
├── src/
│   ├── assets/
│   │   └── DP.jpg                  # Profile photo
│   ├── components/
│   │   ├── AppHeader.vue           # Navigation bar: logo, theme, language, currency, cart, favourites
│   │   ├── AppFooter.vue           # Bottom bar with copyright
│   │   ├── CategoryFilter.vue      # Category pill row
│   │   ├── ComparisonModal.vue     # Side-by-side product comparison overlay
│   │   ├── ProductCard.vue         # Grid card with image, price, and actions
│   │   ├── SearchBar.vue           # Controlled text input using v-model
│   │   └── SortControl.vue         # Sort dropdown using v-model
│   ├── composables/
│   │   └── useProducts.js          # Filter and sort logic returning a computed list
│   ├── data/
│   │   └── product.json            # 100 products: id, name, brand, category, price,
│   │                               # discountPercentage, rating, description, image
│   ├── router/
│   │   └── index.js                # Vue Router 4 with lazy-loaded route components
│   ├── stores/
│   │   ├── cartStore.js            # Cart items, quantities, and subtotal (Pinia)
│   │   ├── favoritesStore.js       # Persisted favourites list (Pinia)
│   │   └── uiStore.js              # Theme, language, currency, translations (Pinia)
│   ├── utils/
│   │   └── generateReceipt.js      # jsPDF receipt builder (lazy-loaded on checkout)
│   ├── views/
│   │   ├── CatalogView.vue         # Main grid with search, filter, sort, pagination, comparison
│   │   ├── CartView.vue            # Cart items list, order summary, and checkout
│   │   ├── FavoritesView.vue       # Saved favourites list
│   │   └── ProductView.vue         # Single product: image, description, quantity, add to cart
│   ├── App.vue                     # Root component: RouterView between header and footer
│   ├── index.css                   # Tailwind directives and custom scrollbar utility
│   └── main.js                     # App entry point: registers plugins and mounts to #app
├── cypress/
│   └── e2e/
│       └── appTest.cy.js           # End-to-end test suite
├── index.html                      # Entry HTML: sets favicon and page title
├── tailwind.config.js              # Custom colours: brand (#2079c9), obsidian (#0B0C10)
├── vite.config.js                  # Vite configuration with @vitejs/plugin-vue
└── package.json
```

---

## Tech Stack

| Layer              | Technology          | Version  |
|--------------------|---------------------|----------|
| Framework          | Vue 3               | 3.5      |
| Bundler            | Vite                | 5.4      |
| Styling            | Tailwind CSS        | 3.4      |
| Routing            | Vue Router          | 4.6      |
| State management   | Pinia               | 3.0      |
| Notifications      | vue-toastification  | 2.0 rc   |
| PDF generation     | jsPDF               | 4.2      |
| E2E testing        | Cypress             | 13.17    |
| Linting            | ESLint 8 + vue plugin | --     |

---

## Key Design Decisions

**No backend in this repository.** All product data lives in `src/data/product.json`. The app is self-contained and runs without environment variables or external services. A separate backend repository will provide the REST API for v1.0.0.

**Pinia over Vuex.** Pinia is the officially recommended state management library for Vue 3. It offers a Composition API-style store with full TypeScript support and no boilerplate mutations layer. Three React Context files were consolidated into three Pinia stores: `cartStore`, `favoritesStore`, and `uiStore`.

**Composables over direct store imports in components.** The `useProducts` composable wraps filter and sort logic in a `computed()` that components consume through a single function call. This separates data transformation logic from rendering logic.

**jsPDF lazy-loaded.** The jsPDF library is approximately 400 KB. It is imported dynamically using `import()` only when the user clicks Checkout, so it does not affect initial page load performance.

**Unsplash CDN for images.** Product images are full Unsplash URLs. No image files are committed to the repository.

**Latin-1 safe PDF text.** jsPDF's built-in Helvetica font covers only Latin-1 (ISO-8859-1). Special currency symbols are replaced with ASCII-safe text equivalents (NGN, EUR, PAID) to guarantee correct PDF rendering without requiring a custom embedded font.

**Unicode symbols over an icon library.** Instead of adding a Vue-compatible icon package, the app uses Unicode characters for interactive controls (hearts, cart, bin, stars). This eliminates an additional runtime dependency while preserving visual intent.

---

## Version Roadmap

| Version | Status      | Scope                                                                 |
|---------|-------------|-----------------------------------------------------------------------|
| v0.1.0  | Complete    | Vue 3 migration from React: Pinia, Vue Router, Vite, Tailwind        |
| v1.0.0  | Planned     | User authentication, persistent cart, orders, checkout, backend API  |
| v1.1.0  | Planned     | Stripe test mode, password reset, saved addresses, wishlist          |
| v1.2.0  | Planned     | Enhanced comparison, product reviews, stock guard                    |

---

## Changelog

All notable changes to this project are documented in this section. This project follows [Semantic Versioning](https://semver.org/).

### v0.1.0 (2025-06-28)

**Migrated from React 18 to Vue 3.**

**Why:** The React prototype had no backend, no authentication, and no persistent state. A full governance pass (Requirements Engineering, Architecture, Design, Quality, DevOps, Version Control) was completed before any code changed. The migration establishes the correct technical foundation for the v1.0.0 feature set.

**Changes:**
- Replaced React 18 with Vue 3.5 (Composition API, `<script setup>`)
- Replaced React Context API with Pinia 3 stores (cartStore, favoritesStore, uiStore)
- Replaced react-router-dom with Vue Router 4 (lazy-loaded routes)
- Replaced react-hot-toast with vue-toastification
- Replaced @vitejs/plugin-react with @vitejs/plugin-vue
- Replaced react-icons with Unicode symbols (no additional dependency)
- Deleted all `.jsx` files and rewrote as `.vue` single-file components
- Replaced `src/context/`, `src/hooks/`, `src/pages/` directories with `src/stores/`, `src/composables/`, `src/views/`
- Updated ESLint config from react plugins to `plugin:vue/vue3-recommended`
- Updated Tailwind content scan from `{js,ts,jsx,tsx}` to `{js,ts,vue}`
- Production build verified: 437 modules transformed, no errors

---

## Author

**Festus-Olaleye Ayomikun**
© 2025 Mikun Store. All rights reserved.
