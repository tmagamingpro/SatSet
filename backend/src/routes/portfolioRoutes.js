import { createPortfolioController } from "../controllers/portfolioController.js";

const registerPortfolioRoutes = (app, deps) => {
  const controller = createPortfolioController(deps);

  return app.post("/portfolio", controller.create);
};

export { registerPortfolioRoutes };
