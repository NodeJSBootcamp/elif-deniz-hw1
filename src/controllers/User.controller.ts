import { Request, Response, NextFunction } from "express";
import User from "../model/User.model";
import { StatusCodes } from "http-status-codes";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password, isAdmin } = req.body;
    if (!username || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Username and password required" });
    }
    const isDuplicate = await User.findOne({ username, isDeleted: false });
    if (isDuplicate) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: "Username is exist!" });
    }
    await User.create({ username, password, isAdmin })
      .then((result) => {
        res.status(StatusCodes.CREATED).json(result);
      })
      .catch((err) => {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err });
      });
  } catch (err) {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err });
  }
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Username and password required" });
    }

    User.findOne({ username, isDeleted: false })
      .then((result) => {
        if (!result) {
          return res
            .status(StatusCodes.FORBIDDEN)
            .json({ message: "Invalid username" });
        }
        const passwordCheck = result.comparePassword(password);
        if (!passwordCheck) {
          return res
            .status(StatusCodes.FORBIDDEN)
            .json({ message: "Invalid password" });
        }
        return result.createJWT();
      })
      .then((token) => {
        res.status(StatusCodes.ACCEPTED).json({ token });
      })
      .catch((err) => {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err });
      });
  } catch (err) {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err });
  }
};

export const deleteUser = (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "User id needed as params to delete" });
    }

    User.updateOne({ _id: id }, { isDeleted: true })
      .then((result) => {
        if (result) {
          res
            .status(StatusCodes.OK)
            .json({ message: `User id deleted: ${id}` });
        } else {
          res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "Error to delete the user" });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err });
      });
  } catch (err) {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err });
  }
};

export const getAllUsers = (req: Request, res: Response) => {
  try {
    User.find({ isDeleted: false })
      .then((result) => {
        if (result) {
          return res.status(StatusCodes.OK).json(result);
        } else {
          return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "No users found" });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err });
      });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err });
  }
};
