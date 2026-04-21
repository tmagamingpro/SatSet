import { createPortfolioService } from "../services/portfolioService.js";
import { sendServiceResult } from "./controllerUtils.js";

const createPortfolioController = (deps) => {
  const service = createPortfolioService(deps);

  const create = ({ body, set }) => sendServiceResult(set, service.create(body));

  return {
    create,
  };
};

export { createPortfolioController };
