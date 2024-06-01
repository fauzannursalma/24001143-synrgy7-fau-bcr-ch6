import express from "express";
import userRouter from "./userRouter";
import carRouter from "./carRouter";
import { UserController } from "../controllers/userController";
import { auth } from "../middlewares/auth";

const router = express.Router();
const userController = new UserController();

router.post("/register", userController.register.bind(userController));
router.post("/login", userController.login.bind(userController));
router.post("/logout", auth, userController.logout.bind(userController));
router.get("/profile", auth, userController.profile.bind(userController));

router.use("/cars", carRouter);
router.use("/users", userRouter);

export default router;
