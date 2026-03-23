import { createAuthService } from "../services/authService.js";
import { sendServiceResult } from "./controllerUtils.js";

const createAuthController = (deps) => {
  const service = createAuthService(deps);

  const login = ({ body, set }) => sendServiceResult(set, service.login(body));

  return { login };
};

export { createAuthController };
