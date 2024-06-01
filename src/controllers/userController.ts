import { Request, Response } from "express";
import { Users } from "../db/models/users";
import { validate as isUuid } from "uuid";
import { UserService } from "../services/userService";
import { ResponseHelper } from "../helpers/responseHelper";
import { ErrorHelper } from "../helpers/errorHelper";
import { create } from "domain";

export class UserController {
  public userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async store(
    req: Request<Record<string, unknown>, Record<string, unknown>, Users>,
    res: Response
  ): Promise<void> {
    try {
      const user = await this.userService.create(req.body);

      const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      ResponseHelper.success(
        "Data has been saved successfully.",
        payload,
        201
      )(res);
    } catch (error) {
      ErrorHelper.handler(error, res);
    }
  }

  async update(
    req: Request<{ id: string }, Partial<Users>>,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const body = req.body;
      const userData = req.userData;

      if (!isUuid(id)) {
        ResponseHelper.error("Not Found", null, 404)(res);
        return;
      }

      const user = await this.userService.update(id, body, userData);

      const payload = {
        name: user.name,
        email: user.email,
        role: user.role,
      };

      ResponseHelper.success(
        "Data has been updated successfully.",
        payload
      )(res);
    } catch (error) {
      ErrorHelper.handler(error, res);
    }
  }

  async destroy(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!isUuid(id)) {
        ResponseHelper.error("Not Found", null, 404)(res);
        return;
      }

      await this.userService.delete(id);

      ResponseHelper.success("Data has been deleted successfully.", null)(res);
    } catch (error) {
      ErrorHelper.handler(error, res);
    }
  }

  async register(
    req: Request<Record<string, unknown>, Record<string, unknown>, Users>,
    res: Response
  ): Promise<void> {
    try {
      const user = await this.userService.register(req.body);

      const payload = {
        name: user.name,
        email: user.email,
      };

      ResponseHelper.success("Registration success", payload)(res);
    } catch (error) {
      ErrorHelper.handler(error, res);
    }
  }

  async login(
    req: Request<Record<string, unknown>, Record<string, unknown>, Users>,
    res: Response
  ): Promise<void> {
    try {
      const user = await this.userService.login(
        req.body.email,
        req.body.password
      );

      ResponseHelper.success("Login success", user)(res);
    } catch (error) {
      ErrorHelper.handler(error, res);
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      await this.userService.logout(req, res);

      ResponseHelper.success("Logout success", null)(res);
    } catch (error) {
      ErrorHelper.handler(error, res);
    }
  }

  async profile(req: Request, res: Response): Promise<void> {
    try {
      const user = req.userData;

      let payload;

      if (user === undefined) {
        ResponseHelper.error("Unauthorized", null, 401)(res);
        return;
      }

      if (user.role === "member") {
        payload = {
          name: user.name,
          email: user.email,
        };
      }
      if (user.role === "admin" || user.role === "superadmin") {
        payload = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      }

      ResponseHelper.success(
        "Data has been retrieved successfully",
        payload
      )(res);
    } catch (error) {
      ErrorHelper.handler(error, res);
    }
  }

  async detail(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!isUuid(id)) {
        ResponseHelper.error("Not Found", null, 404)(res);
        return;
      }

      const user = await this.userService.show(id as string);

      const payload = {
        name: user.name,
        email: user.email,
        role: user.role,
      };

      ResponseHelper.success(
        "Data has been retrieved successfully",
        payload
      )(res);
    } catch (error) {
      ErrorHelper.handler(error, res);
    }
  }

  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      if (!isUuid(id)) {
        ResponseHelper.error("Invalid ID", null, 400)(res);
        return;
      }

      const { password } = req.body;
      const currentUser = req.userData;

      await this.userService.changePassword(id, password, currentUser);

      ResponseHelper.success(
        "Password has been changed successfully",
        null,
        200
      )(res);
    } catch (error) {
      ErrorHelper.handler(error, res);
    }
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userService.list(req.query);

      ResponseHelper.success(
        "Data has been retrieved successfully",
        users
      )(res);
    } catch (error) {
      ErrorHelper.handler(error, res);
    }
  }
}
