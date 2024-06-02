import { type Response, type Request, type Express } from "express";
import { validate as isUuid } from "uuid";
import { v4 as uuidv4 } from "uuid";
import { CarService } from "../services/carService";
import { ErrorHelper } from "../helpers/errorHelper";
import { ResponseHelper } from "../helpers/responseHelper";

export class CarController {
  carService: CarService;

  constructor() {
    this.carService = new CarService();
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      let cars;
      if (req.headers.authorization) {
        cars = await this.carService.list(req.query);
      } else {
        cars = await this.carService.listPublic(req.query);
      }
      ResponseHelper.success(
        "Data has been retrieved successfully.",
        cars
      )(res);
    } catch (error) {
      ErrorHelper.handler(error, res);
    }
  }

  async detail(req: Request, res: Response): Promise<void> {
    try {
      if (!isUuid(req.params.id)) {
        ResponseHelper.error("Not Found", null, 404)(res);
        return;
      }

      let car;
      if (req.headers.authorization) {
        car = await this.carService.show(req.params.id);
      } else {
        car = await this.carService.showPublic(req.params.id);
      }
      ResponseHelper.success("Data has been retrieved successfully.", car)(res);
    } catch (error) {
      ErrorHelper.handler(error, res);
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const id = uuidv4();

      const body = {
        id,
        ...req.body,
      };

      const car = await this.carService.create(body, req.file, req.userData.id);
      ResponseHelper.success(
        "Data has been saved successfully.",
        car,
        201
      )(res);
    } catch (error) {
      ErrorHelper.handler(error, res);
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const car = await this.carService.update(
        req.params.id,
        req.body,
        req.file,
        req.userData.id
      );
      ResponseHelper.success("Data has been updated successfully.", car)(res);
    } catch (error) {
      ErrorHelper.handler(error, res);
    }
  }

  async destroy(req: Request, res: Response): Promise<void> {
    try {
      if (!isUuid(req.params.id)) {
        ResponseHelper.error("Not Found", null, 404)(res);
        return;
      }

      await this.carService.delete(req.params.id, req.userData.id);
      ResponseHelper.success("Data has been deleted successfully.", null)(res);
    } catch (error) {
      ErrorHelper.handler(error, res);
    }
  }

  async restore(req: Request, res: Response): Promise<void> {
    try {
      if (!isUuid(req.params.id)) {
        ResponseHelper.error("Not Found", null, 404)(res);
        return;
      }

      await this.carService.restore(req.params.id);
      ResponseHelper.success("Data has been restored successfully.", null)(res);
    } catch (error) {
      ErrorHelper.handler(error, res);
    }
  }

  async trash(req: Request, res: Response): Promise<void> {
    try {
      const cars = await this.carService.trash();
      ResponseHelper.success(
        "Data has been retrieved successfully.",
        cars
      )(res);
    } catch (error) {
      ErrorHelper.handler(error, res);
    }
  }
}
