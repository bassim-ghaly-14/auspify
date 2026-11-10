/**
 * utils.js — Formatting, unit conversion, date/time helpers, and miscellaneous utilities.
 * All temperature values are stored internally in Celsius and converted for display only.
 */

const UNIT_CELSIUS = 'c';
const UNIT_FAHRENHEIT = 'f';

/**
 * Convert a temperature between Celsius and Fahrenheit.
 * `value` must be expressed in the `from` unit.
 */
function convertTemperature(value, from, to) {
  if (from === to || value == null || Number.isNaN(value)) return value;
  if (from === UNIT_CELSIUS && to === UNIT_FAHRENHEIT) return value * 9 / 5 + 32;
  if (from === UNIT_FAHRENHEIT && to === UNIT_CELSIUS) return (value - 32) * 5 / 9;
  return value;
}

/**
 * Format a temperature (stored internally in Celsius) for display in the active unit.
 */
function formatTemperature(tempC, unit) {
  const value = unit === UNIT_FAHRENHEIT ? convertTemperature(tempC, UNIT_CELSIUS, UNIT_FAHRENHEIT) : tempC;
  return Math.round(value);
}

/**
 * Format a temperature with its unit symbol (e.g. "24°C" or "75°F").
 */
function formatTemperatureWithUnit(tempC, unit) {
  return `${formatTemperature(tempC, unit)}${unit === UNIT_FAHRENHEIT ? '°F' : '°C'}`;
}

/**
 * Convert wind direction degrees to a 16-point compass abbreviation.
 * Returns null when the value is missing or invalid.
 */
function compassDirection(degrees) {
  if (degrees == null || Number.isNaN(degrees)) return null;
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const normalized = ((degrees % 360) + 360) % 360;
  return directions[Math.round(normalized / 22.5) % 16];
}

/**
 * Parse an "HH:mm" or ISO datetime time string into { hours, minutes }.
 */
function parseTimeString(timeString) {
  const match = String(timeString).match(/(?:T|\s)?(\d{1,2}):(\d{2})/);
  if (!match) return null;
  return { hours: Number(match[1]), minutes: Number(match[2]) };
}

/**
 * Format an "HH:mm" string into a 12-hour clock string (e.g. "2:00 PM").
 * No timezone conversion is applied: the input is already a local wall-clock time.
 */
function formatClockTime(timeString) {
  const parts = parseTimeString(timeString);
  if (!parts) return String(timeString);
  const { hours, minutes } = parts;
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 || 12;
  return `${displayHour}:${String(minutes).padStart(2, '0')} ${period}`;
}

/**
 * Format an ISO date string (YYYY-MM-DD) into a short day name (e.g. "Mon").
 */
function formatDayName(dateString) {
  const date = new Date(`${dateString}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return String(dateString);
  return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
}

/**
 * Format an ISO date string (YYYY-MM-DD) into "Mon, Nov 10".
 */
function formatDateLabel(dateString) {
  const date = new Date(`${dateString}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return String(dateString);
  return new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(date);
}

/**
 * Format a local date/time string for the header using the city's IANA time zone.
 *
 * `isoDateTime` is a local wall-clock string as returned by the API (no Z
 * suffix). `utcOffsetSeconds` is the API's utc_offset_seconds for the city.
 */
function formatLocalDateTime(isoDateTime, timeZone, utcOffsetSeconds) {
  if (!isoDateTime) return '--';
  const offset = Number.isFinite(utcOffsetSeconds) ? utcOffsetSeconds : 0;
  // The API string is the city's wall-clock time. Parse it as UTC, then wind
  // the instant back by the city offset so Intl renders it in the city zone.
  const ms = Date.parse(`${isoDateTime}Z`) - offset * 1000;
  const date = new Date(ms);
  if (Number.isNaN(date.getTime())) return '--';
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone,
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch (error) {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }
}

/**
 * Debounce: limits how often a function can fire.
 */
function debounce(func, wait) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), wait);
  };
}

/**
 * Escape unsafe HTML characters to prevent XSS when inserting user-controlled text.
 */
function escapeHtml(text) {
  if (text == null) return '';
  const div = document.createElement('div');
  div.textContent = String(text);
  return div.innerHTML;
}

/**
 * Clamp a number between min and max.
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export {
  UNIT_CELSIUS,
  UNIT_FAHRENHEIT,
  convertTemperature,
  formatTemperature,
  formatTemperatureWithUnit,
  compassDirection,
  parseTimeString,
  formatClockTime,
  formatDayName,
  formatDateLabel,
  formatLocalDateTime,
  debounce,
  escapeHtml,
  clamp,
};