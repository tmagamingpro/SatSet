import { createReportService } from "../services/reportService.js";
import { sendServiceResult } from "./controllerUtils.js";

const createReportController = (deps) => {
  const service = createReportService(deps);

  const create = async ({ body, set }) => sendServiceResult(set, service.create(body));
  const update = async ({ params, body, set }) => sendServiceResult(set, service.update(params.id, body));

  return {
    create,
    update,
  };
};

export { createReportController };
