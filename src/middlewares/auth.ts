import jwt from "jsonwebtoken";
import { config } from "dotenv";

import { type NextFunction, type Response, type Request } from "express";
import { Users, UsersModel } from "../db/models/users";
import { ResponseHelper } from "../helpers/responseHelper";
import { ErrorHelper } from "../helpers/errorHelper";
import { verifyToken } from "../utils/tokenUtils";

config();

declare global {
  namespace Express {
    interface Request {
      userData: {
        id: string;
        name: string;
        email: string;
        role: string;
      };
    }
  }
}

export const auth: (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization;
    if (bearerToken === undefined) {
      ResponseHelper.error("Unauthorized", null, 401)(res);
      return;
    }

    const tokenUser = bearerToken.split("Bearer ")[1];
    const tokenPayload = verifyToken(tokenUser) as Users;

    const user = await UsersModel.query().findById(tokenPayload.id);
    if (user === undefined) {
      ResponseHelper.error("Forbidden: Invalid Token", null, 403)(res);
      return;
    }

    if (
      user.role === "member" ||
      user.role === "admin" ||
      user.role === "superadmin"
    ) {
      req.userData = user as Users;
      next();
      return;
    } else {
      ResponseHelper.error("Unauthorized", null, 401)(res);
      return;
    }
  } catch (error) {
    ErrorHelper.handler(error, res);
  }
};

export const authAdmin: (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization;
    if (bearerToken === undefined) {
      ResponseHelper.error("Unauthorized", null, 401)(res);
      return;
    }

    const tokenUser = bearerToken.split("Bearer ")[1];
    const tokenPayload = verifyToken(tokenUser) as Users;

    const user = await UsersModel.query().findById(tokenPayload.id);
    if (user === undefined) {
      ResponseHelper.error("Forbidden: Invalid Token", null, 403)(res);
      return;
    }

    if (user.role === "admin" || user.role === "superadmin") {
      req.userData = user as Users;
      next();
      return;
    } else {
      ResponseHelper.error("Unauthorized", null, 401)(res);
      return;
    }
  } catch (error) {
    ResponseHelper.error("Unauthorized", null, 401)(res);
  }
};

export const authSuperAdmin: (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization;
    if (bearerToken === undefined) {
      ResponseHelper.error("Unauthorized", null, 401)(res);
      return;
    }

    const tokenUser = bearerToken.split("Bearer ")[1];
    const tokenPayload = verifyToken(tokenUser) as Users;

    const user = await UsersModel.query().findById(tokenPayload.id);
    if (user === undefined) {
      ResponseHelper.error("Unauthorized", null, 401)(res);
      return;
    }

    if (user.role === "superadmin") {
      req.userData = user as Users;
      next();
      return;
    } else {
      ResponseHelper.error("Unauthorized", null, 401)(res);
      return;
    }
  } catch (error) {
    ResponseHelper.error("Unauthorized", null, 401)(res);
  }
};
