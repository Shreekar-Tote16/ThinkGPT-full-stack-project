// // //C:\Users\user\ThinkGPT\backend\models\Message.js
// // const mongoose = require("mongoose");

// // const MessageSchema = new mongoose.Schema(
// //   {
// //     role: {
// //       type: String,
// //       enum: ["user", "assistant", "system"],
// //       required: true,
// //     },
// //     content: {
// //       type: String,
// //       required: true,
// //     },
// //     sessionId: {
// //       type: String,
// //       index: true,
// //       default: "default",
// //     },
// //   },
// //   { timestamps: true }
// // );

// // module.exports = mongoose.model("Message", MessageSchema);


// const mongoose = require("mongoose");

// const MessageSchema = new mongoose.Schema(
//   {
//     guestId: {
//       type: String,
//       required: true,
//       immutable: true,
//       index: true,
//     },

//     sessionId: {
//       type: String,
//       required: true,
//       index: true,
//     },

//     role: {
//       type: String,
//       enum: ["user", "assistant", "system"],
//       required: true,
//     },

//     content: {
//       type: String,
//       required: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Efficiently retrieve a guest's conversations.
// MessageSchema.index({
//   guestId: 1,
//   sessionId: 1,
//   createdAt: 1,
// });

// module.exports = mongoose.model("Message", MessageSchema);

const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    // Retain the original guest identity.
    // Existing conversations depend on this field.
    guestId: {
      type: String,
      required: true,
      immutable: true,
      index: true,
    },

    // New account ownership field.
    // Optional so existing guest messages remain valid.
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    sessionId: {
      type: String,
      required: true,
      index: true,
    },

    role: {
      type: String,
      enum: ["user", "assistant", "system"],
      required: true,
    },

    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "messages",
  }
);

// Efficient guest conversation retrieval.
MessageSchema.index({
  guestId: 1,
  sessionId: 1,
  createdAt: 1,
});

// Efficient registered-user conversation retrieval.
MessageSchema.index({
  userId: 1,
  sessionId: 1,
  createdAt: 1,
});

module.exports = mongoose.model(
  "Message",
  MessageSchema
);