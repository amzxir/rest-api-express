interface IPlace extends Document {
  title: string;
  description: string;
  address: string;
  image: string;
  creator: Types.ObjectId;
  location: ILocation;
}

interface ILocation {
  lat: string;
  lng: string;
}
