import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";

export const verifyAdmin: RequestHandler = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader?.startsWith("Bearer"))
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "No token" });

  const jwtToken = authHeader.split(" ")[1];

  jwt.verify(jwtToken, process.env.JWT_SECRET_KEY as string, (err, decoded) => {
    if (err) return res.status(StatusCodes.FORBIDDEN).json({ message: err });

    const { isAdmin } = decoded as JwtPayload;

    if (isAdmin) {
      next();
    } else {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Unauthorized action, you are not an admin" });
    }
  });
};
