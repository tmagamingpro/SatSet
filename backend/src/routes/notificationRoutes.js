import { createNotificationController } from "../controllers/notificationController.js";

const registerNotificationRoutes = (app, deps) => {
  const controller = createNotificationController(deps);

  return app
    .post("/notifications", controller.create)
    .patch("/notifications/read/:userId", controller.markRead);
};

export { registerNotificationRoutes };
