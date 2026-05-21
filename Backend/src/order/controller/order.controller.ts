import type { Request, Response, NextFunction } from "express";
import Order from "../model/order.model.ts";
import AppError from "../../../utilities/AppError.ts";
import { catchAsync } from "../../../utilities/catchAsync.ts";

export const getUserOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { orderId } = req.body;
    const myOrder = await Order.findById(orderId);
    if (!myOrder) {
      return next(new AppError("Cannot get user order!", 400));
    }
    res.status(200).json({
      message: "Get order successfully",
      data: myOrder,
    });
  },
);

export const getUserOrders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.body;
    const myOrder = await Order.find({ userId });
    if (!myOrder) {
      return next(new AppError("Cannot get user order!", 400));
    }
    res.status(200).json({
      message: "Get order successfully",
      data: myOrder,
    });
  },
);

export const getAllOrders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const myOrder = await Order.find({});
    if (!myOrder) {
      return next(new AppError("Cannot get user order!", 400));
    }
    res.status(200).json({
      message: "Get order successfully",
      data: myOrder,
    });
  },
);

export const createOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, addressId, phoneNumber, totalPrice, status, products } =
      req.body;
    const myOrder = await Order.create({
      userId,
      addressId,
      phoneNumber,
      totalPrice,
      status,
      products,
    });
    if (!myOrder) {
      return next(new AppError("Failed to create an order!", 400));
    }
    res.status(201).json({
      message: "Order is created!",
      data: myOrder,
    });
  },
);

export const changeOrderStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { orderId, status } = req.body;
    const myOrder = await Order.findOne({ orderId });
    if (!myOrder) {
      return next(new AppError("Order status not changed!", 400));
    }
    if (status) {
      myOrder.status = status;
    }
    await myOrder.save();
    res.status(200).json({
      message: "Order status is changed",
      data: myOrder,
    });
  },
);

export const updateOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { orderId, userId, addressId, phoneNumber, status, productsChange } =
      req.body;
    const myOrder = await Order.findById(orderId);
    if (!myOrder) {
      return next(new AppError("Order failed to update!", 400));
    }
    if (addressId) {
      myOrder.addressId = addressId;
    }
    if (phoneNumber) {
      myOrder.phoneNumber = phoneNumber;
    }
    if (
      productsChange &&
      Array.isArray(productsChange) &&
      myOrder.status == "pending"
    ) {
      for (const item of productsChange) {
        const itemIndex = myOrder.products.findIndex(
          (ind) => ind.productId.toString() === item.productId.toString(),
        );
        if (itemIndex > -1) {
          if (item.quantity === 0) {
            myOrder.products.splice(itemIndex, 1);
          } else {
            myOrder.products[itemIndex]!.quantity = item.quantity;
          }
        }
      }
      let totalPrice = 0;
      for (const item of myOrder.products) {
        totalPrice += item.quantity * item.price;
      }
      myOrder.totalPrice = totalPrice;
    }
    await myOrder.save();
    res.status(200).json({
      message: "Order changed Successfully!",
      data: myOrder,
    });
  },
);
