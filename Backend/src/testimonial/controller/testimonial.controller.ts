import type { NextFunction, Request, Response } from "express";
import Testimonial from "../model/testimonial.model.ts";
import { catchAsync } from "../../../utilities/catchAsync.ts";
import AppError from "../../../utilities/AppError.ts";

export const getTestmonials = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const myTestimonial = await Testimonial.find({});
    if (!myTestimonial) {
      return next(new AppError("No testimonials found", 400));
    }
    res.status(200).json({
      message: "All testimonials",
      data: myTestimonial,
    });
  },
);

export const getUserTestmonials = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.body;
    const myTestimonial = await Testimonial.find({ userId });
    if (!myTestimonial) {
      return next(new AppError("No testimonials found", 400));
    }
    res.status(200).json({
      message: "All testimonials",
      data: myTestimonial,
    });
  },
);

export const getSingleTestmonial = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { testimonialId } = req.body;
    const myTestimonial = await Testimonial.findOne({ testimonialId });
    if (!myTestimonial) {
      return next(new AppError("No testimonial found", 400));
    }
    res.status(200).json({
      message: "All testimonials",
      data: myTestimonial,
    });
  },
);

export const updateTestimonial = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const { comment, stars, status, isApproved } = req.body;

    const myTestimonial = await Testimonial.findById(id);
    if (!myTestimonial) {
      return next(new AppError("Testimonial not found!", 404));
    }

    if (comment !== undefined) myTestimonial.comment = comment;
    if (stars !== undefined) myTestimonial.stars = stars;
    if (status !== undefined) myTestimonial.status = status;
    if (isApproved !== undefined) myTestimonial.isApproved = isApproved;

    await myTestimonial.save();

    res.status(200).json({
      message: "Testimonial updated successfully!",
      data: myTestimonial,
    });
  },
);

export const deleteTestimonial = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const myTestimonial = await Testimonial.findByIdAndDelete(id);

    if (!myTestimonial) {
      return next(new AppError("Testimonial not found", 404));
    }

    res.status(200).json({ message: "Testimonial deleted successfully!" });
  },
);

export const createTestimonial = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, comment, stars } = req.body;
    const myTestimonial = await Testimonial.create({
      userId,
      comment,
      stars,
    });
    if (!myTestimonial) {
      return next(new AppError("Cannot create the testimonial", 400));
    }
    res.status(201).json({
      message: "Testimonial posted for the admin to review!",
      data: myTestimonial,
    });
  },
);

export const updateTestimonialStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { testimonialId, status, isApproved } = req.body;
    const myTestimonial = await Testimonial.findById(testimonialId);
    if (!myTestimonial) {
      return next(new AppError("Cannot update testimonial status!", 400));
    }
    if (status) {
      myTestimonial.status = status;
    }
    if (isApproved) {
      myTestimonial.isApproved = isApproved;
    }
    await myTestimonial.save();
    res.status(201).json({
      message: "Testimonial status updated successfully!",
      data: myTestimonial,
    });
  },
);
