const API_BASE = "https://lumina-backend-pqy3.onrender.com";
const TOKEN_KEY = "lumina_token";

const getToken = () => localStorage.getItem(TOKEN_KEY);
const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
const clearToken = () => localStorage.removeItem(TOKEN_KEY);

async function apiFetch(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth && getToken()) headers.Authorization = `Bearer ${getToken()}`;
  const res = await fetch(API_BASE + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json().catch(() => ({})) : null;
  if (!res.ok)
    throw new Error(data?.error || data?.erro || `Erro ${res.status}`);
  return data;
}

const authApi = {
  register: (name, email, password) =>
    apiFetch("/auth/register", {
      method: "POST",
      body: { name, email, password },
      auth: false,
    }),
  login: (email, password) =>
    apiFetch("/auth/login", {
      method: "POST",
      body: { email, password },
      auth: false,
    }),
  logout: () => apiFetch("/auth/logout", { method: "POST" }).catch(() => null),
};

const userApi = {
  updateProfile: (data) =>
    apiFetch("/users/profile", { method: "PATCH", body: data }),
  changePassword: (lastPassword, newPassword) =>
    apiFetch("/users/change-password", {
      method: "PATCH",
      body: { lastPassword, newPassword },
    }),
};

const chatApi = {
  newChat: (title) =>
    apiFetch("/lumina/new-chat", {
      method: "POST",
      body: { title },
    }),

  listChats: () => apiFetch("/lumina/chats"),

  listMessages: (chatId) => apiFetch(`/lumina/chats/${chatId}/messages`),

  sendMessage: (chatId, content) =>
    apiFetch(`/lumina/chats/${chatId}/messages`, {
      method: "POST",
      body: { content },
    }),

  updateChat: (chatId, title) =>
    apiFetch(`/lumina/chats/${chatId}`, {
      method: "PUT",
      body: { title },
    }),

  deleteChat: (chatId) =>
    apiFetch(`/lumina/chats/${chatId}`, {
      method: "DELETE",
    }),
};

const exerciseApi = {
  list: () => apiFetch("/exercises"),
  generate: (subject, difficulty) =>
    apiFetch("/exercises/generate", {
      method: "POST",
      body: { subject, difficulty },
    }),
  answer: (exerciseId, answer) =>
    apiFetch(`/exercises/${exerciseId}/answer`, {
      method: "POST",
      body: { answer },
    }),
  remove: (exerciseId) =>
    apiFetch(`/exercises/${exerciseId}`, { method: "DELETE" }),
};

// Guard helpers
function requireAuth() {
  if (!getToken()) window.location.href = "auth.html";
}
function redirectIfAuth() {
  if (getToken()) window.location.href = "app.html";
}
