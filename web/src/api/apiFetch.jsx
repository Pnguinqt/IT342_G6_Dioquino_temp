const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

/**
 * Core fetch handler
 */
async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: options.method || "GET",
    credentials: "include", // REQUIRED for session cookies
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const contentType = res.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");

  const data = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const message =
      (data && data.message) || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}

/**
 * API WRAPPER (your app endpoints)
 */
export const api = {
  // AUTH
  getMe: () => apiFetch("/auth/me"),

  login: (data) =>
    apiFetch("/auth/login", {
      method: "POST",
      body: data,
    }),

  logout: () =>
    apiFetch("/auth/logout", {
      method: "POST",
    }),

  // HOSPITALS
  getHospitals: () => apiFetch("/hospitals"),

  // REQUESTS
  getRequests: (userId) =>
    apiFetch(
      `/requests${
        userId ? `?userId=${encodeURIComponent(userId)}` : ""
      }`
    ),

  submitRequest: (data) =>
    apiFetch("/requests", {
      method: "POST",
      body: data,
    }),
};

export default apiFetch;