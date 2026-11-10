/**
 * ui.js — DOM rendering and interface state updates.
 * All presentation logic lives here. Weather icons are inline SVGs (no emoji).
 */

import {
  UNIT_CELSIUS,
  UNIT_FAHRENHEIT,
  formatTemperature,
  formatTemperatureWithUnit,
  compassDirection,
  formatClockTime,
  formatDayName,
  formatDateLabel,
  formatLocalDateTime,
  escapeHtml,
} from './utils.js';
import { interpretWeatherCode } from './weather.js';

const ICON_STROKE = 'currentColor';
const ICON_SIZE = 'width="32" height="32"';

const ICONS = {
  'clear-day': `<svg ${ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="${ICON_STROKE}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5.64 5.64l1.41 1.41M18.36 18.36l1.41 1.41M5.64 18.36l1.41-1.41M18.36 5.64l1.41-1.41"/></svg>`,
  'clear-night': `<svg ${ICON_SIZE} viewBox="0 0 24 24" fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M19.5 15.5A8.5 8.5 0 0 1 8.5 4.5a8.5 8.5 0 1 0 11 11Z"/></svg>`,  'mainly-clear-day': `<svg ${ICON_SIZE} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="#0091cf" d="M58 36.1c0 7.49-2.94 14.29-7.73 19.32-5.1 5.35-13.58.01-21.55.01-8.1 0-14.11 5.24-19.23-.26C4.84 50.17 2 43.47 2 36.1 2 20.64 14.54 8.11 30 8.11s28 12.54 28 28Z"/><path fill="#ff8a47" d="m42 4-6 6h-8v8l-6 6 6 6v8h8l6 6 6-6h8v-8l6-6-6-6v-8h-8z"/><circle fill="#ffcc42" cx="42" cy="24" r="12"/><circle fill="#fff" cx="15" cy="51" r="9"/><circle fill="#fff" cx="30" cy="42" r="12"/><circle fill="#fff" cx="45" cy="51" r="9"/><rect fill="#fff" width="30" height="12" x="15" y="48"/></svg>`,
  'mainly-clear-night': `<svg ${ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="${ICON_STROKE}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="7" cy="17" r="2"/><circle cx="8.5" cy="8.5" r="3.5"/><circle cx="17" cy="8" r="1.8"/><circle cx="19" cy="10" r="1.8"/><circle cx="15" cy="10" r="1.8"/></svg>`,
  'partly-cloudy-day': `<svg ${ICON_SIZE} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="#FFFFFF" stroke="#FFFFFF" stroke-width="0.5" stroke-linejoin="round" d="M8.999 7C7.618 7 6.499 8.119 6.499 9.5V10H5.5C4.672 10 4 10.671 4 11.5S4.672 13 5.5 13h7c.828 0 1.5-.672 1.5-1.5S13.328 10 12.5 10h-1V9.5C11.5 8.119 10.38 7 8.999 7ZM5.535 9C5.777 7.304 7.236 6 8.999 6s3.222 1.304 3.465 3H12.5c1.381 0 2.5 1.119 2.5 2.5S13.881 14 12.5 14h-7C4.119 14 3 12.881 3 11.5S4.119 9 5.5 9h.035Z"/><path fill="#FFFFFF" d="M8.787 2.819a.5.5 0 0 0-.883-.469l-.426.803a.5.5 0 1 0 .883.469l.426-.803ZM5.015 2.073a.5.5 0 0 0-.957.293l.266.87a.5.5 0 0 0 .957-.294l-.266-.869ZM6 4c.916 0 1.735.41 2.285 1.056a4.5 4.5 0 0 0-1.107.328A2 2 0 0 0 4 7c0 .442.143.85.385 1.181a4.5 4.5 0 0 0-.9.456A3 3 0 0 1 6 4ZM1.819 4.214a.5.5 0 0 0-.469.883l.803.426a.5.5 0 1 0 .469-.883l-.803-.426ZM2.236 8.677a.5.5 0 0 0-.293-.957l-.87.267a.5.5 0 0 0 .294.956l.869-.266Z"/></svg>`,
  'partly-cloudy-night': `<svg ${ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="${ICON_STROKE}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="7" cy="17" r="2"/><circle cx="8.5" cy="8.5" r="3.5"/><circle cx="17" cy="11" r="3"/><circle cx="13" cy="9" r="3"/><circle cx="20" cy="12" r="3"/></svg>`,
  drizzle: `<svg ${ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="${ICON_STROKE}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="11" r="3"/><circle cx="13" cy="9" r="3"/><circle cx="17" cy="12" r="3"/><line x1="7" y1="14" x2="7.6" y2="15.6"/><line x1="11" y1="16" x2="11.6" y2="17.6"/><line x1="15" y1="14" x2="15.6" y2="15.6"/></svg>`,
  rain: `<svg ${ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="${ICON_STROKE}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="11" r="3"/><circle cx="13" cy="9" r="3"/><circle cx="17" cy="12" r="3"/><line x1="7" y1="14" x2="7" y2="18"/><line x1="11" y1="17" x2="11" y2="21"/><line x1="15" y1="14" x2="15" y2="18"/></svg>`,
  'freezing-rain': `<svg ${ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="${ICON_STROKE}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="11" r="3"/><circle cx="13" cy="9" r="3"/><circle cx="17" cy="12" r="3"/><line x1="7" y1="14" x2="7" y2="18"/><line x1="11" y1="17" x2="11" y2="21"/><line x1="15" y1="14" x2="15" y2="18"/><path d="M12 8l1 4M10 10h4M11 9l2 2M13 9l-2 2"/></svg>`,
  snow: `<svg ${ICON_SIZE} viewBox="0 0 24 24" fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M11 2.75a1 1 0 0 1 2 0v3.12l2.05-2.05a1 1 0 0 1 1.414 1.414L13 8.7v2.6l2.25-1.3 1.27-3.48a1 1 0 1 1 1.88.684l-.83 2.28 2.7-1.56a1 1 0 1 1 1 1.732l-2.7 1.56 2.28.83a1 1 0 1 1-.684 1.88l-3.48-1.27-2.25 1.3 2.25 1.3 3.48-1.27a1 1 0 1 1 .684 1.88l-2.28.83 2.7 1.56a1 1 0 1 1-1 1.732l-2.7-1.56.83 2.28a1 1 0 1 1-1.88.684l-1.27-3.48-2.25-1.3v3.1l2.05 2.05a1 1 0 0 1-1.414 1.414L13 20.13v3.12a1 1 0 0 1-2 0v-3.12l-2.05 2.05a1 1 0 0 1-1.414-1.414L10 18.72v-2.6l-2.25 1.3-1.27 3.48a1 1 0 1 1-1.88-.684l.83-2.28-2.7 1.56a1 1 0 1 1-1-1.732l2.7-1.56-2.28-.83a1 1 0 1 1 .684-1.88l3.48 1.27 2.25-1.3-2.25-1.3-3.48 1.27a1 1 0 1 1-.684-1.88l2.28-.83-2.7-1.56a1 1 0 1 1 1-1.732l2.7 1.56-.83-2.28a1 1 0 1 1 1.88-.684l1.27 3.48 2.25 1.3V8.7L7.536 5.234A1 1 0 0 1 8.95 3.82L11 5.87V2.75Z"/></svg>`,
  'snow-showers': `<svg ${ICON_SIZE} viewBox="0 0 24 24" fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M7.5 13.5h9a3.5 3.5 0 0 0 .44-6.97A5.5 5.5 0 0 0 6.2 7.5a3.5 3.5 0 0 0 1.3 6Z"/><path d="M7 16.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm5 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm5-1a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm-7 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm5 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"/></svg>`,  'showers-day': `<svg ${ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="${ICON_STROKE}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="7" cy="17" r="2"/><path d="M7 15v2M7 19v2M5 17h2M9 17h2M5.64 15.64l1.41 1.41M8.36 18.36l1.41 1.41"/><circle cx="17" cy="11" r="3"/><circle cx="13" cy="9" r="3"/><circle cx="20" cy="12" r="3"/><line x1="13" y1="15" x2="13" y2="19"/><line x1="17" y1="15" x2="17" y2="19"/></svg>`,
  'showers-night': `<svg ${ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="${ICON_STROKE}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="7" cy="17" r="2"/><circle cx="8.5" cy="8.5" r="3.5"/><circle cx="17" cy="11" r="3"/><circle cx="13" cy="9" r="3"/><circle cx="20" cy="12" r="3"/><line x1="13" y1="15" x2="13" y2="19"/><line x1="17" y1="15" x2="17" y2="19"/></svg>`,
  thunderstorm: `<svg ${ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="${ICON_STROKE}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 15h10a4 4 0 0 0 .5-7.97A6 6 0 0 0 6.2 6.5 4.5 4.5 0 0 0 7 15Z"/><path d="m13 15-3 5h3l-1 3 5-6h-3l1-2"/></svg>`,
  overcast: `<svg ${ICON_SIZE} viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M16 7.5a2.5 2.5 0 0 1-1.456 2.272 3.5 3.5 0 0 0-.65-.824 1.5 1.5 0 0 0-.789-2.896.5.5 0 0 1-.627-.421 3 3 0 0 0-5.22-1.625 5.6 5.6 0 0 0-1.276.088 4.002 4.002 0 0 1 7.392.91A2.5 2.5 0 0 1 16 7.5"/><path d="M7 5a4.5 4.5 0 0 1 4.473 4h.027a2.5 2.5 0 0 1 0 5H3a3 3 0 0 1-.247-5.99A4.5 4.5 0 0 1 7 5m3.5 4.5a3.5 3.5 0 0 0-6.89-.873.5.5 0 0 1-.51.375A2 2 0 1 0 3 13h8.5a1.5 1.5 0 1 0-.376-2.953.5.5 0 0 1-.624-.492z"/></svg>`,
  fog: `<svg ${ICON_SIZE} viewBox="0 0 16 16" fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M8.5 3a5 5 0 0 1 4.905 4.027A3 3 0 0 1 13 13h-1.5a.5.5 0 0 0 0-1H1.05a3.5 3.5 0 0 1-.713-1H9.5a.5.5 0 0 0 0-1H.035a3.5 3.5 0 0 1 0-1H7.5a.5.5 0 0 0 0-1H.337a3.5 3.5 0 0 1 3.57-1.977A5 5 0 0 1 8.5 3"/></svg>`,  unknown: `<svg ${ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="${ICON_STROKE}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
};

function weatherIconHtml(iconKey) {
  return ICONS[iconKey] || ICONS.unknown;
}

// ---------------------------------------------------------------- DOM refs
const refs = {};

export function init() {
  const ids = [
    'city-input', 'search-form', 'search-button',
    'search-hint', 'search-message', 'loader-overlay', 'loader-text',
    'current-card', 'current-error', 'current-error-message', 'current-retry',
    'place', 'local-time', 'weather-icon', 'condition-text',
    'temp-value', 'temp-unit', 'temp-high', 'temp-low',
    'highlights-grid', 'hourly-list', 'hourly-wrap', 'hourly-empty',
    'daily-grid', 'daily-empty',
  ];
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) refs[id] = el;
  });
}

function get(id) {
  return refs[id];
}

// ---------------------------------------------------------------- Overlay loader
export function showLoader(show, message = 'Loading weather data&hellip;') {
  const overlay = get('loader-overlay');
  const text = get('loader-text');
  if (!overlay) return;
  if (show) {
    if (text) text.textContent = message;
    overlay.hidden = false;
  } else {
    overlay.hidden = true;
  }
}

// ---------------------------------------------------------------- Search UI
export function setSearchInputInvalid(invalid) {
  const input = get('city-input');
  if (!input) return;
  input.ariaInvalid = invalid ? 'true' : 'false';
  input.classList.toggle('input--invalid', invalid);
}

export function setSearchMessage(text, type = 'error') {
  const message = get('search-message');
  const hint = get('search-hint');
  if (!message) return;
  message.className = `search-message search-message--${type}`;
  message.textContent = text;
  message.hidden = !text;
  if (hint) hint.hidden = !!text;
}

export function setSearchButtonLoading(loading) {
  const button = get('search-button');
  if (!button) return;
  button.disabled = loading;
  const label = button.querySelector('.search-button-label');
  if (label) label.textContent = loading ? 'Searching&hellip;' : 'Search';
}

export function getSearchInputElement() {
  return get('city-input');
}
// ---------------------------------------------------------------- Alert banner
let bannerTimer = null;

export function showBanner(text, { type = 'error', duration = 9000 } = {}) {
  hideBanner();
  const banner = document.createElement('div');
  banner.className = `banner banner--${type}`;
  banner.setAttribute('role', 'alert');
  banner.setAttribute('aria-live', 'assertive');
  banner.innerHTML = `<span class="banner-text">${escapeHtml(text)}</span>
    <button type="button" class="banner-dismiss" aria-label="Dismiss">×</button>`;
  const dismiss = banner.querySelector('.banner-dismiss');
  dismiss.addEventListener('click', () => hideBanner());
  const main = document.getElementById('main-content');
  if (main) main.insertAdjacentElement('afterbegin', banner);
  if (duration > 0) {
    bannerTimer = setTimeout(hideBanner, duration);
  }
}

export function hideBanner() {
  if (bannerTimer) {
    clearTimeout(bannerTimer);
    bannerTimer = null;
  }
  const existing = document.querySelector('.banner');
  if (existing) existing.remove();
}

// ---------------------------------------------------------------- Current weather error view
export function showErrorView(message, onRetry) {
  const errorView = get('current-error');
  const errorMessage = get('current-error-message');
  const retry = get('current-retry');
  const card = get('current-card');
  if (card) card.hidden = true;
  if (errorView) errorView.hidden = false;
  if (errorMessage) errorMessage.textContent = escapeHtml(message);
  if (retry && onRetry) {
    retry.onclick = onRetry;
  }
}

export function hideErrorView() {
  const errorView = get('current-error');
  const card = get('current-card');
  if (errorView) errorView.hidden = true;
  if (card) card.hidden = false;
}

// ---------------------------------------------------------------- Location header
export function renderLocation(city, isoDateTime, timeZone, utcOffsetSeconds) {
  const place = get('place');
  const timeEl = get('local-time');
  if (place) {
    const country = city.country ? `, ${escapeHtml(city.country)}` : '';
    place.textContent = `${escapeHtml(city.name)}${country}`;
  }
  if (timeEl) {
    timeEl.textContent = isoDateTime
      ? formatLocalDateTime(isoDateTime, timeZone, utcOffsetSeconds)
      : '--';
  }
}

// Live local clock for the header.
let clockTimer = null;

export function startLiveClock(timeZone) {
  stopLiveClock();
  const timeEl = get('local-time');
  if (!timeEl || !timeZone) return;
  const tick = () => {
    try {
      timeEl.textContent = new Intl.DateTimeFormat('en-US', {
        timeZone,
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date());
    } catch (error) {
      // Intl timeZone fallback: keep the last value.
    }
  };
  tick();
  clockTimer = setInterval(tick, 60000);
}

export function stopLiveClock() {
  if (clockTimer) {
    clearInterval(clockTimer);
    clockTimer = null;
  }
}

// ---------------------------------------------------------------- Unit toggle visual
export function updateUnitToggle(unit) {
  const button = document.querySelector('.unit-toggle');
  if (!button) return;
  const isFahrenheit = unit === UNIT_FAHRENHEIT;
  button.setAttribute('aria-pressed', String(isFahrenheit));
  button.dataset.unit = unit;
  button.querySelector('.unit-value').textContent = isFahrenheit ? '°F' : '°C';
  button.querySelector('.visually-hidden').textContent = isFahrenheit
    ? 'Switch to Celsius'
    : 'Switch to Fahrenheit';
}
// ---------------------------------------------------------------- Renderers

function highlightCard(id, label, value, extra) {
  return `
    <div class="highlight-card" id="${id}">
      <p class="highlight-label">${escapeHtml(label)}</p>
      <p class="highlight-value">${escapeHtml(value)}${extra ? `<span class="highlight-extra">${escapeHtml(extra)}</span>` : ''}</p>
    </div>
  `;
}

export function renderCurrent(current, daily, unit) {
  const tempValue = get('temp-value');
  const tempUnit = get('temp-unit');
  const conditionText = get('condition-text');
  const weatherIcon = get('weather-icon');
  const tempHigh = get('temp-high');
  const tempLow = get('temp-low');

  const code = current == null ? null : current.weatherCode;
  const isDay = current == null ? null : current.isDay;
  const condition = code == null ? { label: '--', icon: 'unknown' } : interpretWeatherCode(code, isDay);

  if (tempValue) tempValue.textContent = current == null ? '--' : String(formatTemperature(current.temperature, unit));
  if (tempUnit) tempUnit.textContent = unit === UNIT_FAHRENHEIT ? '°F' : '°C';
  if (conditionText) conditionText.textContent = condition.label;
  if (weatherIcon) weatherIcon.innerHTML = weatherIconHtml(condition.icon);
  if (weatherIcon) weatherIcon.setAttribute('aria-label', `Weather: ${condition.label}`);

  const today = daily && daily[0];
  if (tempHigh) tempHigh.textContent = today && today.max != null ? String(formatTemperature(today.max, unit)) : '–';
  if (tempLow) tempLow.textContent = today && today.min != null ? String(formatTemperature(today.min, unit)) : '–';
}

export function renderHighlights(current, unit) {
  const grid = get('highlights-grid');
  if (!grid || !current) return;

  const feelsLike = current.apparentTemperature != null ? formatTemperatureWithUnit(current.apparentTemperature, unit) : '–';
  const humidity = current.relativeHumidity != null ? `${current.relativeHumidity}%` : '–';
  const windSpeed = current.windSpeed != null ? `${current.windSpeed} km/h` : '–';
  const direction = current.windDirection != null ? compassDirection(current.windDirection) : null;
  const windDirection = direction ? `${direction} (${current.windDirection}°)` : '–';
  const precipitation = current.precipitation != null ? `${current.precipitation} mm` : '–';

  grid.innerHTML = `
    ${highlightCard('hl-feels-like', 'Feels like', feelsLike)}
    ${highlightCard('hl-humidity', 'Humidity', humidity)}
    ${highlightCard('hl-wind-speed', 'Wind speed', windSpeed)}
    ${highlightCard('hl-wind-direction', 'Wind direction', windDirection)}
    ${highlightCard('hl-precipitation', 'Precipitation', precipitation)}
    ${highlightCard('hl-sunrise', 'Sunrise', current.sunrise != null ? formatClockTime(current.sunrise) : '–')}
    ${highlightCard('hl-sunset', 'Sunset', current.sunset != null ? formatClockTime(current.sunset) : '–')}
  `;
}

// Sunrise/sunset arrive with the daily forecast; patch them into the highlights.
export function setSunTimes(sunrise, sunset) {
  const sunriseEl = document.getElementById('hl-sunrise');
  const sunsetEl = document.getElementById('hl-sunset');
  const valueOf = (el) => (el ? el.querySelector('.highlight-value') : null);
  if (sunriseEl && valueOf(sunriseEl)) valueOf(sunriseEl).textContent = sunrise ? formatClockTime(sunrise) : '–';
  if (sunsetEl && valueOf(sunsetEl)) valueOf(sunsetEl).textContent = sunset ? formatClockTime(sunset) : '–';
}
export function renderHourly(hourly, unit) {
  const list = get('hourly-list');
  const empty = get('hourly-empty');
  const wrap = get('hourly-wrap');
  if (!list) return;

  const items = (hourly || []).slice(0, 24);
  if (!items.length) {
    list.innerHTML = '';
    if (wrap) wrap.hidden = true;
    if (empty) empty.hidden = false;
    return;
  }
  if (wrap) wrap.hidden = false;
  if (empty) empty.hidden = true;

  list.innerHTML = items.map((hour) => {
    const condition = hour.weatherCode == null ? { label: 'Unknown', icon: 'unknown' } : interpretWeatherCode(hour.weatherCode, null);
    const precip = hour.precipitationProbability != null ? `<span class="hourly-precip">${hour.precipitationProbability}%</span>` : '';
    return `
      <div class="hourly-item">
        <p class="hourly-time">${escapeHtml(formatClockTime(hour.time))}</p>
        <span class="hourly-icon" aria-label="Weather: ${escapeHtml(condition.label)}">${weatherIconHtml(condition.icon)}</span>
        <p class="hourly-temp">${hour.temperature != null ? String(formatTemperature(hour.temperature, unit)) : '–'}</p>
        ${precip}
      </div>
    `;
  }).join('');
}

export function renderDaily(daily, unit) {
  const grid = get('daily-grid');
  const empty = get('daily-empty');
  if (!grid) return;

  const items = (daily || []).slice(0, 7);
  if (!items.length) {
    grid.innerHTML = '';
    if (empty) empty.hidden = false;
    return;
  }
  if (empty) empty.hidden = true;

  grid.innerHTML = items.map((day) => {
    const condition = day.weatherCode == null ? { label: '–', icon: 'unknown' } : interpretWeatherCode(day.weatherCode, null);
    return `
      <article class="daily-item">
        <p class="daily-day">${escapeHtml(formatDayName(day.date))}</p>
        <p class="daily-date">${escapeHtml(formatDateLabel(day.date))}</p>
        <span class="daily-icon" aria-label="Weather: ${escapeHtml(condition.label)}">${weatherIconHtml(condition.icon)}</span>
        <p class="daily-condition">${escapeHtml(condition.label)}</p>
        <p class="daily-temps">
          <span class="daily-high">${day.max != null ? String(formatTemperature(day.max, unit)) : '–'}</span>
          <span class="daily-low">${day.min != null ? String(formatTemperature(day.min, unit)) : '–'}</span>
        </p>
      </article>
    `;
  }).join('');
}

export function renderWeather(data, unit) {
  if (!data) return;
  renderCurrent(data.current, data.daily, unit);
  renderHighlights({ ...data.current, sunrise: data.daily[0]?.sunrise, sunset: data.daily[0]?.sunset }, unit);
  setSunTimes(data.daily[0]?.sunrise, data.daily[0]?.sunset);
  renderHourly(data.hourly, unit);
  renderDaily(data.daily, unit);
}

// ---------------------------------------------------------------- Empty state

export function showEmptyState() {
  const hint = get('search-hint');
  if (hint) hint.hidden = false;
}

export function hideEmptyState() {
  const hint = get('search-hint');
  if (hint) hint.hidden = true;
}