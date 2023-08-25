import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";

declare module "express-serve-static-core" {
  interface Request {
    username: string;
    userId: string;
    isAdmin: boolean;
  }
}

export const verifyJWT: RequestHandler = (req, res, next) => {
  const authHeader = req.headers["authorization"] as string;

  if (!authHeader?.startsWith("Bearer"))
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Not authoized, no token!" });

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET_KEY as string, (err, decoded) => {
    if (err) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: err });
    }
    const { username, isAdmin, userId } = decoded as JwtPayload;
    req.username = username;
    req.userId = userId;
    req.isAdmin = isAdmin;
  });

  next();
};
