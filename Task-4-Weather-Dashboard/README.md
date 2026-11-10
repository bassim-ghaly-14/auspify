# Auspify Weather Dashboard

A responsive, production-quality weather dashboard that fetches and displays real weather information for cities worldwide. Built as **Task 4** of the Auspify Front End Development Internship.

## Overview

The dashboard shows current conditions, weather highlights, an hourly forecast, and a 7-day forecast for any city searched by name. It loads real demonstration data for **Cairo, Egypt** on first visit and lets users search for other cities freely. All weather values come from live API responses — no mock or hardcoded data.

## Main features

- **Default location:** Cairo, Egypt weather fetched live from the API on load.
- **City search:** Geocoding-powered city name lookup with Enter-key support, clear button, validation, and no-results feedback.
- **Current weather:** Temperature, condition, feels-like, today's high/low, and local date/time.
- **Weather highlights:** Feels like, humidity, wind speed, wind direction, precipitation, sunrise, sunset.
- **Hourly forecast:** Scrollable hourly items with time, icon, temperature, and precipitation probability.
- **7-day forecast:** Day name, date, icon, description, and high/low temperatures.
- **Temperature unit toggle:** Celsius ↔ Fahrenheit across all sections without additional API requests.
- **Refresh:** Fetches fresh weather for the selected city with loading state and failure protection (previous data is preserved).
- **States:** Initial loading, search loading, invalid input, city not found, network/API failure, and retry.
- **Responsive:** Designed for mobile (320px+), tablets, laptops, and desktop screens.
- **Accessibility:** Skip link, labelled inputs, accessible buttons, ARIA live regions for messages, visible focus indicators, and reduced-motion support.
## Technologies used

- HTML5 (semantic markup)
- CSS3 (CSS custom properties, responsive media queries, flexbox/grid)
- Vanilla JavaScript (ES6+ modules, `async/await`, Fetch API, `AbortController`)
- No build step, no framework, no external dependencies

## Weather API provider

**Open-Meteo** — https://open-meteo.com

Free weather API, no API key required for this project.

## API endpoints used

| Endpoint | Purpose |
|---|---|
| `https://geocoding-api.open-meteo.com/v1/search` | Convert a city name into coordinates (Geocoding API). Parameters: `name`, `count`, `language`, `format`. |
| `https://api.open-meteo.com/v1/forecast` | Current, hourly, and daily forecast data (Forecast API). Parameters include `latitude`, `longitude`, `current`, `hourly`, `daily`, and `timezone=auto`. |

Weather conditions are mapped from the official WMO weather interpretation codes supported by Open-Meteo (clear sky, cloud, fog, drizzle, rain, freezing rain, snow, showers, thunderstorms, etc.).

## Project structure

```
task-4-Weather-Dashboard/
├── index.html            # Semantic HTML entry point
├── README.md             # This file
├── css/
│   └── style.css         # Design tokens, layout, responsive styles
├── js/
│   ├── app.js            # App state, event listeners, orchestration
│   ├── api.js            # API requests, response validation, errors
│   ├── weather.js        # WMO weather-code interpretation
│   └── ui.js             # DOM rendering and interface state
└── assets/
    └── icons/            # Reserved for icon assets (SVGs are inlined in js/ui.js)
```

## How to run locally

This is a static frontend project with no build step. Because it makes cross-origin `fetch` requests to the Open-Meteo APIs, it must be served over HTTP (opening `index.html` as `file://` may be blocked by browser CORS policy).

1. Open a terminal in the project folder:
   ```bash
   cd /Users/apple9/DOC/auspify/task-4-Weather-Dashboard
   ```
2. Start a local development server. For example, using Python:
   ```bash
   python3 -m http.server 8000
   ```
   or Node.js (`http-server` if installed):
   ```bash
   npx http-server -p 8000
   ```
3. Open `http://localhost:8000` in a browser.

An internet connection is required to reach the Open-Meteo APIs.

## How city search and weather fetching work

1. The user types a city name and submits the search (button click or Enter).
2. `js/api.js` calls the Open-Meteo Geocoding API (`/v1/search`) to turn the name into coordinates.
3. If no result matches, a "no results" message is shown. If multiple results match, the most relevant (first) result is used.
4. With valid coordinates, `js/api.js` calls the Forecast API (`/v1/forecast`) requesting current, hourly, and daily fields, with `timezone=auto` so times match the selected location.
5. `js/weather.js` translates numeric WMO weather codes into readable labels and icon keys.
6. `js/ui.js` renders the dashboard, and `js/app.js` coordinates state and user actions.
7. Any in-flight request is aborted (`AbortController`) when a newer search begins, so outdated responses can never overwrite newer ones.

## Loading and error handling

- **Initial loading:** A full-page overlay with spinner is shown while Cairo's weather loads.
- **Search loading:** The search button shows a "Searching…" state while the request is in flight.
- **Invalid input:** Empty searches are rejected with a clear message before any request is made.
- **City not found:** A "No results found" message is shown when geocoding returns nothing.
- **Network/API failure:** Non-success responses, offline conditions, and malformed payloads are handled with user-friendly messages (no stack traces).
- **Refresh failure:** Previously loaded valid data remains on screen and a banner reports the failure.
- **Retry:** Error states include a retry action (initial load) or a dismissible banner (refresh/search failures).

## Known limitations

- Requires an internet connection to reach the Open-Meteo APIs.
- Must be served over HTTP (CORS blocks `file://` access in most browsers).
- Wind speed and precipitation units are fixed to the API's metric units (km/h, mm); only temperature toggles between °C and °F.
- Open-Meteo does not require an API key and has usage limits; heavy repeated use may be throttled by the provider.