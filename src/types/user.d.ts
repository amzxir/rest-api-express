import { Types } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  image: string;
  places: Types.ObjectId[];
}
