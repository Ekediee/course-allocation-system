// lib/api-client.ts
export async function apiFetch(url: string, options: RequestInit = {}) {
  const res = await fetch(url, {
    credentials: 'include', // ensures cookies are sent
    ...options,
  });

  // Handle session expiration globally
  if (res.status === 401) {
    // Optional: Clear any local app state
    if (typeof window !== 'undefined') {
      window.location.href = '/'; // redirect to login page
    }
    throw new Error('Session expired. Redirecting to login...');
  }

  let data: any = null;
  try {
    data = await res.json();
  } catch (err) {
    // In case response body isn't JSON (rare)
    throw new Error('Invalid server response');
  }

  if (!res.ok) {
    throw new Error(data?.error || 'Request failed');
  }

  return data;
}
