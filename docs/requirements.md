# Requirements Specification

**Project:** MikunStore  
**Version:** v0.1.0  
**Date:** 2025-06-28  
**Author:** Festus-Olaleye Ayomikun  
**Status:** Approved

---

## Table of Contents

1. [Problem Definition](#1-problem-definition)
2. [Stakeholder Analysis](#2-stakeholder-analysis)
3. [Domain Model](#3-domain-model)
4. [User Personas](#4-user-personas)
5. [User Stories](#5-user-stories)
6. [Functional Requirements](#6-functional-requirements)
7. [Non-Functional Requirements](#7-non-functional-requirements)
8. [Requirements Validation](#8-requirements-validation)
9. [Prioritisation Matrix](#9-prioritisation-matrix)
10. [Acceptance Criteria](#10-acceptance-criteria)
11. [Traceability Matrix](#11-traceability-matrix)

---

## 1. Problem Definition

### Problem Statement

Consumers shopping online across multiple categories face fragmented experiences: prices are not comparable side by side, currency conversion requires leaving the site, and cart state disappears on browser refresh. Existing prototypes demonstrate UI concepts but do not persist user data, enforce purchase integrity, or authenticate users.

MikunStore exists to provide a single, self-contained storefront where a shopper can browse, filter, compare, and purchase products with a consistent experience across currencies, languages, and devices.

### Scope Boundary

- **v0.1.0 (current):** Frontend only. No backend. All data served from a static JSON file. No authentication. No persistent cart.
- **v1.0.0 (next):** Full e-commerce platform with authentication, persistent cart, orders, and backend REST API.

---

## 2. Stakeholder Analysis

| Stakeholder | Goals | Frustrations | Constraints |
|---|---|---|---|
| Guest shopper | Browse and compare products before deciding | Losing cart on refresh; no price transparency | No account required at v0.1.0 |
| Registered user (v1.0.0) | Save cart, view order history, checkout securely | Re-entering cart items; unclear order status | Must register with valid email |
| Store administrator (v1.0.0) | Manage product catalogue and view orders | Manual stock management; no dashboard | Admin access restricted by role |
| Developer | Extend the codebase with minimal friction | Undocumented decisions; tight coupling | Must follow governance frameworks |

---

## 3. Domain Model

### Core Entities

| Entity | Description | Key Attributes |
|---|---|---|
| Product | An item available for purchase | id, name, brand, category, price, discountPercentage, rating, description, image |
| Cart | A session-scoped collection of selected products | items[], itemCount, subtotal |
| CartItem | A product added to the cart with a quantity | productId, quantity, effectivePrice |
| Favourite | A product saved by a user for later | productId, savedAt |
| Order (v1.0.0) | A confirmed purchase with payment record | orderId, items[], total, currency, status |
| User (v1.0.0) | An authenticated shopper | userId, email, passwordHash, createdAt |

### Business Rules

- A product price is calculated as: `effectivePrice = price * (1 - discountPercentage / 100)` when `discountPercentage > 0`.
- Cart subtotal is the sum of `effectivePrice * quantity` for all cart items.
- Currency conversion applies a fixed exchange rate multiplier to all USD base prices.
- Pagination displays 20 products per page.
- Product comparison requires a minimum of 2 selected products.

---

## 4. User Personas

### Persona 1: Casual Browser

**Background:** 28-year-old professional. Shops online weekly. Uses desktop at home and mobile during commute.  
**Goals:** Find the best-priced product in a category without visiting multiple tabs.  
**Pain points:** Losing cart contents when switching tabs; hard to compare similar products.  
**Technical proficiency:** Medium.  
**Success criteria:** Can filter by category, compare two products, and add the preferred one to cart within 2 minutes.

### Persona 2: International Shopper

**Background:** 35-year-old based in Lagos. Prefers to see prices in NGN before deciding to buy.  
**Goals:** Browse in their preferred currency and language without configuration friction.  
**Pain points:** Sites that only show USD; currency conversion requires a separate tool.  
**Technical proficiency:** Medium.  
**Success criteria:** Can switch to NGN and see all prices update immediately without page reload.

### Persona 3: Returning Customer (v1.0.0)

**Background:** 42-year-old frequent buyer. Places 3-5 orders per month.  
**Goals:** Log in and find their cart from a previous session still intact.  
**Pain points:** Re-adding all items after a session expires.  
**Technical proficiency:** Low to medium.  
**Success criteria:** Cart contents survive a full browser close and reopen after login.

---

## 5. User Stories

### Core Shopping Stories

| ID | Story |
|---|---|
| US-001 | As a shopper, I want to browse all products on a single page so that I can see what is available without navigating away. |
| US-002 | As a shopper, I want to search by product name, brand, or category so that I can narrow results quickly. |
| US-003 | As a shopper, I want to filter products by category so that I can focus on a specific product type. |
| US-004 | As a shopper, I want to sort products by name, price, or rating so that I can find the most relevant result first. |
| US-005 | As a shopper, I want to view a detailed product page so that I can read the description and see a larger image before buying. |
| US-006 | As a shopper, I want to add products to a cart so that I can collect multiple items before checkout. |
| US-007 | As a shopper, I want to adjust quantities in the cart so that I can buy more than one unit of a product. |
| US-008 | As a shopper, I want to remove items from the cart so that I can change my mind without clearing everything. |
| US-009 | As a shopper, I want to see a running subtotal in the cart so that I know my total before checkout. |
| US-010 | As a shopper, I want to download a PDF receipt on checkout so that I have a record of my order. |

### Favourites Stories

| ID | Story |
|---|---|
| US-011 | As a shopper, I want to save products to a favourites list so that I can find them again without searching. |
| US-012 | As a shopper, I want to add a product from my favourites directly to the cart so that I do not need to navigate back to the catalogue. |
| US-013 | As a shopper, I want to remove products from my favourites so that I can keep the list relevant. |

### Comparison Stories

| ID | Story |
|---|---|
| US-014 | As a shopper, I want to select multiple products for comparison so that I can evaluate them side by side. |
| US-015 | As a shopper, I want the comparison modal to highlight the cheapest product so that I can identify the best value immediately. |

### Preference Stories

| ID | Story |
|---|---|
| US-016 | As an international shopper, I want to switch the display currency so that I can see prices in my local currency. |
| US-017 | As a non-English speaker, I want to switch the UI language so that I can navigate the app in my preferred language. |
| US-018 | As a shopper, I want to toggle dark mode so that I can reduce eye strain in low-light environments. |

### Auth Stories (v1.0.0)

| ID | Story |
|---|---|
| US-019 | As a new user, I want to register with an email and password so that I can create a persistent account. |
| US-020 | As a returning user, I want to log in so that I can access my saved cart and order history. |
| US-021 | As a logged-in user, I want to log out so that my account is protected on shared devices. |

---

## 6. Functional Requirements

### Catalogue

| ID | Requirement |
|---|---|
| FR-001 | The system shall display all products from the product data source on the catalogue page on load. |
| FR-002 | The system shall filter the displayed product list in real time when the user types in the search input. The filter shall apply to product name, brand, and category fields simultaneously. |
| FR-003 | The system shall filter the displayed product list by the selected category when the user clicks a category pill. |
| FR-004 | The system shall sort the displayed product list when the user selects a sort option. Supported options: Name A-Z, Price Low-High, Price High-Low, Top Rated. |
| FR-005 | The system shall reset the page to page 1 whenever the search query, category filter, or sort order changes. |
| FR-006 | The system shall display products in pages of 20. Navigation controls shall allow the user to move between pages. |

### Product Detail

| ID | Requirement |
|---|---|
| FR-007 | The system shall display a detail page for a product when the user navigates to `/product/:id`. The page shall show the product image, name, brand, category, rating, description, and effective price. |
| FR-008 | The system shall allow the user to select a quantity between 1 and 99 before adding the product to the cart. |

### Cart

| ID | Requirement |
|---|---|
| FR-009 | The system shall add a product to the cart when the user clicks the add-to-cart control. If the product already exists in the cart, the system shall increment its quantity by 1. |
| FR-010 | The system shall allow the user to increase or decrease the quantity of a cart item using stepper controls. If the quantity reaches 0, the item shall be removed automatically. |
| FR-011 | The system shall allow the user to remove a specific item from the cart. |
| FR-012 | The system shall allow the user to clear all items from the cart in a single action. |
| FR-013 | The system shall display the cart item count as a badge on the cart navigation icon. The badge shall update immediately on any cart mutation. |
| FR-014 | The system shall calculate the cart subtotal using the effective price (discount-adjusted) of each item multiplied by its quantity. |

### Checkout

| ID | Requirement |
|---|---|
| FR-015 | The system shall generate and download a PDF receipt when the user initiates checkout. The receipt shall include: receipt number, date, itemised product list, subtotal, shipping cost, and total in the selected currency. |

### Favourites

| ID | Requirement |
|---|---|
| FR-016 | The system shall add a product to the favourites list when the user activates the heart control. If the product is already in the list, the system shall remove it (toggle behaviour). |
| FR-017 | The system shall persist the favourites list to localStorage so that it survives a page reload. |
| FR-018 | The system shall display the favourites count as a badge on the favourites navigation icon. |
| FR-019 | The system shall allow the user to add a product directly to the cart from the favourites page. |

### Comparison

| ID | Requirement |
|---|---|
| FR-020 | The system shall allow the user to select products for comparison by activating a checkbox control on each product card. |
| FR-021 | The system shall display a floating compare button when 2 or more products are selected. The button label shall include the count of selected products. |
| FR-022 | The system shall open a comparison modal when the user clicks the compare button. The modal shall group products by category and highlight the lowest-priced product in each group. |
| FR-023 | The system shall display the potential saving if the user purchases the cheapest compared product instead of the most expensive. |

### Preferences

| ID | Requirement |
|---|---|
| FR-024 | The system shall convert and display all prices in the selected currency using fixed exchange rates relative to USD. Supported currencies: USD, GBP, EUR, NGN. |
| FR-025 | The system shall persist the selected currency to localStorage and restore it on next visit. |
| FR-026 | The system shall translate all UI text to the selected language immediately on change. Supported languages: English, French, Dutch, German, Swedish. |
| FR-027 | The system shall persist the selected language to localStorage and restore it on next visit. |
| FR-028 | The system shall toggle between dark and light mode when the user activates the theme control. The selection shall be persisted to localStorage. |

### Authentication (v1.0.0)

| ID | Requirement |
|---|---|
| FR-029 | The system shall allow a user to register with an email address and password. The system shall validate email format and enforce a minimum password length of 8 characters. |
| FR-030 | The system shall authenticate a registered user using email and password. On success, the system shall issue a JWT access token (in memory) and an HTTP-only refresh token cookie. |
| FR-031 | The system shall allow a logged-in user to log out. On logout, the system shall clear the access token from memory and invalidate the refresh token cookie. |

---

## 7. Non-Functional Requirements

### Performance

| ID | Requirement |
|---|---|
| NFR-001 | The application shall achieve a Lighthouse Performance score of 90 or above on a desktop device with a simulated fast 4G connection. |
| NFR-002 | The initial JavaScript bundle (excluding lazy-loaded chunks) shall not exceed 250 KB gzipped. |
| NFR-003 | The jsPDF library shall be loaded lazily and shall not be included in the initial bundle. |
| NFR-004 | Search and filter results shall update within 100 ms of the user stopping input on a mid-range device. |

### Reliability

| ID | Requirement |
|---|---|
| NFR-005 | The application shall function without a network connection after the initial page load, using locally cached data and localStorage state. |
| NFR-006 | The cart and favourites state shall survive a full browser reload. |

### Security (v1.0.0)

| ID | Requirement |
|---|---|
| NFR-007 | JWT access tokens shall be stored in memory only. They shall not be stored in localStorage or sessionStorage. |
| NFR-008 | Refresh tokens shall be stored in HTTP-only cookies with the SameSite=Strict attribute to prevent cross-site request forgery. |
| NFR-009 | All API communication shall occur over HTTPS. |
| NFR-010 | User passwords shall be hashed using bcrypt with a minimum cost factor of 12 before storage. |

### Accessibility

| ID | Requirement |
|---|---|
| NFR-011 | The application shall have zero critical accessibility violations as reported by axe-core against the WCAG 2.1 AA standard. |
| NFR-012 | All interactive controls shall be keyboard-navigable and shall have accessible labels. |

### Maintainability

| ID | Requirement |
|---|---|
| NFR-013 | No component shall import a Pinia store directly. All store access from components shall go through composables. |
| NFR-014 | Each Vue single-file component shall have a single, clearly defined responsibility. |

### Data Integrity (v1.0.0)

| ID | Requirement |
|---|---|
| NFR-015 | Order total shall be calculated server-side at the time of order creation. The client-submitted price shall not be trusted. |

---

## 8. Requirements Validation

All requirements were validated against the following criteria before approval:

| Criterion | Description | Result |
|---|---|---|
| Complete | No missing information | Pass |
| Consistent | No conflicting requirements | Pass |
| Correct | Reflects actual stakeholder needs | Pass |
| Feasible | Achievable within the chosen stack | Pass |
| Traceable | Each requirement links to a user story | Pass |
| Verifiable | Each requirement can be tested objectively | Pass |
| Unambiguous | No vague terms (fast, easy, user-friendly) remain | Pass |

---

## 9. Prioritisation Matrix (MoSCoW)

### Must Have (v0.1.0 and v1.0.0)

FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007, FR-008, FR-009, FR-010, FR-011, FR-012, FR-013, FR-014, FR-015, FR-016, FR-017, FR-018, FR-019, FR-020, FR-021, FR-022, FR-023, FR-024, FR-025, FR-026, FR-027, FR-028, FR-029, FR-030, FR-031  
NFR-001, NFR-002, NFR-003, NFR-004, NFR-005, NFR-006, NFR-007, NFR-008, NFR-009, NFR-010, NFR-011, NFR-012, NFR-013, NFR-014, NFR-015

### Should Have (v1.1.0)

- Password reset via email
- Saved delivery addresses
- Wishlist (distinct from favourites, shareable)
- Stripe test-mode payment integration

### Could Have (v1.2.0)

- Customer product reviews and ratings
- Stock level guard (prevent checkout of out-of-stock items)
- Enhanced comparison with specification table

### Won't Have (out of scope)

- Native mobile application
- Third-party social login (OAuth)
- Real-time inventory sync

---

## 10. Acceptance Criteria

### FR-001 — Display all products on load

Given the user opens the catalogue page  
When the page finishes loading  
Then all products from the data source shall be visible in the product grid

### FR-002 — Search filter

Given the user is on the catalogue page  
When the user types a term into the search input  
Then only products whose name, brand, or category contains the search term (case-insensitive) shall be displayed

### FR-003 — Category filter

Given the user is on the catalogue page  
When the user clicks a category pill  
Then only products belonging to that category shall be displayed

### FR-004 — Sort

Given the user is on the catalogue page  
When the user selects a sort option from the dropdown  
Then the product list shall be reordered according to the selected sort criterion

### FR-005 — Page reset on filter change

Given the user is on page 3 of the catalogue  
When the user changes the search query, category, or sort order  
Then the displayed page shall reset to page 1

### FR-009 — Add to cart

Given the user views a product card or detail page  
When the user clicks the add-to-cart control  
Then the product shall appear in the cart and the cart badge count shall increment by 1  
And if the product was already in the cart, the quantity shall increment by 1 without creating a duplicate entry

### FR-010 — Quantity stepper

Given the user is on the cart page  
When the user clicks the decrease button until quantity reaches 0  
Then the item shall be removed from the cart automatically

### FR-013 — Cart badge

Given the cart contains items  
When the user adds or removes any item  
Then the badge on the cart navigation icon shall reflect the updated total item count immediately

### FR-015 — PDF receipt

Given the cart contains at least one item  
When the user clicks the Checkout button  
Then a PDF file named `MikunStore_Receipt_MKN-XXXXXX.pdf` shall be downloaded  
And the PDF shall contain the product list, subtotal, and total in the selected currency

### FR-016 — Favourites toggle

Given the user views a product card  
When the user clicks the heart control  
Then the product shall be added to the favourites list and the heart shall indicate the active state  
When the user clicks the heart control again  
Then the product shall be removed from the favourites list

### FR-022 — Comparison modal

Given the user has selected 2 or more products  
When the user clicks the Compare Selected button  
Then a modal shall open showing all selected products grouped by category  
And the lowest-priced product in each group shall be visually highlighted

### FR-024 — Currency conversion

Given the user changes the currency selection  
When the new currency is active  
Then all prices in the catalogue, product detail page, cart, and PDF receipt shall reflect the converted value using the defined exchange rate

### FR-028 — Dark mode

Given the user is on any page  
When the user clicks the theme toggle  
Then the entire application shall switch between dark and light mode  
And the selection shall persist across page reloads

### FR-029 — User registration (v1.0.0)

Given the user is on the registration page  
When the user submits a valid email and a password of 8 or more characters  
Then the system shall create a new user account and redirect to the catalogue  
When the user submits an already-registered email  
Then the system shall display an error message without creating a duplicate account

### FR-030 — User login (v1.0.0)

Given the user is on the login page  
When the user submits valid credentials  
Then the system shall issue a JWT access token stored in memory and set an HTTP-only refresh token cookie  
And redirect the user to the catalogue  
When the user submits invalid credentials  
Then the system shall display an error message and not issue any token

---

## 11. Traceability Matrix

| User Story | Functional Requirement | Acceptance Criteria | Test Coverage |
|---|---|---|---|
| US-001 | FR-001 | FR-001 AC | Cypress: page load test |
| US-002 | FR-002, FR-005 | FR-002 AC, FR-005 AC | Cypress: search by name, search by category |
| US-003 | FR-003, FR-005 | FR-003 AC, FR-005 AC | Cypress: category filter |
| US-004 | FR-004, FR-005 | FR-004 AC | Manual |
| US-005 | FR-007 | FR-007 (implicit) | Manual |
| US-006 | FR-008, FR-009, FR-013 | FR-009 AC, FR-013 AC | Manual |
| US-007 | FR-010 | FR-010 AC | Manual |
| US-008 | FR-011 | FR-011 (implicit) | Manual |
| US-009 | FR-014 | FR-014 (implicit) | Manual |
| US-010 | FR-015 | FR-015 AC | Manual |
| US-011 | FR-016, FR-017, FR-018 | FR-016 AC | Manual |
| US-012 | FR-019 | FR-019 (implicit) | Manual |
| US-013 | FR-016 | FR-016 AC | Manual |
| US-014 | FR-020, FR-021 | FR-022 AC | Cypress: compare select/deselect, comparison modal |
| US-015 | FR-022, FR-023 | FR-022 AC | Cypress: comparison modal |
| US-016 | FR-024, FR-025 | FR-024 AC | Manual |
| US-017 | FR-026, FR-027 | FR-026 (implicit) | Manual |
| US-018 | FR-028 | FR-028 AC | Manual |
| US-019 | FR-029 | FR-029 AC | v1.0.0 |
| US-020 | FR-030 | FR-030 AC | v1.0.0 |
| US-021 | FR-031 | FR-031 (implicit) | v1.0.0 |
