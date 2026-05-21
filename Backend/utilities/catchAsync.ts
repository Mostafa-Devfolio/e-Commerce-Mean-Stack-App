import type { Request, Response, NextFunction } from "express";


export const catchAsync = (fn: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Execute the async function and catch any promise rejections
    fn(req, res, next).catch(next);
  };
};