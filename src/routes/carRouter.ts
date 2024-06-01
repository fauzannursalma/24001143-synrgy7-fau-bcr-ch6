import express from "express";
import { CarController } from "../controllers/carController";
import { auth, authAdmin, authSuperAdmin } from "../middlewares/auth";

const carRouter = express.Router();

const carController = new CarController();

// Public Routes
carRouter.get("/public", carController.listPublic.bind(carController));
carRouter.get("/public/:id", carController.detailPublic.bind(carController));

// Role Routes
carRouter.get("/", authAdmin, carController.list.bind(carController));
carRouter.get("/:id", authAdmin, carController.detail.bind(carController));
carRouter.post("/", authAdmin, carController.create.bind(carController));
carRouter.put("/:id", authAdmin, carController.update.bind(carController));
carRouter.delete("/:id", authAdmin, carController.destroy.bind(carController));

export default carRouter;
