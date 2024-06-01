import express from "express";
import { UserController } from "../controllers/userController";
import { auth, authAdmin, authSuperAdmin } from "../middlewares/auth";

const userRouter = express.Router();
const userController = new UserController();

userRouter.get("/", authAdmin, userController.list.bind(userController)),
  userRouter.get("/:id", authAdmin, userController.detail.bind(userController)),
  userRouter.post(
    "/",
    authSuperAdmin,
    userController.store.bind(userController)
  ),
  userRouter.put("/:id", auth, userController.update.bind(userController)),
  userRouter.put(
    "/:id/change-password",
    auth,
    userController.changePassword.bind(userController)
  ),
  userRouter.delete(
    "/:id",
    authSuperAdmin,
    userController.destroy.bind(userController)
  );

export default userRouter;
