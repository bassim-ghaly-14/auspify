/**
 * app.js — Application initialization, state, and orchestration.
 *
 * Wires together api.js (network), weather.js (interpretation), and ui.js
 * (presentation). Temperatures are kept in Celsius internally and converted
 * for display only, so unit switches never trigger a new API request.
 */

import { UNIT_CELSIUS, UNIT_FAHRENHEIT } from './utils.js';
import * as Api from './api.js';
import * as Ui from './ui.js';

const DEFAULT_CITY = {
  name: 'Cairo',
  country: 'Egypt',
  latitude: 30.06263,
  longitude: 31.24967,
  timezone: 'Africa/Cairo',
};

const state = {
  city: DEFAULT_CITY,
  unit: UNIT_CELSIUS,
  data: null,
  controller: null,
  refreshing: false,
};

/**
 * Abort any in-flight request so a newer search can never be overwritten by an
 * older one.
 */
function abortPending() {
  if (state.controller) {
    try {
      state.controller.abort();
    } catch (error) {
      // AbortError on an already-settled controller is safe to ignore.
    }
    state.controller = null;
  }
}

/**
 * Create a fresh AbortController signal and store the controller so the next
 * request can cancel this one.
 */
function nextSignal() {
  abortPending();
  const controller = new AbortController();
  state.controller = controller;
  return controller.signal;
}

/**
 * Resolve a city and load its weather. Used both for the default city and for
 * user searches. Aborts any previous request first.
 *
 * The displayed city and previously loaded data are only replaced after the
 * new forecast arrives successfully, so a failed fetch never destroys valid
 * data or shows the wrong city.
 */
async function loadCity(city) {
  state.refreshing = false;

  Ui.renderLocation(city, null, city.timezone);
  Ui.startLiveClock(city.timezone);
  Ui.hideErrorView();
  Ui.hideBanner();
  Ui.hideEmptyState();
  Ui.showLoader(true, 'Loading weather&hellip;');

  try {
    const signal = nextSignal();
    const data = await Api.fetchWeather(city.latitude, city.longitude, city.timezone, signal);
    state.controller = null;
    state.city = city;
    state.data = data;

    Ui.hideErrorView();
    Ui.renderLocation(city, data.current.time, data.timezone, data.utcOffsetSeconds);
    Ui.renderWeather(data, state.unit);
    Ui.showLoader(false);
  } catch (error) {
    state.controller = null;
    if (error.name === 'AbortError') {
      Ui.showLoader(false);
      return;
    }
    Ui.showLoader(false);
    if (state.data) {
      // Keep previously displayed valid data and city, then tell the user.
      Ui.renderLocation(state.city, state.data.current.time, state.data.timezone, state.data.utcOffsetSeconds);
      Ui.renderWeather(state.data, state.unit);
      Ui.showBanner(error.message);
    } else {
      Ui.showErrorView(error.message, () => loadCity(city));
    }
  }
}
/**
 * Handle a user-initiated city search: geocode, then fetch weather.
 */
async function handleSearch(query) {
  if (!query || !query.trim()) {
    Ui.setSearchInputInvalid(true);
    Ui.setSearchMessage('Please enter a city name.');
    return;
  }

  Ui.setSearchInputInvalid(false);
  Ui.setSearchMessage('');
  Ui.hideEmptyState();
  Ui.setSearchButtonLoading(true);

  try {
    const signal = nextSignal();
    const results = await Api.searchCities(query, signal);

    if (!results || results.length === 0) {
      Ui.setSearchMessage(`No results found for "${escapeSearch(query)}".`);
      Ui.setSearchButtonLoading(false);
      return;
    }

    // Open-Meteo orders results by relevance, so the first match is the best
    // choice. Showing one sensible result keeps the experience focused.
    const city = results[0];
    await loadCity(city);
  } catch (error) {
    if (error.name === 'AbortError') {
      Ui.setSearchButtonLoading(false);
      return;
    }
    Ui.setSearchMessage(error.message || 'Unable to search. Please try again.');
  } finally {
    Ui.setSearchButtonLoading(false);
  }
}

/**
 * Refresh the weather for the currently selected city without changing the
 * city or unit. Previous valid data is preserved if the refresh fails.
 */
async function handleRefresh() {
  if (state.refreshing) return;
  state.refreshing = true;
  const button = document.querySelector('.refresh-button');
  const icon = button ? button.querySelector('.refresh-icon') : null;
  if (button) button.classList.add('refresh--loading');
  if (icon) icon.classList.add('refresh--spin');

  Ui.showLoader(true, 'Refreshing weather&hellip;');

  try {
    const signal = nextSignal();
    const data = await Api.fetchWeather(
      state.city.latitude,
      state.city.longitude,
      state.city.timezone,
      signal
    );
    state.controller = null;
    state.data = data;

    Ui.renderLocation(state.city, data.current.time, data.timezone, data.utcOffsetSeconds);
    Ui.renderWeather(data, state.unit);
    Ui.showLoader(false);
    Ui.hideBanner();
  } catch (error) {
    state.controller = null;
    if (error.name === 'AbortError') {
      Ui.showLoader(false);
      state.refreshing = false;
      if (button) button.classList.remove('refresh--loading');
      if (icon) icon.classList.remove('refresh--spin');
      return;
    }
    // Preserve previously loaded valid data and city.
    Ui.renderLocation(state.city, state.data.current.time, state.data.timezone, state.data.utcOffsetSeconds);
    Ui.renderWeather(state.data, state.unit);
    Ui.showLoader(false);
    Ui.showBanner(`Refresh failed: ${error.message}`);
  } finally {
    state.refreshing = false;
    if (button) button.classList.remove('refresh--loading');
    if (icon) icon.classList.remove('refresh--spin');
  }
}

/**
 * Escape a user-supplied search term for safe insertion into UI text.
 */
function escapeSearch(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

async function init() {
  Ui.init();
  Ui.updateUnitToggle(state.unit);

  const input = Ui.getSearchInputElement();
  const form = document.getElementById('search-form');
  const retryButton = document.getElementById('current-retry');
  const unitToggle = document.querySelector('.unit-toggle');
  const refreshButton = document.querySelector('.refresh-button');

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const button = form.querySelector('.search-button');
      if (button && button.disabled) return;
      handleSearch(input.value);
    });
  }

  if (input) {
    input.addEventListener('input', () => {
      if (input.value.length > 0) {
        Ui.setSearchInputInvalid(false);
        Ui.setSearchMessage('');
      }
    });
  }

  if (unitToggle) {
    unitToggle.addEventListener('click', () => {
      state.unit = state.unit === UNIT_CELSIUS ? UNIT_FAHRENHEIT : UNIT_CELSIUS;
      Ui.updateUnitToggle(state.unit);
      if (state.data) {
        Ui.renderWeather(state.data, state.unit);
      }
    });
  }

  if (refreshButton) {
    refreshButton.addEventListener('click', () => {
      handleRefresh();
    });
  }

  if (retryButton) {
    retryButton.addEventListener('click', () => {
      loadCity(state.city);
    });
  }

  // Kick off with the default demonstration city.
  await loadCity(state.city);
}

init();