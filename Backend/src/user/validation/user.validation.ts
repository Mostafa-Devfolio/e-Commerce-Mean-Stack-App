import z from "zod";
import type { Request, Response, NextFunction } from "express";

const userZodSchema = z.object({
  name: z.string().min(3, "3 Character need for the name at least"),
  mobile: z
    .string()
    .min(9, "9 Character need for the mobile number at least")
    .max(11, "11 Character need for the mobile number at least")
    .regex(/^\d+$/, "Mobile must contain only digits"),
  email: z
    .string()
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Email is not formatted well",
    ),
  password: z.string().min(6, "6 characters are minimium length for password"),
  address: z.array(
    z.object({
      label: z.enum(["home", "work", "other"]),
      addressText: z
        .string()
        .min(10, "10 Character need for the Address Details at least"),
      isDefault: z.boolean().optional(),
    }),
  ).optional(),
  gender: z.enum(["male", "female"]),
  role: z.enum(["user", "admin"]),
  emailConsent: z.boolean().optional(),
  isActive: z.boolean().optional(),
});


const userValidationData = (req: Request, res: Response, next: NextFunction) => {
    try {
        userZodSchema.parse(req.body);
        next()
    } catch (error) {
        res.status(400).json({
            message: "Validation Data Failed",
            errors: error.message
        })
    }
}

export default userValidationData;