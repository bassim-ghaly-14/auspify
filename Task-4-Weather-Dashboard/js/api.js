/**
 * api.js — API requests, response validation, and network errors.
 *
 * Weather provider: Open-Meteo (free, no API key required).
 * - Geocoding API: city name → coordinates
 *   https://open-meteo.com/en/docs/geocoding-api
 * - Forecast API: coordinates → current, hourly, and daily weather
 *   https://open-meteo.com/en/docs
 */

const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_API = 'https://api.open-meteo.com/v1/forecast';

/**
 * Domain error for API failures. Carries an optional HTTP status so the UI can
 * distinguish "not found" from network or server errors without exposing
 * stack traces to the user.
 */
export class ApiError extends Error {
  constructor(message, status, info) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.info = info;
  }
}

/**
 * Throw when the HTTP response is not successful.
 */
function checkResponse(response) {
  if (!response.ok) {
    const status = response.status;
    let message;
    if (status === 404) {
      message = 'Location not found.';
    } else if (status === 429) {
      message = 'Too many requests. Please wait a moment and try again.';
    } else if (status >= 500) {
      message = 'The weather service is temporarily unavailable. Please try again later.';
    } else {
      message = `Request failed (HTTP ${status}).`;
    }
    throw new ApiError(message, status);
  }
}

/**
 * Parse JSON, translating syntax errors into a friendly ApiError.
 */
async function parseJson(response) {
  try {
    return await response.json();
  } catch (error) {
    throw new ApiError('Received an invalid response from the weather service.', 0, error);
  }
}

/**
 * Required current-weather fields from the forecast API.
 */
const CURRENT_FIELDS = [
  'temperature_2m',
  'relative_humidity_2m',
  'apparent_temperature',
  'is_day',
  'precipitation',
  'weather_code',
  'wind_speed_10m',
  'wind_direction_10m',
];

const CURRENT_PARAM = CURRENT_FIELDS.join(',');
const HOURLY_PARAM = 'temperature_2m,weather_code,precipitation_probability';
const DAILY_PARAM = 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset';

/**
 * Resolve a city name to coordinates using the Open-Meteo Geocoding API.
 * Returns null when no matching location exists, or a list of normalized
 * results otherwise. `signal` allows callers to abort outdated requests.
 */
export async function searchCities(query, signal) {
  if (!query || !query.trim()) {
    throw new ApiError('Please enter a city name.');
  }

  const url = `${GEOCODING_API}?name=${encodeURIComponent(query.trim())}&count=5&language=en&format=json`;
  const response = await fetch(url, { signal });
  checkResponse(response);

  const data = await parseJson(response);

  if (!data || !Array.isArray(data.results) || data.results.length === 0) {
    return null;
  }

  return data.results.map((result) => ({
    id: result.id,
    name: result.name,
    country: result.country || result.country_code || '',
    admin1: result.admin1 || '',
    latitude: Number(result.latitude),
    longitude: Number(result.longitude),
    timezone: result.timezone || '',
  }));
}

/**
 * Validate that a number is finite.
 */
function isFiniteValue(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

/**
 * Fetch current, hourly, and daily weather for coordinates using the Forecast API.
 * `timezone=auto` is used so the API returns times in the selected location's
 * local time zone.
 */
export async function fetchWeather(latitude, longitude, timeZone, signal) {
  if (!isFiniteValue(latitude) || !isFiniteValue(longitude)) {
    throw new ApiError('Invalid location coordinates.');
  }

  const url =
    `${FORECAST_API}?latitude=${encodeURIComponent(String(latitude))}` +
    `&longitude=${encodeURIComponent(String(longitude))}` +
    `&current=${CURRENT_PARAM}` +
    `&hourly=${HOURLY_PARAM}` +
    `&daily=${DAILY_PARAM}` +
    `&timezone=auto`;

  const response = await fetch(url, { signal });
  checkResponse(response);

  const data = await parseJson(response);

  if (!data || !data.current || !data.hourly || !data.daily) {
    throw new ApiError('The weather service returned incomplete data.');
  }

  const current = data.current;
  for (const field of CURRENT_FIELDS) {
    if (!(field in current)) {
      throw new ApiError(`The weather service is missing a required field (${field}).`);
    }
  }

  const hourlyTimes = data.hourly.time || [];
  const hourly = hourlyTimes.map((time, index) => ({
    time,
    temperature: data.hourly.temperature_2m[index],
    weatherCode: data.hourly.weather_code[index],
    precipitationProbability: data.hourly.precipitation_probability[index],
  }));

  const dailyTimes = data.daily.time || [];
  const daily = dailyTimes.map((date, index) => ({
    date,
    weatherCode: data.daily.weather_code[index],
    max: data.daily.temperature_2m_max[index],
    min: data.daily.temperature_2m_min[index],
    sunrise: data.daily.sunrise[index],
    sunset: data.daily.sunset[index],
  }));

  return {
    current: {
      time: current.time,
      temperature: current.temperature_2m,
      relativeHumidity: current.relative_humidity_2m,
      apparentTemperature: current.apparent_temperature,
      isDay: current.is_day,
      precipitation: current.precipitation,
      weatherCode: current.weather_code,
      windSpeed: current.wind_speed_10m,
      windDirection: current.wind_direction_10m,
    },
    hourly,
    daily,
    timezone: data.timezone || timeZone,
    utcOffsetSeconds: data.utc_offset_seconds,
  };
}