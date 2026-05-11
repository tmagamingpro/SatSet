import { createUserService } from "../services/userService.js";
import { sendServiceResult } from "./controllerUtils.js";

const createUserController = (deps) => {
  const service = createUserService(deps);

  const register = async ({ body, set }) => sendServiceResult(set, service.register(body));
  const update = async ({ params, body, set }) => sendServiceResult(set, service.update(params.id, body));
  const remove = async ({ params, set }) => sendServiceResult(set, service.remove(params.id));

  return {
    register,
    update,
    remove,
  };
};

export { createUserController };
