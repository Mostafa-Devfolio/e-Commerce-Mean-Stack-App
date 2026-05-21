import { IUser } from "../interface/User.interface";
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
