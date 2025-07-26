import mongoose, { Document, Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

// 1. Create an interface representing a document in MongoDB.
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  image: string;
  places: mongoose.Types.DocumentArray<mongoose.Types.ObjectId>;
}

// 2. Create a Schema corresponding to the document interface.
const UserSchema: Schema<IUser> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  image: { type: String, required: true },
  places: [{ type: mongoose.Types.ObjectId, required: true, ref: "Place" }],
});

// 3. Apply the uniqueValidator plugin to UserSchema.
UserSchema.plugin(uniqueValidator);

// 4. Create and export the model.
export default mongoose.model<IUser>("User", UserSchema);
