import { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  mobile: string;
  password: string;
  role: string;

  correctPassword(candidatePassword: string): Promise<boolean>;
}
