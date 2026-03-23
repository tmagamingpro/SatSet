import { createUserService } from "../services/userService.js";
import { sendServiceResult } from "./controllerUtils.js";

const createUserController = (deps) => {
  const service = createUserService(deps);

  const register = ({ body, set }) => sendServiceResult(set, service.register(body));
  const update = ({ params, body, set }) => sendServiceResult(set, service.update(params.id, body));
  const remove = ({ params, set }) => sendServiceResult(set, service.remove(params.id));

  return {
    register,
    update,
    remove,
  };
};

export { createUserController };
