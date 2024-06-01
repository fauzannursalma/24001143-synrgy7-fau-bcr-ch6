import { Response } from "express";
export class ResponseHelper {
  message?: any;
  data?: any;
  code?: number;

  constructor(message?: any, data?: any, code?: number) {
    this.message = message;
    this.data = data;
    this.code = code;
  }

  static success(message: any, data?: any, code?: number) {
    return (res: Response) => {
      res.status(code ?? 200).json({
        code: code ?? 200,
        status: "success",
        message: message ?? "success",
        data: data ?? null,
      });
    };
  }

  static error(message: any, data?: any, code?: number) {
    return (res: Response) => {
      res.status(code ?? 500).json({
        code: code ?? 500,
        status: "error",
        message: message ?? "error",
        data: data ?? null,
      });
    };
  }
}
