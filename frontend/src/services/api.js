const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || "Terjadi kesalahan pada server.");
  }

  return data;
};

export const apiService = {
  getBootstrap: () => request("/bootstrap"),
  login: (email, password) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  registerUser: (payload) =>
    request("/users/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  deleteUser: (id) =>
    request(`/users/${id}`, {
      method: "DELETE",
    }),
  updateUser: (id, payload) =>
    request(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  addOrder: (payload) =>
    request("/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateOrder: (id, payload) =>
    request(`/orders/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  addChat: (payload) =>
    request("/chats", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  addNotification: (payload) =>
    request("/notifications", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  markNotificationsRead: (userId) =>
    request(`/notifications/read/${userId}`, {
      method: "PATCH",
    }),
  addReport: (payload) =>
    request("/reports", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateReport: (id, payload) =>
    request(`/reports/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
};
