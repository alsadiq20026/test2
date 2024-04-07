const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: Number, required: true, unique: true },
  profile: { type: String, default: "default.png" },
});
module.exports = mongoose.model("User", UserSchema);
