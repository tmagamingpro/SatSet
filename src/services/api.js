/**
 * Simulasi layer API / service
 * Di production, ganti fetch() ke endpoint backend nyata
 */

export const authService = {
  login: async (users, email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) throw new Error("Email atau password salah.");
    if (user.role === "penyedia" && !user.isVerified)
      throw new Error("Akun belum diverifikasi oleh admin.");
    return user;
  },
};

export const userService = {
  getProviders: (users) => users.filter(u => u.role === "penyedia" && u.isVerified),
  getByRole: (users, role) => users.filter(u => u.role === role),
  getById: (users, id) => users.find(u => u.id === id),
};

export const orderService = {
  getByCustomer: (orders, customerId) => orders.filter(o => o.customerId === customerId),
  getByProvider: (orders, providerId) => orders.filter(o => o.providerId === providerId),
  getAll: (orders) => orders,
};
