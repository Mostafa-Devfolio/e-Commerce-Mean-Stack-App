import type { Request, Response, NextFunction } from "express";
import Product from "../model/product.model.ts";
import { catchAsync } from "../../../utilities/catchAsync.ts";
import AppError from "../../../utilities/AppError.ts";

export const createProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      name,
      description,
      price,
      image,
      stock,
      categoryId,
      subCategoryId,
      isDeleted,
      isActive,
    } = req.body;
    const product = await Product.create({
      name,
      description,
      price,
      image,
      stock,
      categoryId,
      subCategoryId,
      isDeleted,
      isActive,
    });
    if (!product) {
      return next(new AppError("Product not added", 400));
    }
    res.status(200).json({
      data: product,
      message: "Product is added",
    });
  },
);

export const updateProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const {
      name,
      description,
      price,
      image,
      stock,
      categoryId,
      subCategoryId,
      isDeleted,
      isActive,
    } = req.body;
    let myProduct = await Product.findById(id);
    if (!myProduct) {
      return next(new AppError("Product didn't update", 400));
    }
    if (name) {
      myProduct.name = name;
    }
    if (description) {
      myProduct.description = description;
    }
    if (price) {
      myProduct.price = price;
    }
    if (image) {
      myProduct.image = image;
    }
    if (stock) {
      myProduct.stock = stock;
    }
    if (categoryId) {
      myProduct.categoryId = categoryId;
    }
    if (subCategoryId) {
      myProduct.subCategoryId = subCategoryId;
    }
    if (isDeleted) {
      myProduct.isDeleted = isDeleted;
    }
    if (isActive) {
      myProduct.isActive = isActive;
    }

    await myProduct.save();
    res.status(200).json({
      message: "Product updated",
      error: myProduct,
    });
  },
);

export const getProducts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const myProducts = await Product.find({});
    if (!myProducts) {
      return next(new AppError("Cannot find products", 400));
    }
    res.status(200).json({
      message: "All products",
      data: myProducts,
    });
  },
);
