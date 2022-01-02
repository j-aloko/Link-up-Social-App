const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema(
  {
    postId: { type: String, default: "" },
    userId: { type: String, default: "" },
    text: { type: String, default: "" },
    reply: { type: Array, default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comments", commentsSchema);
