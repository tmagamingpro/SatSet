import { createReportController } from "../controllers/reportController.js";

const registerReportRoutes = (app, deps) => {
  const controller = createReportController(deps);

  return app
    .post("/reports", controller.create)
    .patch("/reports/:id", controller.update);
};

export { registerReportRoutes };
