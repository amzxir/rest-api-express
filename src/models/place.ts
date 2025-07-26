import mongoose, { Schema } from "mongoose";

const placeSchema: Schema<IPlace> = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  image: { type: String, required: true },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  location: {
    lat: { type: String, required: true },
    lng: { type: String, required: true },
  },
});

const Place = mongoose.model<IPlace>("Place", placeSchema);

export default Place;
