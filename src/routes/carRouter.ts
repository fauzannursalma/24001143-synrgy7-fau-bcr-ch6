import express from "express";
import { CarController } from "../controllers/carController";
import { authAdmin } from "../middlewares/auth";

const carRouter = express.Router();

const carController = new CarController();

carRouter.get("/", carController.list.bind(carController));
carRouter.get("/:id", carController.detail.bind(carController));

// admin & superadmin only
carRouter.post("/", authAdmin, carController.create.bind(carController));
carRouter.put("/:id", authAdmin, carController.update.bind(carController));
carRouter.delete("/:id", authAdmin, carController.destroy.bind(carController));

export default carRouter;
