import { createOrderController } from "../controllers/orderController.js";

const registerOrderRoutes = (app, deps) => {
  const controller = createOrderController(deps);

  return app
    .post("/orders", controller.create)
    .patch("/orders/:id", controller.update);
};

export { registerOrderRoutes };
