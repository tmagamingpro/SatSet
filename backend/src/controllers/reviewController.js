import { createReviewService } from "../services/reviewService.js";
import { sendServiceResult } from "./controllerUtils.js";

const createReviewController = (deps) => {
  const service = createReviewService(deps);

  const create = async ({ body, set }) => sendServiceResult(set, service.create(body));

  return {
    create,
  };
};

export { createReviewController };
