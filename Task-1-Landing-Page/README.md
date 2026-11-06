# Task 1 — Responsive Landing Page

Auspify Technologies Front End Development Internship — Task 1.

## Project overview
A responsive marketing landing page for **Nexora**, a fictional focused
workspace product ("Clarity for the way you work"). Built as a static,
single-page site for the Auspify Internship Task 1 assignment. All brand
names, statistics, and references are illustrative.

## Technologies
- HTML5 — semantic sections (header, nav, main, section, footer),
  skip-to-main-content link
- CSS3 — CSS custom properties (design tokens), responsive media queries,
  `clamp()` typography, focus-visible and reduced-motion styles
- Vanilla JavaScript — accessible mobile menu with no dependencies
- SVG — brand asset (`assets/avatar.svg`)

No build step, package manager, or framework is required.

## Features
- Responsive header with brand link and desktop navigation
- Collapsible mobile navigation menu with open/close buttons
- Skip to main content link for keyboard and screen-reader users
- Hero section with headline, description, and primary/secondary actions
- Product preview window (workspace UI mock built with HTML/CSS)
- Trust indicators section
- Features section: Focus Mode, Project Boards, Team Workspaces, Smart Priorities
- Product showcase with project sidebar, metrics, and upcoming tasks
- Call-to-action section and footer
- Responsive breakpoints at 640px, 768px, and 1024px

## Accessibility
- Skip-to-content link (`.skip-link`) shown on focus
- Mobile menu uses `aria-expanded`, `aria-controls`, and `aria-label`
- Focus trapping inside the open mobile menu; focus returns to the toggle
  on close; Escape closes the menu and restores focus
- `:focus-visible` outlines on buttons and navigation links
- `prefers-reduced-motion: reduce` respected for transitions
- `.visually-hidden` utility for screen-reader-only content

## Directory structure
```
Task-1-Landing-Page/
├── index.html          # HTML5 markup
├── assets/
│   └── avatar.svg      # Brand avatar asset
├── scripts/
│   └── main.js         # Vanilla JS mobile menu behaviour
└── styles/
    └── main.css        # CSS3 styles and layout
```

## How to run locally
Open `index.html` directly in a web browser. No installation or build step
is required:

```bash
open Task-1-Landing-Page/index.html
```

## Genuine limitations
- Static single-page site with no backend or interactivity beyond the
  mobile menu.
- Brand, product name, statistics, and contact details are fictional
  (created for the internship assignment).
- Preview imagery is drawn with HTML/CSS and SVG rather than image files.
- Only mobile and desktop breakpoints are covered; no tablet-specific
  layouts beyond the shared 768px breakpoint.