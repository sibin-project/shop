const BASE = "/api";

let onUnauthorized = () => {};
export function setUnauthorizedHandler(fn) {
  onUnauthorized = fn;
}

function getToken() {
  return localStorage.getItem("token");
}

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 401 && auth && token) onUnauthorized();
    const err = new Error(data.message || "Request failed");
    err.status = res.status;
    err.issues = data.issues;
    throw err;
  }

  return data;
}

export const api = {
  register: (payload) => request("/auth/register", { method: "POST", body: payload, auth: false }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload, auth: false }),
  me: () => request("/auth/me"),
  health: () => request("/health", { auth: false }),

  products: {
    list: () => request("/products"),
    create: (payload) => request("/products", { method: "POST", body: payload }),
    update: (id, payload) => request(`/products/${id}`, { method: "PUT", body: payload }),
    remove: (id) => request(`/products/${id}`, { method: "DELETE" }),
  },
};
