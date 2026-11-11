# AUSPIFY Frontend Development Internship

> A collection of frontend projects completed during the **Auspify Technologies Frontend Development Internship**.

This repository contains the practical tasks and project submissions completed throughout the internship. Each task is maintained in a separate directory with its own source code, documentation, and local development instructions.

---

## Table of Contents

- [About the Internship](#about-the-internship)
- [Progress Overview](#progress-overview)
- [Projects](#projects)
  - [Task 1 — Responsive Landing Page](#task-1--responsive-landing-page)
  - [Task 4 — Weather Dashboard](#task-4--weather-dashboard)
  - [Task 5 — E-Commerce Product Interface](#task-5--e-commerce-product-interface)
  - [Task 6 — React Analytics Dashboard](#task-6--react-analytics-dashboard)
- [Technology Stack](#technology-stack)
- [Repository Structure](#repository-structure)
- [Running the Projects](#running-the-projects)
- [Submission Report](#submission-report)
- [License](#license)

---

## About the Internship

| Details               | Information                        |
| --------------------- | ---------------------------------- |
| **Organization**      | Auspify Technologies               |
| **Role**              | Frontend Development Intern        |
| **Internship Period** | 23 October 2026 – 23 November 2026 |
| **Repository Status** | In progress / continuously updated |
| **Completed Tasks**   | 4 of 4 required tasks              |

> The internship is currently in progress. This repository documents completed work as it is finished and should not be considered a final internship submission until the internship period ends.

---

## Progress Overview

| Task   | Project                                               |    Status    | Documentation                                  |
| ------ | ----------------------------------------------------- | :----------: | ---------------------------------------------- |
| Task 1 | [Responsive Landing Page](./Task-1-Landing-Page)      | ✅ Completed | [README](./Task-1-Landing-Page/README.md)      |
| Task 4 | [Weather Dashboard](./Task-4-Weather-Dashboard)       | ✅ Completed | [README](./Task-4-Weather-Dashboard/README.md) |
| Task 5 | [E-Commerce Product Interface](./Task-5-Ecommerce)    | ✅ Completed | [README](./Task-5-Ecommerce/README.md)         |
| Task 6 | [React Analytics Dashboard](./Task-6-React-Dashboard) | ✅ Completed | [README](./Task-6-React-Dashboard/README.md)   |

### Completion Status

**4 / 4 required tasks completed**

All required internship projects have been completed and organized in this repository.

---

## Projects

### Task 1 — Responsive Landing Page

A responsive marketing landing page for **Nexora**, a fictional workspace product. The project is implemented as a static single-page website using semantic HTML, custom CSS, and vanilla JavaScript.

#### Highlights

- Responsive header with brand identity and desktop navigation
- Collapsible mobile navigation menu
- Skip-to-main-content link for keyboard and screen-reader users
- Hero section, product preview, trust indicators, features, and call-to-action sections
- Accessible mobile navigation using:
  - `aria-expanded`
  - `aria-controls`
  - Focus trapping
  - `Escape` key support
- Responsive breakpoints for mobile, tablet, and desktop layouts
- No framework, package installation, or build step required

**Project directory:** [Task-1-Landing-Page](./Task-1-Landing-Page)  
**Project documentation:** [Task-1-Landing-Page/README.md](./Task-1-Landing-Page/README.md)

#### Run locally

Open the following file directly in a browser:

```text
Task-1-Landing-Page/index.html
```

No installation or build step is required.

---

### Task 4 — Weather Dashboard

A responsive weather dashboard that retrieves and displays real-time weather information for cities around the world. The project is built with vanilla HTML, CSS, and JavaScript without a framework or build step.

#### Highlights

- Real-time weather data through [Open-Meteo](https://open-meteo.com)
- City search powered by the Open-Meteo Geocoding API
- Search submission through the `Enter` key
- Clear feedback for empty or invalid searches and cities with no results
- Current weather information, including:
  - Temperature
  - Weather condition
  - Feels-like temperature
  - Today's high and low
  - Local date and time
- Weather highlights, including:
  - Humidity
  - Wind speed and direction
  - Precipitation
  - Sunrise and sunset
- Hourly forecast with time, icon, temperature, and precipitation probability
- Seven-day forecast with day name, date, condition, and high/low temperatures
- Celsius/Fahrenheit switching across all dashboard sections without additional API requests
- Loading, retry, network-error, and API-error states
- Responsive layout for mobile, tablet, and desktop screens

**Project directory:** [Task-4-Weather-Dashboard](./Task-4-Weather-Dashboard)  
**Project documentation:** [Task-4-Weather-Dashboard/README.md](./Task-4-Weather-Dashboard/README.md)

#### Run locally

This project makes cross-origin `fetch` requests to the Open-Meteo APIs. For that reason, it should be served through a local HTTP server instead of being opened directly with the `file://` protocol.

```bash
cd Task-4-Weather-Dashboard
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000) in your browser.

An active internet connection is required to retrieve weather data.

---

### Task 5 — E-Commerce Product Interface

A complete e-commerce frontend interface built with React and modern frontend tooling. The application demonstrates product discovery, shopping-cart management, authentication-related flows, responsive layouts, and reusable UI patterns.

#### Highlights

- Multi-page navigation using `react-router-dom`
- Home, Products, Cart, Checkout, Login, Register, Profile, Wishlist, and Not Found pages
- Protected routes for authenticated areas
- Product listing from an external API through Axios
- Loading skeletons and API error handling
- Product search and filtering by:
  - Category
  - Brand
  - Price range
- Pagination and a **Clear All** filters action
- Shopping cart state management with Redux Toolkit
- Support for authenticated and guest cart flows
- Light, dark, and system theme modes
- Wishlist functionality
- Form validation with Formik and Yup
- Motion effects with Framer Motion
- Toast notifications with React Toastify
- Product carousels with Swiper

#### Run locally

```bash
cd Task-5-Ecommerce
npm install
npm run dev
```

#### Available scripts

```bash
npm run dev      # Start the development server
npm run build    # Create a production build
npm run preview  # Preview the production build locally
```

> `node_modules/` and `dist/` are generated directories and are excluded from version control.

---

### Task 6 — React Analytics Dashboard

**Auspy Insights** is a modern analytics dashboard built with React, Vite, TypeScript, and Tailwind CSS. The project demonstrates real API integration, interactive data visualization, reusable UI components, responsive design, and a polished SaaS-style interface.

#### Highlights

- React-based analytics dashboard
- TypeScript with strict mode enabled
- Real API integration using responses from the DummyJSON public APIs
- Interactive charts built with Recharts
- Reusable and composable UI components
- Responsive dashboard layout
- Professional SaaS-inspired visual design
- Icons provided by Lucide React
- Code-quality tooling with ESLint and Prettier
- Dashboard metrics derived strictly from actual API responses

#### Run locally

```bash
cd Task-6-React-Dashboard
npm install
npm run dev
```

#### Available scripts

```bash
npm run dev      # Start the development server
npm run build    # Create a production build
npm run preview  # Preview the production build locally
```

---

## Technology Stack

| Project                                   | Main Technologies                                                                                                                                     |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Task 1 — Responsive Landing Page**      | HTML5, CSS3, CSS custom properties, responsive media queries, vanilla JavaScript, SVG assets                                                          |
| **Task 4 — Weather Dashboard**            | Semantic HTML5, CSS3, Flexbox, CSS Grid, media queries, vanilla JavaScript, ES6+ modules, `async/await`, Fetch API, `AbortController`, Open-Meteo API |
| **Task 5 — E-Commerce Product Interface** | React 19, Vite, Tailwind CSS 4, Redux Toolkit, React Router, Formik, Yup, Axios, Framer Motion, React Toastify, Swiper                                |
| **Task 6 — React Analytics Dashboard**    | React 19, Vite 8, TypeScript 5.8, Tailwind CSS 4, Recharts 3, Lucide React, ESLint 10, `typescript-eslint`, Prettier 3                                |

---

## Repository Structure

```text
.
├── Task-1-Landing-Page/       # Responsive landing page using HTML, CSS, and JavaScript
├── Task-4-Weather-Dashboard/  # Weather dashboard using vanilla JavaScript and Open-Meteo
├── Task-5-Ecommerce/          # E-commerce interface using React and Vite
├── Task-6-React-Dashboard/    # Analytics dashboard using React, TypeScript, and Vite
├── Screenshots/               # Project screenshots and visual documentation
├── Submission-Report.pdf      # Internship submission report
├── README.md                  # Repository documentation
└── .gitignore                 # Git exclusion rules
```

> Directory names and capitalization reflect the actual repository structure.

---

## Running the Projects

### Static projects

Task 1 can be opened directly in a browser:

```text
Task-1-Landing-Page/index.html
```

Task 4 should be served through a local HTTP server because it performs cross-origin API requests:

```bash
cd Task-4-Weather-Dashboard
python3 -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000).

### React projects

For Task 5:

```bash
cd Task-5-Ecommerce
npm install
npm run dev
```

For Task 6:

```bash
cd Task-6-React-Dashboard
npm install
npm run dev
```

For either React project, production commands are:

```bash
npm run build
npm run preview
```

### General prerequisites

- A modern web browser
- Node.js and npm for the React projects
- Python 3 for serving the Weather Dashboard locally
- An internet connection for projects that consume external APIs

---

## Submission Report

The internship submission report is available here:

[Download Submission-Report.pdf](./Submission-Report.pdf)

The PDF is part of the internship submission and is not modified as part of routine repository maintenance.

---

## License

This repository contains internship coursework completed for **Auspify Technologies**.

Unless otherwise stated inside an individual project directory, the code is intended for educational and internship-submission purposes.
