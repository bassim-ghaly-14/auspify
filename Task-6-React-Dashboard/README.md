# Auspify Insights — React Analytics Dashboard

A modern, production-quality analytics dashboard built with React, Vite, TypeScript, and Tailwind CSS. Demonstrates real API integration, interactive charts with Recharts, reusable UI components, responsive design, and professional SaaS aesthetics.

## Project Overview

Auspify Insights is a dashboard for monitoring an e-commerce catalog and its related activity. It consumes data from the [DummyJSON](https://dummyjson.com) public APIs and derives meaningful analytics metrics strictly from the actual responses — no fabricated data, no invented historical transactions.

The application is structured as a feature-oriented React project with centralized state management, custom hooks, a dedicated API service layer, and reusable UI components. It is designed to be responsive from 320px to 1440px, accessible, and ready for professional presentation.

## Main Features

• Professional dashboard layout with sidebar navigation, top bar, and main content area
• Reusable UI components: Button, Card, Badge, Avatar, Input, Select, EmptyState, ErrorState, PageLoader, ThemeToggle
• Dynamic API integration: Fetches products, users, and carts from DummyJSON with loading, error, retry, and manual refresh states
• Analytics overview: KPI stat cards for total products, users, carts, cart value, average rating, and low-stock items
• Interactive charts (all values derived from API data):
  • Products by category (BarChart)
  • Product price distribution (BarChart)
  • Inventory stock status (In Stock / Low Stock / Out of Stock)
  • Product rating analysis
  • Cart value distribution
• Products section: Search, category filtering, sorting, pagination — all functional
• Users section: User listing with avatar, name, email, department — responsive
• Search, filtering, and sorting: All work against real data, not just decorative
• Theme toggle: Light / dark / system with persistent preference
• Responsive design: Optimized for 320px, 375px, 390px, 768px, 1024px, 1280px, 1440px
• Accessibility: Semantic HTML, focus-visible outlines, color-contrast aware, prefers-reduced-motion support
• TypeScript throughout: Centralized types, no `any`, strict mode enabled
• Production-ready build: `npm run build` generates optimized static assets

## Technology Stack

| Category | Technologies |
|----------|-------------|
| Framework | React 19, Vite 8 |
| Styling | Tailwind CSS 4 |
| Charts | Recharts 3 |
| Icons | Lucide React |
| Type Safety | TypeScript 5.8 (strict mode) |
| Linting | ESLint 10 + typescript-eslint |
| Formatting | Prettier 3 |
| Build | Vite 8 production build |

## Architecture

```
Task-6-React-Dashboard/
‘‘‘
Task-6-React-Dashboard/
‘‘‘

### Key Design Decisions

• Feature-oriented structure: Each concern (products, users, analytics) lives in its own `features/` directory with its own service, hook, and presentation components
• API service layer: `src/services/apiClient.ts` centralizes all fetch logic — timeout, retries on server errors (5xx/429), AbortController support for stale-request prevention
• Centralized types: `src/types/index.ts` defines Product, User, Cart, AnalyticsMetrics, and derived types in one place
• No global state store: Uses a lightweight refresh dispatcher (`DataProvider` + `register`) instead of Redux; each feature registers its own retry function
• Responsive sidebar: On mobile the sidebar slides in over the content; on desktop it’s a fixed vertical navigation
• Demo data disclaimer: Every metric explicitly states its DummyJSON source; `Total Cart Value` is used (not `Revenue`); no fabricated time-series data

## Data Sources and API Endpoints

All data is fetched from the public [DummyJSON](https://dummyjson.com) API. No API key is required.

| Dataset | Endpoint | Purpose |
|---------|----------|---------|
| Products | `https://dummyjson.com/products?limit=100` | Product catalog with title, price, category, rating, stock, images |
| Users | `https://dummyjson.com/users?limit=100` | Demo user accounts with name, email, company, avatar |
| Carts | `https://dummyjson.com/carts?limit=100` | Shopping carts with products and totals |

### Derived Metrics (strictly from API responses)

• **Total products** — `products.length` from the Products API
• **Total users** — `users.length` from the Users API
• **Total carts** — `carts.length` from the Carts API
• **Total cart value** — sum of `cart.total` across all carts from the Carts API. *Note: demo cart values are not completed sales revenue.*
• **Average product rating** — arithmetic mean of `product.rating` across all products
• **Low stock items** — products with 1–15 units remaining
• **Out of stock items** — products with `stock === 0`
• **Price distribution** — products binned into `$0–$25`, `$25–$50`, `$50–$100`, `$100–$200`, `$200+` based on `product.price`
• **Stock status** — counts of In Stock / Low Stock / Out of Stock
• **Rating distribution** — products binned into rating bands 0–1·5, 1–2·5, 2–3·5, 3–4·5, 4–5·5
• **Cart value distribution** — carts binned by total value into `$0–$50`, `$50–$100`, `$100–$200`, `$200+`

### Stale-Request Prevention

Each dataset is fetched once per component mount via `useDataFetch`, which creates an `AbortController` per request. If a component re-mounts (e.g., navigation), the previous request is aborted so it cannot overwrite newer results.

### Retry Mechanism

The `useDataFetch` hook exposes a `retry` function. The shell’s `Refresh data` button calls `refreshAll` which triggers every registered dataset’s retry. Individual pages can also register their own retry via `useRegisterRefresh`.

### Manual Refresh

Users can click the `Refresh data` button in the top navigation header to re-fetch all three datasets. The button shows a loading spinner while fetching.

## Installation and Setup

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Open http://localhost:5173 in a browser

### Available scripts:
  `npm run dev` — Start Vite dev server
  `npm run build` — Produce production build (dist/)
  `npm run preview` — Preview the production build locally
  `npm run lint` — Run ESLint
  `npm run typecheck` — Run TypeScript type-check (tsc --noEmit)

## Production Build

```bash
npm run build

The output is in `dist/`. The build includes:
- Minified CSS and JS
- Code splitting per route (Dashboard, Products, Users)
- Optimized assets
- `index.html` with correct `<base>` for Vercel deployment

## Deployment (Vercel)

1. Push this repository to a Git remote (GitHub, GitLab, or Bitbucket).
2. Connect the repository to [Vercel](https://vercel.com).
3. Vercel will auto-detect Vite/React/TypeScript configuration.
4. Ensure the build command is `npm run build` and the output directory is `dist`.
5. Deploy.

### Environment variables

None are required for this project since all API endpoints are hardcoded to `https://dummyjson.com`. If you need to override the base URL, set `VITE_API_BASE` in the Vercel environment variables (the `apiClient.ts` reads `import.meta.env.VITE_API_BASE || 'https://dummyjson.com'`).

## Screenshots

| Viewport | Description |
|----------|-------------|
| Desktop (1440px) | Full analytics dashboard with sidebar, charts, and KPI cards |
| Laptop (1024px) | Compact layout with adapted sidebar |
| Tablet (768px) | Sidebar collapses, stacked chart rows |
| Mobile (375px) | Full-width layout, drawer navigation, single-column charts |

*Screenshots can be captured with the development server running. Save them in the `Screenshots/Task-6/` directory.*

## Known Limitations

- **DummyJSON is a demonstration API**: All data is sample/demo data. Metrics such as `Total Cart Value` are derived from cart totals that represent simulated shopping carts, not real completed revenue or business financials.
- **No historical time-series data**: DummyJSON does not provide timestamped activity. Charts use category, price, stock, and rating distributions instead of invented transaction series.
- **Limited user privacy**: The Users section displays name, department, and email only. No sensitive personal data (phone, address, ID numbers) is shown.
- **Cart data is static per request**: The Carts API returns a fixed snapshot; manual refresh is required to see changes.
- **No authentication or persistence**: This is a frontend-only demo. No user accounts, login, or server-side state is implemented.
- **No server-side rendering (SSR)**: The app is client-side rendered via Vite.

## Completion Checklist

- ☐ Professional dashboard layout with sidebar, top bar, and main content area
- ☐ Reusable UI components (Button, Card, Badge, Avatar, Input, Select, EmptyState, ErrorState, PageLoader, ThemeToggle)
- ☐ React architecture with feature-oriented organization
- ☐ Dynamic API integration (Products, Users, Carts from DummyJSON)
- ☐ Meaningful analytics metrics derived from actual API responses
- ☐ Multiple interactive charts (5 charts via Recharts, all values from fetched data)
- ☐ Functional products section (listing, search, category filter, sort, pagination)
- ☐ Functional users section (listing with avatar, name, email, department)
- ☐ Search, filtering, and sorting that actually work
- ☐ Loading, error, empty, and retry states on all data fetches
- ☐ Responsive desktop, tablet, and mobile UI (tested at 320, 375, 390, 768, 1024, 1280, 1440)
- ☐ Accessibility fundamentals (semantic HTML, focus-visible, color contrast, prefers-reduced-motion)
- ☐ TypeScript and code quality checks (tsc --noEmit passes, eslint passes)
- ☐ Successful production build (vite build completes)
- ☐ Complete project README (this file)
- ☐ Deployment-ready configuration (Vercel-ready)
- ☐ Screenshots captured (recommended)

---

**Built as Task 6 (Advanced) of the AUSPIFY Front End Development Internship.**

**Data source**: All metrics are derived from the public DummyJSON API. This project does not fabricate historical activity, transactions, or revenue. Cart values are demo data, not real business revenue.

**Contact**: See the internship repository for author information.