import { validateRegisterUserPayload } from "../validators/userValidator.js";

const createUserService = (deps) => {
  const { state, createId, nowIso, clearChatsByOrder } = deps;

  const register = (payload) => {
    const validationError = validateRegisterUserPayload(payload);
    if (validationError) return validationError;
    const data = payload ?? {};

    const emailInUse = state.users.some((user) => user.email === data.email);
    if (emailInUse) {
      return { status: 409, body: { message: "Email sudah terdaftar." } };
    }

    const isProvider = data.role === "penyedia";
    const user = {
      id: createId(),
      ...data,
      avatar: data.name.slice(0, 2).toUpperCase(),
      isVerified: data.role === "pencari",
      isActive: isProvider,
      officeLocation: isProvider ? data.officeLocation || "" : "",
      experience: isProvider ? data.experience || "" : "",
      lat: isProvider ? data.lat ?? null : null,
      lng: isProvider ? data.lng ?? null : null,
      skills: [],
      rating: 0,
      totalJobs: 0,
      createdAt: nowIso(),
    };

    state.users.push(user);
    return { status: 201, body: { user } };
  };

  const update = (userId, payload) => {
    const id = Number(userId);
    const index = state.users.findIndex((user) => user.id === id);
    if (index === -1) {
      return { status: 404, body: { message: "User tidak ditemukan." } };
    }

    state.users[index] = { ...state.users[index], ...(payload ?? {}) };
    return { status: 200, body: { user: state.users[index] } };
  };

  const remove = (userId) => {
    const id = Number(userId);
    const index = state.users.findIndex((user) => user.id === id);
    if (index === -1) {
      return { status: 404, body: { message: "User tidak ditemukan." } };
    }

    const [deletedUser] = state.users.splice(index, 1);
    for (let i = state.orders.length - 1; i >= 0; i -= 1) {
      const matchedOrder = state.orders[i].customerId === id || state.orders[i].providerId === id;
      if (!matchedOrder) continue;
      clearChatsByOrder(state.orders[i].id);
      state.orders.splice(i, 1);
    }
    for (let i = state.notifications.length - 1; i >= 0; i -= 1) {
      if (state.notifications[i].userId === id) state.notifications.splice(i, 1);
    }
    for (let i = state.chats.length - 1; i >= 0; i -= 1) {
      if (state.chats[i].senderId === id || state.chats[i].receiverId === id) state.chats.splice(i, 1);
    }

    return { status: 200, body: { user: deletedUser } };
  };

  return {
    register,
    update,
    remove,
  };
};

export { createUserService };
