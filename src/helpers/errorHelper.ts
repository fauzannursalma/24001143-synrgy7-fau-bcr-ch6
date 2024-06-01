import { NotFoundError, ValidationError } from "objection";
import { Response } from "express";

import { ResponseHelper } from "./responseHelper";

export class ErrorHelper {
  error?: any;

  constructor(error?: any) {
    this.error = error;
  }

  static handler(error: any, res: Response) {
    if (error instanceof ValidationError) {
      ResponseHelper.error(error.message, null, 400)(res);
    } else if (error instanceof NotFoundError) {
      ResponseHelper.error(error.message, null, 404)(res);
    } else if (error instanceof Error) {
      ResponseHelper.error(error.message, null, 400)(res);
    } else {
      ResponseHelper.error("An unknown error occurred", null, 500)(res);
    }
  }
}
