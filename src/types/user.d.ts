import mongoose from "mongoose";

// 1. Create an interface representing a document in MongoDB.
export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  image: string;
  places: mongoose.Types.DocumentArray<mongoose.Types.ObjectId>;
}
