import type { Request, Response, NextFunction } from "express";
import User from "../model/user.model.ts";
import { catchAsync } from "../../../utilities/catchAsync.ts";
import AppError from "../../../utilities/AppError.ts";

export const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      name,
      mobile,
      email,
      password,
      address,
      gender,
      role,
      emailConsent,
      isActive,
    } = req.body;

    const myUser = await User.create({
      name,
      mobile,
      email,
      password,
      address,
      gender,
      role,
      emailConsent,
      isActive,
    });
    if (!myUser) {
      return next(new AppError("Failed to create", 400));
    }
    res.status(201).json({
      message: "Account Create Successfully",
      data: myUser,
    });
  },
);

export const updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!user) return next(new AppError("User not found", 404));
  res.status(200).json({ message: "Updated", data: user });
});

export const deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return next(new AppError("User not found", 404));
  res.status(200).json({ message: "Deleted" });
});

export const getUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const myUsers = await User.find({});
    if (!myUsers) {
      return next(new AppError("Cannot find users", 400));
    }
    res.status(200).json({
      data: myUsers,
    });
  },
);

export const getUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const myUser = await User.findById(id);
    if (!myUser) {
      return next(new AppError("User not found", 400));
    }
    res.status(200).json({
      data: myUser,
    });
  },
);
