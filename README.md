# AUSPIFY Frontend Development Internship

Front End Development Internship repository — Auspify Technologies. This repository contains the frontend projects and task submissions completed during the internship, with each task organized in its own directory.

## Organization
**Auspify Technologies**

## Role
Front End Development Intern

## Internship period
23 October 2026 – 23 November 2026

> The internship is in progress. This repository documents the completed work as it is finished; it is not a final internship submission.

## Internship Overview

The repository organizes the practical frontend tasks completed as part of the AUSPIFY Front End Development Internship. Each completed task has its own directory containing source code, documentation, and run instructions. Tasks still in progress are marked as pending.

## Task Progress

| Task | Project | Status |
|------|---------|--------|
| Task 1 | [Task-1-Landing-Page](./Task-1-Landing-Page) | Completed |
| Task 4 | [Task-4-Weather-Dashboard](./Task-4-Weather-Dashboard) | Completed |
| Task 5 | [Task-5-Ecommerce](./Task-5-Ecommerce) | Completed |
| Task 6 | [Task-6-React-Dashboard](./Task-6-React-Dashboard) | Completed |

### 4 / 4 Required Tasks Completed

All four internship projects have been successfully completed and integrated into this repository.

## Task 4 — Weather Dashboard

A responsive weather dashboard that fetches and displays real weather information for cities worldwide. Built with vanilla HTML, CSS, and JavaScript — no build step, framework, or external dependencies.

**Features**

- Real-time weather data through [Open-Meteo](https://open-meteo.com) (free API, no API key required)
- City search using geocoding (Open-Meteo Geocoding API) with Enter-key support and no-results feedback
- Current weather conditions: temperature, condition, feels-like, today's high/low, and local date/time
- Weather highlights: feels-like, humidity, wind speed/direction, precipitation, sunrise, sunset
- Hourly forecast with time, icon, temperature, and precipitation probability
- 7-day forecast with day name, date, icon, description, and high/low temperatures
- Celsius/Fahrenheit switching across all sections without additional API requests
- Loading, invalid-input, city-not-found, network/API failure, and retry states
- Responsive interface for mobile, tablet, and desktop screens

**Project:** [Task-4-Weather-Dashboard/](./Task-4-Weather-Dashboard)  
**Task documentation:** [Task-4-Weather-Dashboard/README.md](./Task-4-Weather-Dashboard/README.md)

**How to run locally**

This is a static frontend project with no build step. Because it makes cross-origin `fetch` requests to the Open-Meteo APIs, it must be served over HTTP (opening `index.html` as `file://` may be blocked by browser CORS policy):

```bash
cd Task-4-Weather-Dashboard
python3 -m http.server 8000
# then open http://localhost:8000 in a browser
```

An internet connection is required to reach the Open-Meteo APIs.

## Existing Projects

### Task 1 — Responsive Landing Page

Responsive marketing landing page for **Nexora**, a fictional workspace product. Built as a static, single-page site with HTML5, CSS3, and vanilla JavaScript.

- Responsive header with brand link and desktop navigation
- Collapsible mobile navigation menu with open/close buttons
- Skip-to-main-content link for keyboard and screen-reader users
- Hero, product preview, trust indicators, features, and call-to-action sections
- Accessible mobile menu (`aria-expanded`, `aria-controls`, focus trapping, Escape to close)
- Responsive breakpoints at 640px, 768px, and 1024px

**Project:** [Task-1-Landing-Page/](./Task-1-Landing-Page)  
**Task documentation:** [Task-1-Landing-Page/README.md](./Task-1-Landing-Page/README.md)

**Run locally:** Open `Task-1-Landing-Page/index.html` directly in a browser. No installation or build step is required.

### Task 5 — E-Commerce Product Interface

**Framework and tooling:** React 19, Vite, Tailwind CSS 4, Redux Toolkit, React Router, Formik/Yup, Axios, Framer Motion, React Toastify, Swiper.

- Routing with `react-router-dom`: Home, Products, Cart, Checkout, Login, Register, Profile, Wishlist, NotFound, plus a `ProtectedRoute`
- Product listing from an external API via `src/services/api.js` (axios), with loading skeletons and error handling
- Search and filtering: category, brand, and price-range filters, pagination, and a "clear all" action
- Shopping cart: Redux Toolkit slices for authenticated and guest carts
- Theme context (light/dark/system), wishlist slice, Formik/Yup forms, animations, notifications, and carousels
**Run locally:**
```bash
cd Task-5-Ecommerce
npm install
npm run dev      # dev server
npm run build    # production build
npm run preview  # preview production build
```
`node_modules/` and `dist/` are gitignored and not published.

## Task 6 — React Dashboard

Auspy Insights — React Analytics Dashboard: A modern, production-quality analytics dashboard built with React, Vite, TypeScript, and Tailwind CSS. Demonstrates real API integration, interactive charts with Recharts, reusable UI components, responsive design, and professional SaaS aesthetics. All metrics are derived from the DummyJSON public APIs strictly from actual responses.

## Technology Stack

| Category | Technologies |
|----------|-------------|
| **Task 1 — Responsive Landing Page** | HTML5, CSS3 (custom properties, responsive media queries), Vanilla JavaScript, SVG assets. No build step or framework. |
| **Task 4 — Weather Dashboard** | HTML5 (semantic markup), CSS3 (custom properties, flexbox/grid, media queries), Vanilla JavaScript (ES6+ modules, `async/await`, Fetch API, `AbortController`). No build step, no framework, no external dependencies. Weather data from Open-Meteo. |
| **Task 5 — E-Commerce Product Interface** | React 19, Vite, Tailwind CSS 4, Redux Toolkit, React Router, Formik/Yup, Axios, Framer Motion, React Toastify, Swiper. |
| **Task 6 — React Dashboard** | React 19, Vite 8, Tailwind CSS 4, Recharts 3, Lucide React, TypeScript 5.8 (strict mode), ESLint 10 + typescript-eslint, Prettier 3. |

## Repository Structure

```
auspify/
├── Task-1-Landing-Page/      # Completed: responsive landing page (HTML/CSS/JS)
├── Task-4-Weather-Dashboard/ # Completed: weather dashboard (HTML/CSS/JS)
├── Task-5-Ecommerce/         # Completed: e-commerce product interface (React + Vite)
├── Task-6-React-Dashboard/   # Completed: React analytics dashboard (React + Vite + TypeScript)
├── Screenshots/              # Screenshots directory
├── Submission-Report.pdf     # Internship submission report
├── README.md
└── .gitignore
```

Folder names and capitalization reflect the actual directories on disk.

## Running Projects

- **Task 1:** Open `Task-1-Landing-Page/index.html` directly in a browser. No installation required.
- **Task 4:** Serve `Task-4-Weather-Dashboard/` over a local HTTP server (for example, `python3 -m http.server 8000`) and open `http://localhost:8000`. Required because of cross-origin API fetch requests; `file://` execution is not relied upon.
- **Task 5:** `cd Task-5-Ecommerce && npm install && npm run dev`.
- **Task 6:** `cd Task-6-React-Dashboard && npm install && npm run dev`. Production build with `npm run build`. Preview with `npm run preview`.

## Submission Notes

The internship submission report is available here: [Submission-Report.pdf](./Submission-Report.pdf). The PDF is part of the internship submission and is not modified by repository maintenance commits.

## License
This repository contains internship coursework for Auspify Technologies.
