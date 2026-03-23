import { createReportService } from "../services/reportService.js";
import { sendServiceResult } from "./controllerUtils.js";

const createReportController = (deps) => {
  const service = createReportService(deps);

  const create = ({ body, set }) => sendServiceResult(set, service.create(body));
  const update = ({ params, body, set }) => sendServiceResult(set, service.update(params.id, body));

  return {
    create,
    update,
  };
};

export { createReportController };
