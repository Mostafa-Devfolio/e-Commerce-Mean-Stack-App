import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import User from '../user/model/user.model.ts';

export const loginToken = (user: any) => {
    return jwt.sign(
      {
        id: user._id,
        role: user.role,
        name: user.name,
      },
      process.env.SECRET_KEY as string,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const myUser = await User.findOne({ email });
    if (myUser && (await myUser.correctPassword(password))) {
      const token = loginToken(myUser);
      return res.status(200).json({
        message: "Token found",
        data: token,
      });
    }
    res.status(400).json({
        message: "Cannot find that user or its token"
    })
}