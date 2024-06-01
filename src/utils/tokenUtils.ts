import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

export const createToken = (payload: any): any => {
  return jwt.sign(payload as object, process.env.JWT_SECRET ?? "secret", {
    expiresIn: "1h",
  });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, process.env.JWT_SECRET ?? "secret");
};
