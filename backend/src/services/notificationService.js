import { validateCreateNotificationPayload } from "../validators/notificationValidator.js";
import { BaseService } from "./baseService.js";

class NotificationService extends BaseService {
  create(payload) {
    const validationError = validateCreateNotificationPayload(payload);
    if (validationError) return validationError;
    const data = payload ?? {};

    const notification = this.deps.createNotification(Number(data.userId), data.message, data.type || "info");
    return this.ok(201, { notification });
  }

  markRead(userId) {
    const targetUserId = Number(userId);
    for (let i = 0; i < this.state.notifications.length; i += 1) {
      if (this.state.notifications[i].userId === targetUserId) this.state.notifications[i].read = true;
    }
    return this.ok(200, { success: true });
  }
}

const createNotificationService = (deps) => new NotificationService(deps);

export { createNotificationService };
