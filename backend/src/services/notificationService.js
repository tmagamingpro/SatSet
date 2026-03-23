import { validateCreateNotificationPayload } from "../validators/notificationValidator.js";

const createNotificationService = (deps) => {
  const { state, createNotification } = deps;

  const create = (payload) => {
    const validationError = validateCreateNotificationPayload(payload);
    if (validationError) return validationError;
    const data = payload ?? {};

    const notification = createNotification(Number(data.userId), data.message, data.type || "info");
    return { status: 201, body: { notification } };
  };

  const markRead = (userId) => {
    const targetUserId = Number(userId);
    for (let i = 0; i < state.notifications.length; i += 1) {
      if (state.notifications[i].userId === targetUserId) state.notifications[i].read = true;
    }
    return { status: 200, body: { success: true } };
  };

  return {
    create,
    markRead,
  };
};

export { createNotificationService };
