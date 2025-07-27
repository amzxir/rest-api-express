import mongoose from "mongoose";

// 1. Define an interface for the nested location object
export interface ILocation {
  lat: string;
  lng: string;
}

// 2. Define an interface representing a Place document
export interface IPlace extends mongoose.Document {
  title: string;
  description: string;
  address: string;
  image: string;
  creator: mongoose.Types.ObjectId;
  location: ILocation;
}
