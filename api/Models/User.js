const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, min: 3, max: 20, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    confirmPassword: { type: String, required: true },
    profilePic: { type: String, default: "" },
    coverPhoto: { type: String, default: "" },
    followers: { type: Array, default: [] },
    following: { type: Array, default: [] },
    description: { type: String, default: "" },
    city: { type: String, default: "", max: 20 },
    from: { type: String, default: "", max: 30 },
    relationship: { type: String, default: "" },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
