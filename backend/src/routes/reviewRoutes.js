import { createReviewController } from "../controllers/reviewController.js";

const registerReviewRoutes = (app, deps) => {
  const controller = createReviewController(deps);

  return app.post("/reviews", controller.create);
};

export { registerReviewRoutes };
