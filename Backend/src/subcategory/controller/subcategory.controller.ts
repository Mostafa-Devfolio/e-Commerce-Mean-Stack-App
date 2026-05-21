import type { Request, Response, NextFunction } from "express";
import SubCategory from "../model/subcategory.model.ts";
import { catchAsync } from "../../../utilities/catchAsync.ts";
import AppError from "../../../utilities/AppError.ts";

export const createSubCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, categoryId, isDeleted, isActive } = req.body;
    const mySubCategory = await SubCategory.create({
      title,
      categoryId,
      isDeleted,
      isActive,
    });
    if (!mySubCategory) {
      return next(new AppError("SubCategory not created", 400));
    }
    res.status(200).json({
      message: "SubCategory is created",
      data: mySubCategory,
    });
  },
);

export const getAllSubCategories = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const mySubCategories = await SubCategory.find();
    if (!mySubCategories) {
      return next(new AppError("No Subcategories found", 400));
    }
    res.status(200).json(mySubCategories);
  },
);

export const getSubCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const mySubCategory = await SubCategory.findById(id);
    if (!mySubCategory) {
      return next(new AppError("No subcatgory!", 400));
    }
    res.status(200).json(mySubCategory);
  },
);

export const updateSubCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const { title, categoryId, isDeleted, isActive } = req.body;
    const mySubCategory = await SubCategory.findById(id);
    if (!mySubCategory) {
      return next(new AppError(`Subcategory ${title} is not updated!`, 400));
    }
    if (title) {
      mySubCategory.title = title;
    }
    if (categoryId) {
      mySubCategory.categoryId = categoryId;
    }
    if (isDeleted) {
      mySubCategory.isDeleted = isDeleted;
    }
    if (isActive !== undefined) {
      mySubCategory.isActive = isActive;
    }
    await mySubCategory.save();

    res.status(200).json({
      message: `Subcategory ${title} is updated successfully!`,
      data: mySubCategory,
    });
  },
);
