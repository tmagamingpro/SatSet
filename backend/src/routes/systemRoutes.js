import { createSystemController } from "../controllers/systemController.js";

const registerSystemRoutes = (app, deps) => {
  const controller = createSystemController(deps);

  return app
    .get("/", controller.getRoot)
    .get("/health", controller.getHealth)
    .get("/bootstrap", controller.getBootstrap);
};

export { registerSystemRoutes };
