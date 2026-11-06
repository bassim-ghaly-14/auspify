# Auspify Technologies Internship

Front End Development Internship repository — Auspify Technologies.

## Organization
**Auspify Technologies**

## Role
Front End Development Intern

## Internship period
23 October 2026 – 23 November 2026

> The internship is in progress. This repository documents the completed work as it is finished; it is not a final internship submission.

## Internship task overview

| Task | Project | Status |
|------|---------|--------|
| Task 1 | Responsive Landing Page | Completed |
| Task 4 | Weather Dashboard | Pending |
| Task 5 | E-Commerce Product Interface | Completed |
| Task 6 | React Dashboard | Pending |

Only Task 1 and Task 5 are published at this stage. Task 4 and Task 6 are not started and are intentionally absent from this repository.

## Technology overview

- **Task 1 — Responsive Landing Page:** HTML5, CSS3 (CSS custom properties, responsive media queries), Vanilla JavaScript, SVG assets. No build step or framework.
- **Task 5 — E-Commerce Product Interface:** React 19, Vite, Tailwind CSS 4, Redux Toolkit, React Router, Formik/Yup, Axios, Framer Motion, React Toastify, Swiper.

## Task 5 — E-Commerce Product Interface

Implementation notes (prepared from the actual source):

- **Framework and tooling:** React 19, Vite, Tailwind CSS 4, configured
  via `vite.config.js` and `eslint.config.js`.
- **Entry point:** `src/main.jsx` renders the Redux store provider,
  React Router provider, theme context, and toast container.
- **Routing:** `src/routes/` with `react-router-dom`; pages include Home,
  Products, Cart, Checkout, Login, Register, Profile, Wishlist, and
  NotFound, plus a `ProtectedRoute`.
- **Product listing:** `Home.jsx` and `Products.jsx` render product
  cards from the Route E-Commerce API via `src/services/api.js` (axios),
  with loading skeletons and error handling.
- **Search and filtering:** search (`useProducts`, `useProductsPage`)
  plus category, brand, and price-range filters, pagination, and a
  "clear all" action.
- **Shopping cart:** Redux Toolkit slices (`cartSlice`,
  `guestCartSlice`) support authenticated and guest carts; `Cart.jsx`
  and `CartDrawer.jsx` display cart contents.
- **Other features:** theme context (light/dark/system), wishlist slice,
  Formik/Yup forms (login, register, checkout), Framer Motion animations,
  React Toastify notifications, Swiper carousels.
- **Run locally:**
  ```bash
  cd Task-5-Ecommerce
  npm install
  npm run dev      # dev server
  npm run build    # production build
  npm run preview  # preview production build
  ```
  `node_modules/` and `dist/` are gitignored and not published.

Project-specific implementation notes, features, and run instructions are documented inside each completed project directory. Full source for Task 5: `Task-5-Ecommerce/`.

## Repository structure

```
auspify/
├── Task-1-Landing-Page/      # Completed: responsive landing page (HTML/CSS/JS)
├── Task-5-Ecommerce/         # Completed: e-commerce product interface (React + Vite)
├── Task-4-Weather-Dashboard/ # Pending: not started (locally empty)
├── Task-6-React-Dashboard/   # Pending: not started (locally empty)
├── Screenshots/              # No screenshots added at this stage
├── Submission-Report.pdf     # Not tracked: to be finalized after all tasks
├── README.md
└── .gitignore
```

Task 4 and Task 6 directories exist locally as placeholders for pending work and are not tracked by Git (they are empty).

## License
This repository contains internship coursework for Auspify Technologies.
