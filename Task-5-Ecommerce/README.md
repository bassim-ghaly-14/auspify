# TRADO Store

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646464?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-764ABC?logo=redux&logoColor=white)
![React Router](https://img.shields.io/badge/React%20Router-CA4245?logo=reactrouter&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-000000?logo=axios&logoColor=white)

E-commerce frontend for discovering, browsing, and purchasing products. Shoppers can browse the product catalog, search and filter products, view product details, manage a shopping cart, save items to a wishlist, and place cash-on-delivery orders — either as a guest or signed in for an authenticated experience.

The application consumes the public Route E-Commerce API (`https://ecommerce.routemisr.com`) for all product, authentication, cart, wishlist, and order data. This repository contains the frontend only; the backend is external and is not part of this project.

## Table of contents

- [Overview](#overview)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Project architecture](#project-architecture)
- [Getting started](#getting-started)
- [API integration](#api-integration)
- [Demo credentials](#demo-credentials)
- [Available scripts](#available-scripts)
- [Important notes](#important-notes)
- [Project status](#project-status)
- [Author](#author)

## Overview

TRADO Store is a frontend-only e-commerce application. Its main purpose is to let customers browse products, apply search and filters, inspect product details, manage a cart, save favorites to a wishlist, and check out. The core user experience supports both guest browsing (no account required) and an authenticated experience with a server-side cart and wishlist.

The frontend is built with React 19 and Vite, styled with Tailwind CSS 4, and depends on the external Route E-Commerce API for live data. State is managed with Redux Toolkit, routing with React Router, and data fetching with Axios.

## Features

### Shopping experience

- **Product catalog** — paginated product grid fetched from the Route API.
- **Product details** — dedicated product page with price, discount, category, brand, rating, and stock.
- **Search** — debounced keyword search. When the server keyword search returns no results, a client-side fallback scans the available catalog by title and description so shoppers still see relevant matches.
- **Category and brand filters** — dropdowns populated from the API.
- **Price range filters** — minimum and maximum price (EGP).
- **Clear all** — reset every active filter at once.
- **Pagination** — server-driven page navigation; client-side pagination applies to fallback search results.
- **Responsive product cards** — add to cart and add to wishlist directly from product cards.

### Cart & wishlist

- **Guest shopping cart** — cart persisted in localStorage so it survives page refreshes; no sign-in required.
- **Authenticated cart** — server-side Route API cart (the source of truth for signed-in users), hydrated on login.
- **Quantity management** — increase or decrease item quantity in the cart drawer and cart page.
- **Cart drawer and cart page** — slide-over cart drawer from the navbar plus a dedicated cart page.
- **Wishlist** — save and remove products (signed-in users; server-side).

### Authentication

- **Sign up and sign in** — JWT-based authentication with client-side form validation.
- **Protected routes** — the profile page requires sign in.
- **Guest vs authenticated behavior** — guests browse, search, and use a local guest cart; signing in switches to the server cart and wishlist.

### Interface & UX

- **Responsive design** — mobile-friendly layout with a collapsible mobile menu.
- **Light and Dark themes** — theme toggle (light / dark / system), persisted across sessions.
- **Loading states** — skeletons for product grids and product details.
- **Empty states** — guidance shown when no products, cart, or wishlist items exist.
- **Error handling** — error messages for failed requests and 401 token-expiry handling.
- **Toast feedback** — success, info, and error notifications.

## Tech stack

| Technology | Role |
| --- | --- |
| React 19 | UI library |
| Vite | Build tool and development server |
| Tailwind CSS 4 | Styling |
| Redux Toolkit | State management (auth, cart, guest cart, wishlist) |
| React Router v7 | Client-side routing |
| Axios | API client with authorization-token interceptor |
| Formik + Yup | Form handling and validation (checkout) |
| Framer Motion | Animations |
| React Toastify | Toast notifications |
| Swiper | Carousels |
| react-icons | Icons |

## Project architecture

```
src/
├── main.jsx            # App entry: Redux store, router, theme, toasts
├── index.css           # Global styles
├── routes/             # Route configuration and route guards
│   ├── index.jsx       # Browser router with lazy-loaded routes
│   └── ProtectedRoute.jsx  # Sign-in guard for /profile
├── pages/              # Route-level views
│   ├── Home.jsx
│   ├── Products.jsx
│   ├── ProductDetails.jsx
│   ├── Cart.jsx
│   ├── Checkout.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Profile.jsx
│   ├── Wishlist.jsx
│   └── NotFound.jsx
├── components/         # Reusable UI components
│   ├── cart/           # CartDrawer
│   ├── common/         # ProductCard, ProductFilters, skeletons, etc.
│   ├── layouts/        # Navbar, MainLayout, Footer, MobileMenu
│   └── ui/             # Button, Input, Container, GlassCard, Skeleton
├── context/            # ThemeContext (light / dark / system)
├── hooks/              # useProducts, useProductsPage, useAddToCart, useTheme
├── services/           # api.js — Axios client and API functions
├── store/              # Redux slices (cart, auth, wishlist, guestCart)
└── utils/              # normalizeCartItem.js
```

- **components** — presentational and interactive UI building blocks (cards, filters, layouts, cart drawer).
- **pages** — route-level views wired to hooks and the Redux store.
- **hooks** — encapsulated data-fetching and cart/search logic.
- **services** — Axios instance and API functions pointing at `https://ecommerce.routemisr.com`.
- **store** — Redux Toolkit slices and store configuration; the auth token and guest cart are persisted to localStorage.
- **context** — theme state (light / dark / system) exposed to the whole app.
- **utils** — cart-item normalization for the Route API v2 response shape.

There is no separate committed `assets/` folder; product and brand images are served by the API / image host.

## Getting started

```bash
git clone https://github.com/bassim-ghaly-14/auspify.git
cd auspify/Task-5-Ecommerce
npm install
npm run dev
```

The Vite development server starts, typically at `http://localhost:5173`. `node_modules/` and `dist/` are gitignored and not published.

## API integration

All live data depends on the external Route E-Commerce API:

```
https://ecommerce.routemisr.com
```

Key areas consumed by the frontend:

- **Products, categories, brands** — `GET /api/v1/products`, `/api/v1/categories`, `/api/v1/brands`
- **Authentication** — `POST /api/v1/auth/signup` and `/api/v1/auth/signin` (JWT)
- **Cart** — `GET/POST/PUT/DELETE /api/v2/cart` (authenticated users)
- **Wishlist** — `GET/POST/DELETE /api/v1/wishlist` (authenticated users)
- **Orders** — `POST /api/v1/orders/:cartId` (cash on delivery)

Important:

- The backend is external and is not part of, owned by, or modified in this repository. This project is frontend-only.
- The API must be reachable for the app to load products and to authenticate.
- Keyword search fallback — the Route API keyword search can return zero results for known titles. When that happens, the app fetches a larger page of the catalog and filters matches client-side by title and description, then paginates those results locally. A notice ("Server search unavailable — showing matches from the available catalog") is shown when the fallback is active.
- No API tokens or private credentials are stored in this repository.

## Demo credentials

Use this free demo account to explore the authenticated experience. You can also browse the application without signing in using Guest Mode.

| Field | Value |
| --- | --- |
| Email | chatZ@gamil.com |
| Password | Z54321 |

Preserve these values exactly as shown. They are demo/testing credentials only, not administrator accounts.

## Available scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the production build locally |

## Important notes

- **External API availability** — the app requires `https://ecommerce.routemisr.com` to be reachable to load products and authenticate.
- **Guest vs authenticated cart** — guests use a localStorage-persisted guest cart; signed-in users use the server Route API cart. The two carts are never merged.
- **Demo account** — the credentials above are for evaluation. Register your own account via Sign Up if you prefer.
- **Configuration** — no environment file is required; the API base URL is configured in `src/services/api.js`.

## Project status

This is an existing frontend e-commerce project that has been enhanced to meet the Task 5 requirements (product catalog, search and filtering, category/brand/price filters, pagination, product details, guest and authenticated carts, cart drawer, wishlist, authentication, and light/dark themes). It is maintained for internship evaluation and is not represented as a finished commercial product.

## Author

Bassim Ghaly — https://github.com/bassim-ghaly-14
