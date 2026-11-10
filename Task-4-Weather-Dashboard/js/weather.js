/**
 * weather.js — Weather-code interpretation and weather-related transformations.
 *
 * Weather codes follow the official WMO weather interpretation codes used by
 * Open-Meteo: https://open-meteo.com/en/docs
 * Raw numeric codes are never displayed to users.
 */

const UNKNOWN_CODE = { label: 'Unknown', icon: 'unknown' };

// Map of WMO code → { label, icon }. "clear", "mainly-clear", "partly-cloudy"
// and "showers" receive a day/night suffix in interpretWeatherCode().
const CODE_MAP = {
  0: { label: 'Clear sky', icon: 'clear' },
  1: { label: 'Mainly clear', icon: 'mainly-clear' },
  2: { label: 'Partly cloudy', icon: 'partly-cloudy' },
  3: { label: 'Overcast', icon: 'overcast' },
  45: { label: 'Fog', icon: 'fog' },
  48: { label: 'Depositing rime fog', icon: 'fog' },
  51: { label: 'Light drizzle', icon: 'drizzle' },
  53: { label: 'Moderate drizzle', icon: 'drizzle' },
  55: { label: 'Dense drizzle', icon: 'drizzle' },
  56: { label: 'Light freezing drizzle', icon: 'freezing-rain' },
  57: { label: 'Dense freezing drizzle', icon: 'freezing-rain' },
  61: { label: 'Slight rain', icon: 'rain' },
  63: { label: 'Moderate rain', icon: 'rain' },
  65: { label: 'Heavy rain', icon: 'rain' },
  66: { label: 'Light freezing rain', icon: 'freezing-rain' },
  67: { label: 'Heavy freezing rain', icon: 'freezing-rain' },
  71: { label: 'Slight snow', icon: 'snow' },
  73: { label: 'Moderate snow', icon: 'snow' },
  75: { label: 'Heavy snow', icon: 'snow' },
  77: { label: 'Snow grains', icon: 'snow' },
  80: { label: 'Slight rain showers', icon: 'showers' },
  81: { label: 'Moderate rain showers', icon: 'showers' },
  82: { label: 'Violent rain showers', icon: 'showers' },
  85: { label: 'Slight snow showers', icon: 'snow-showers' },
  86: { label: 'Heavy snow showers', icon: 'snow-showers' },
  95: { label: 'Thunderstorm', icon: 'thunderstorm' },
  96: { label: 'Thunderstorm with slight hail', icon: 'thunderstorm' },
  99: { label: 'Thunderstorm with heavy hail', icon: 'thunderstorm' },
};

/**
 * Day/night variants for icons that differ between day and night.
 */
const DAY_NIGHT_ICONS = ['clear', 'mainly-clear', 'partly-cloudy', 'showers'];

/**
 * Interpret a WMO weather code into a human-readable label and an icon key.
 * `isDay` is 1 (day), 0 (night), or null/unknown.
 * Never returns a raw numeric code to the caller.
 */
function interpretWeatherCode(code, isDay) {
  const entry = code == null ? UNKNOWN_CODE : CODE_MAP[code];
  if (!entry) return UNKNOWN_CODE;

  let icon = entry.icon;
  if (DAY_NIGHT_ICONS.includes(icon)) {
    icon = isDay === 0 ? `${icon}-night` : `${icon}-day`;
  }
  return { label: entry.label, icon };
}

/**
 * Build a readable summary line for the current condition.
 */
function conditionSummary(entry) {
  return entry.label;
}

export { interpretWeatherCode, conditionSummary, UNKNOWN_CODE };