import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../user/model/user.model.ts";
import AppError from "../../utilities/AppError.ts";

export const authentication = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(402).json({
      message: "Token is not provided",
    });
  }

    const token = authHeader.split(" ")[1];
    if (token == undefined) {
        return;
    }

  const decode = jwt.verify(token, process.env.SECRET_KEY as string);
  const myUser = await User.findById(decode.id).select("-password");
  if (!myUser) {
    return next(new AppError("User not found", 400));
  }

  req.user = myUser;
  next();
};
