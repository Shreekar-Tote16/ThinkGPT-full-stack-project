const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant", "system"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    sessionId: {
      type: String,
      index: true,
      default: "default",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
