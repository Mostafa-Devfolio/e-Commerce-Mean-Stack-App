import type { Request, Response, NextFunction } from "express";
import Category from "../model/category.model.ts";
import { catchAsync } from "../../../utilities/catchAsync.ts";
import AppError from "../../../utilities/AppError.ts";

export const addCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, isDeleted, isActive } = req.body;
    const myCategory = await Category.create({ title, isDeleted, isActive });
    if (!myCategory) {
      return next(new AppError("Category not created", 400));
    }
    res.status(201).json({
      message: "Category Created",
      data: myCategory,
    });
  },
);

export const editCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { categoryId, title, isDeleted, isActive } = req.body;
    const myCategory = await Category.findById(categoryId);

    if (!myCategory) {
      return next(new AppError("Cannot edit category!", 400));
    }

    if (title) {
      myCategory.title = title;
    }
    if (isDeleted) {
      myCategory.isDeleted = isDeleted;
    }
    if (isActive !== undefined) {
      myCategory.isActive = isActive;
    }
    await myCategory.save();
    res.status(200).json({
      message: "Category edited successfully!",
      data: myCategory,
    });
  },
);

export const getCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { categoryId } = req.body;
    const myCategory = await Category.findById(categoryId);
    if (!myCategory) {
      return next(new AppError("Cannot find the category", 400));
    }
    res.status(200).json({
      message: "Found the Category",
      data: myCategory,
    });
  },
);

export const getCategories = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const myCategory = await Category.find({});
    if (!myCategory) {
      return next(new AppError("Cannot find the category", 400));
    }
    res.status(200).json({
      message: "Found the Category",
      data: myCategory,
    });
  },
);
