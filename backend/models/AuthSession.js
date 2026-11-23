const mongoose = require("mongoose");

const AuthSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // SHA-256 hash of the authentication token.
    // The original token is only held in the browser's
    // HttpOnly cookie.
    tokenHash: {
      type: String,
      required: true,
      unique: true,
      select: false,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    lastUsedAt: {
      type: Date,
      default: Date.now,
    },

    revokedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "auth_sessions",
  }
);

// Automatically remove expired sessions.
AuthSessionSchema.index(
  { expiresAt: 1 },
  {
    expireAfterSeconds: 0,
    name: "auth_session_expiry",
  }
);

// Find active sessions belonging to a user.
AuthSessionSchema.index({
  userId: 1,
  revokedAt: 1,
});

module.exports = mongoose.model(
  "AuthSession",
  AuthSessionSchema
);