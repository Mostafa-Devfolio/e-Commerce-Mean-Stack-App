import type { Request, Response, NextFunction } from "express";
import AppError from "../../utilities/AppError.ts";

export const globalErrorHandling = async (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    const response = {
        status: err.status,
        message: err.message
    }

    if (process.env.NODE_ENV === "development") {
      response.stack = err.stack;
    }

    res.status(err.statusCode).json(response)
};
