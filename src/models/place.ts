import mongoose, { Document, Schema } from "mongoose";

// 1. Define an interface for the nested location object
export interface ILocation {
  lat: string;
  lng: string;
}

// 2. Define an interface representing a Place document
export interface IPlace extends Document {
  title: string;
  description: string;
  address: string;
  image: string;
  creator: mongoose.Types.ObjectId;
  location: ILocation;
}

// 3. Create the schema corresponding to the document interface.
const PlaceSchema: Schema<IPlace> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    image: { type: String, required: true },
    creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    location: {
      lat: { type: String, required: true },
      lng: { type: String, required: true },
    },
  },
);

// 4. Create and export the model
export default mongoose.model<IPlace>("Place", PlaceSchema);
