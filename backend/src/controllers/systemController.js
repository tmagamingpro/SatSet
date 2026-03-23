import { createSystemService } from "../services/systemService.js";

const createSystemController = (deps) => {
  const service = createSystemService(deps);

  const getRoot = () => ({ message: "SatSet API berjalan." });
  const getHealth = () => service.getHealth();
  const getBootstrap = () => service.getBootstrap();

  return {
    getRoot,
    getHealth,
    getBootstrap,
  };
};

export { createSystemController };
