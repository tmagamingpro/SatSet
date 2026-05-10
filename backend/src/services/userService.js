import { validateRegisterUserPayload } from "../validators/userValidator.js";
import { BaseService } from "./baseService.js";

class UserService extends BaseService {
  register(payload) {
    const validationError = validateRegisterUserPayload(payload);
    if (validationError) return validationError;
    const data = payload ?? {};

    const emailInUse = this.state.users.some((user) => user.email === data.email);
    if (emailInUse) {
      return this.fail(409, "Email sudah terdaftar.");
    }

    const isProvider = data.role === "penyedia";
    const user = {
      id: this.createId(),
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
      createdAt: this.nowIso(),
    };

    this.state.users.push(user);
    return this.ok(201, { user });
  }

  update(userId, payload) {
    const id = Number(userId);
    const index = this.state.users.findIndex((user) => user.id === id);
    if (index === -1) {
      return this.fail(404, "User tidak ditemukan.");
    }

    this.state.users[index] = { ...this.state.users[index], ...(payload ?? {}) };
    return this.ok(200, { user: this.state.users[index] });
  }

  remove(userId) {
    const id = Number(userId);
    const index = this.state.users.findIndex((user) => user.id === id);
    if (index === -1) {
      return this.fail(404, "User tidak ditemukan.");
    }

    const [deletedUser] = this.state.users.splice(index, 1);
    for (let i = this.state.orders.length - 1; i >= 0; i -= 1) {
      const matchedOrder = this.state.orders[i].customerId === id || this.state.orders[i].providerId === id;
      if (!matchedOrder) continue;
      this.deps.clearChatsByOrder(this.state.orders[i].id);
      this.state.orders.splice(i, 1);
    }
    for (let i = this.state.notifications.length - 1; i >= 0; i -= 1) {
      if (this.state.notifications[i].userId === id) this.state.notifications.splice(i, 1);
    }
    for (let i = this.state.chats.length - 1; i >= 0; i -= 1) {
      if (this.state.chats[i].senderId === id || this.state.chats[i].receiverId === id) this.state.chats.splice(i, 1);
    }

    return this.ok(200, { user: deletedUser });
  }
}

const createUserService = (deps) => new UserService(deps);

export { createUserService };
