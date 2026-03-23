import { createOrderService } from "../services/orderService.js";
import { sendServiceResult } from "./controllerUtils.js";

const createOrderController = (deps) => {
  const service = createOrderService(deps);

  const create = ({ body, set }) => sendServiceResult(set, service.create(body));
  const update = ({ params, body, set }) => sendServiceResult(set, service.update(params.id, body));

  return {
    create,
    update,
  };
};

export { createOrderController };
