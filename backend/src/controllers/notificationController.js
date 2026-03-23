import { createNotificationService } from "../services/notificationService.js";
import { sendServiceResult } from "./controllerUtils.js";

const createNotificationController = (deps) => {
  const service = createNotificationService(deps);

  const create = ({ body, set }) => sendServiceResult(set, service.create(body));
  const markRead = ({ params, set }) => sendServiceResult(set, service.markRead(params.userId));

  return {
    create,
    markRead,
  };
};

export { createNotificationController };
