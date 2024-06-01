import { type Response, type Request, type Express } from "express";
import { validate as isUuid } from "uuid";
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
      const cars = await this.carService.list(req.query);
      ResponseHelper.success(
        "Data has been retrieved successfully.",
        cars
      )(res);
    } catch (error) {
      ErrorHelper.handler(error, res);
    }
  }

  async listPublic(req: Request, res: Response): Promise<void> {
    try {
      const cars = await this.carService.listPublic(req.query);
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
      const car = await this.carService.show(req.params.id);
      ResponseHelper.success("Data has been retrieved successfully.", car)(res);
    } catch (error) {
      ErrorHelper.handler(error, res);
    }
  }

  async detailPublic(req: Request, res: Response): Promise<void> {
    try {
      if (!isUuid(req.params.id)) {
        ResponseHelper.error("Not Found", null, 404)(res);
        return;
      }

      const car = await this.carService.showPublic(req.params.id);
      ResponseHelper.success("Data has been retrieved successfully.", car)(res);
    } catch (error) {
      ErrorHelper.handler(error, res);
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const car = await this.carService.create(
        req.body,
        req.file,
        req.userData.id
      );
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

  async listDeleted(req: Request, res: Response): Promise<void> {
    try {
      const cars = await this.carService.listDeleted();
      ResponseHelper.success(
        "Data has been retrieved successfully.",
        cars
      )(res);
    } catch (error) {
      ErrorHelper.handler(error, res);
    }
  }
}
