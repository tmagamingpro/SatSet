import { createUserController } from "../controllers/userController.js";

const registerUserRoutes = (app, deps) => {
  const controller = createUserController(deps);

  return app
    .post("/users/register", controller.register)
    .patch("/users/:id", controller.update)
    .delete("/users/:id", controller.remove);
};

export { registerUserRoutes };
