const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
      unique: true,
      index: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },

    // Never store the original password.
    // This field will contain a salted scrypt hash.
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

module.exports = mongoose.model("User", UserSchema);