import type { NextFunction, Request, Response } from "express";
import Cart from "../model/cart.model.ts";
import { catchAsync } from "../../../utilities/catchAsync.ts";
import AppError from "../../../utilities/AppError.ts";

export const addToCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { cartItems, userId, total } = req.body;
    const myCart = await Cart.create({
      cartItems,
      userId,
      total,
    });
    if (!myCart) {
      return next(new AppError("Product didn't add to cart!", 400));
    }
    res.status(201).json({
      message: "Product added to cart!",
      data: myCart,
    });
  },
);

export const getUserCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.body;
    const myCart = await Cart.findOne({ userId });
    if (!myCart) {
      return next(new AppError("No cart available for this user", 400));
    }
    res.status(200).json(myCart);
  },
);

export const removeCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, productId } = req.body;
    let myCart = await Cart.findOne({ userId });
    if (!myCart) {
      return next(new AppError("Cannot find this product", 403));
    }
    const itemIndex = myCart.cartItems.findIndex(
      (item) => item.productId.toString() === productId.toString(),
    );

    if (itemIndex > -1) {
      myCart.cartItems.splice(itemIndex, 1);
    }

    myCart.total = myCart.cartItems.reduce((acc, item) => {
      return acc + item.totalPrice;
    }, 0);

    await myCart.save();

    res.status(200).json({
      message: "Cart is deleted successfully!",
    });
  },
);

export const updateCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, productId, cartItems } = req.body;
    let myCart = await Cart.findOne({ userId });

    if (!myCart) {
      return next(new AppError("Cannot find this cart", 400));
    }

    const itemIndex = myCart.cartItems.findIndex(
      (item) => item.productId.toString() === productId.toString(),
    );

    if (cartItems && cartItems.quantity != undefined) {
      const item = myCart.cartItems[itemIndex];

      if (item == undefined) {
        return;
      }
      item.quantity = cartItems.quantity;

      item.totalPrice = item.quantity * item.priceWhileAdding;
    }

    myCart.total = myCart.cartItems.reduce((acc, item) => {
      return acc + item.totalPrice;
    }, 0);

    await myCart.save();

    res.status(200).json({
      message: "Cart Updated Successfully!",
      data: myCart,
    });
  },
);
