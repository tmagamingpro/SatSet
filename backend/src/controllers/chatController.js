import { createChatService } from "../services/chatService.js";
import { sendServiceResult } from "./controllerUtils.js";

const createChatController = (deps) => {
  const service = createChatService(deps);

  const create = ({ body, set }) => sendServiceResult(set, service.create(body));

  return { create };
};

export { createChatController };
