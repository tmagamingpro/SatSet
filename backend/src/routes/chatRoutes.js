import { createChatController } from "../controllers/chatController.js";

const registerChatRoutes = (app, deps) => {
  const controller = createChatController(deps);

  return app.post("/chats", controller.create);
};

export { registerChatRoutes };
