const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
const isLocalhostApi = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/?$/i.test(configuredApiBaseUrl);
const apiBaseUrl = configuredApiBaseUrl && !(import.meta.env.PROD && isLocalhostApi)
  ? configuredApiBaseUrl
  : '/api';

export const API_BASE_URL = apiBaseUrl.replace(/\/+$/, '');
