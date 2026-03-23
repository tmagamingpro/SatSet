import { createAuthController } from "../controllers/authController.js";

const registerAuthRoutes = (app, deps) => {
  const controller = createAuthController(deps);

  return app.post("/auth/login", controller.login);
};

export { registerAuthRoutes };
