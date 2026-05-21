import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRouter from "./user/route/user.route.ts";
import productRouter from "./product/route/product.route.ts";
import categoryRouter from "./category/route/category.route.ts";
import subCategoryRouter from "./subcategory/route/subcategory.route.ts";
import cartRouter from "./cart/route/cart.route.ts";
import orderRouter from "./order/route/order.route.ts";
import testimonialRouter from "./testimonial/route/testimonial.route.ts";
import connectDB from "./config/dbConnect.ts";
import AppError from "../utilities/AppError.ts";
import { globalErrorHandling } from "./middlewares/error.controller.ts";

const app = express();
app.use(
  cors({
    origin: "http://localhost:4200", // Allow only your Angular app to access the API
    credentials: true,
  }),
);

connectDB();
const port = process.env.PORT;

app.use(express.json());

app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/category", categoryRouter);
app.use("/subcategory", subCategoryRouter);
app.use("/cart", cartRouter);
app.use("/order", orderRouter);
app.use("/testimonial", testimonialRouter);

app.all("/{*path}", (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandling);

app.listen(port, () => {
  console.log("Server started on port: ", port);
});
