import type { Request, Response, NextFunction } from 'express';


export const authorized = (...allowedRoles) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(400).json({
                errors: "Access Denied"
            })
        }
        next();
    }
}