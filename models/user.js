const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = Schema({
  name: { typeof: String, required: true },
  email: { typeof: String, required: true, unique: true },
  password: { typeof: String, required: true, minlength: 6 },
  image: { type: String, required: true },
  places: { typeof: String, required: true },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
