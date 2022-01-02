const mongoose = require("mongoose");

const replySchema = new mongoose.Schema(
  {
    commentId: { type: String, default: "" },
    userId: { type: String, default: "" },
    postId: { type: String, default: "" },
    text: { type: String, default: "" },
    reply2: { type: Array, default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reply", replySchema);
