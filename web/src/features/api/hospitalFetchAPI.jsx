const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

/**
 * Core fetch handler
 */
async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: options.method || "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const contentType = res.headers.get("content-type");

  let data;
  if (contentType?.includes("application/json")) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  if (!res.ok) {
    throw new Error(typeof data === "string" ? data : data?.message || "Request failed");
  }

  return data;
}

/**
 * API WRAPPER
 */
const api = {
  // AUTH
  login: (data) =>
    apiFetch("/users/login", { method: "POST", body: data }),

  register: (data) =>
    apiFetch("/users/register", { method: "POST", body: data }),

  logout: () =>
    apiFetch("/users/logout", { method: "POST" }),

  // USER
  getMe: () =>
    apiFetch("/users/me"),

  updateMe: (data) =>
    apiFetch("/users/update", { method: "PUT", body: data }),

  changePassword: (data) =>
    apiFetch("/users/change-password", { method: "PUT", body: data }),

  getAllUsers: () =>
    apiFetch("/users"),

  // HOSPITAL
  getAllHospitals: () =>
    apiFetch("/hospitals"),

  getCurrentHospital: () =>
    apiFetch("/hospitals/me"),

  registerHospital: (data) =>
    apiFetch("/hospitals/register", {
      method: "POST",
      body: data,
    }),
};

export default api;