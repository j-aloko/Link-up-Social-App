const mongoose = require("mongoose");

const savedPostSchema = new mongoose.Schema(
  {
    postId: { type: String, required: true },
    userId: { type: String, required: true },
    username: { type: String, required: true },
    userPhoto: { type: String, required: true },
    description: { type: String, default: "" },
    img: { type: String, default: "" },
    videoSnap: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SavedPosts", savedPostSchema);
