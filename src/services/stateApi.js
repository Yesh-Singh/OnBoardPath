// Tiny client for the shared state backend served by the Vite middleware
// plugin in vite.config.js (`/api/state`, persisted to data/state.json).
// Same-origin, so no CORS handling. When the server is unreachable every call
// degrades to a no-op and the app keeps working from localStorage.

const ENDPOINT = '/api/state';

export async function fetchServerState() {
  try {
    const response = await fetch(ENDPOINT, { headers: { Accept: 'application/json' } });
    if (!response.ok) return null;
    const data = await response.json();
    return data && data.ok && data.state ? data.state : null;
  } catch {
    return null; // Backend unavailable — caller falls back to localStorage.
  }
}

export async function pushStateValue(key, value) {
  try {
    const response = await fetch(ENDPOINT, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value })
    });
    return response.ok;
  } catch {
    return false; // Caller re-queues the key and retries later.
  }
}
