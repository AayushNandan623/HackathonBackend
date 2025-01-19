const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  address: { type: String, required: true, unique: true },
  validUntil: { type: Date, required: true },
});

module.exports = mongoose.model("User", userSchema);
