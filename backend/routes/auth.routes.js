const express = require("express");
const crypto = require("node:crypto");
const { promisify } = require("node:util");
const mongoose = require("mongoose");

const User = require("../models/User");
const AuthSession = require("../models/AuthSession");
const Message = require("../models/Message");

const {
  AUTH_SESSION_MAX_AGE_MS,
  createAuthToken,
  hashAuthToken,
  setAuthCookie,
  clearAuthCookie,
} = require("../middleware/authSession");

const router = express.Router();

const scryptAsync = promisify(crypto.scrypt);

// Password hashing configuration.
const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const SCRYPT_KEY_LENGTH = 64;
const SCRYPT_MAX_MEMORY = 64 * 1024 * 1024;

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function normalizeEmail(value) {
  return typeof value === "string"
    ? value.trim().toLowerCase()
    : "";
}

function isValidEmail(email) {
  return (
    email.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  );
}

function publicUser(user) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}

function noStore(res) {
  res.setHeader("Cache-Control", "no-store");
}

// Check browser Origin against configured frontend origins.
function verifyAllowedOrigin(req, res, next) {
  const origin = req.get("origin");

  // Permit requests without an Origin header, such as
  // command-line API tests.
  if (!origin) return next();

  const allowedOrigins = new Set(
    (
      process.env.FRONTEND_ORIGIN ||
      "http://localhost:5173"
    )
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  );

  if (!allowedOrigins.has(origin)) {
    return res.status(403).json({
      error: "Request origin is not allowed.",
    });
  }

  return next();
}

// ==========================================
// PASSWORD HASHING
// ==========================================

async function hashPassword(password) {
  const salt = crypto
    .randomBytes(16)
    .toString("base64url");

  const derivedKey = await scryptAsync(
    password,
    salt,
    SCRYPT_KEY_LENGTH,
    {
      N: SCRYPT_N,
      r: SCRYPT_R,
      p: SCRYPT_P,
      maxmem: SCRYPT_MAX_MEMORY,
    }
  );

  return [
    "scrypt",
    SCRYPT_N,
    SCRYPT_R,
    SCRYPT_P,
    salt,
    derivedKey.toString("hex"),
  ].join("$");
}

async function verifyPassword(password, storedHash) {
  if (typeof storedHash !== "string") {
    return false;
  }

  const parts = storedHash.split("$");

  if (parts.length !== 6 || parts[0] !== "scrypt") {
    return false;
  }

  const [
    algorithm,
    nText,
    rText,
    pText,
    salt,
    expectedHex,
  ] = parts;

  const n = Number(nText);
  const r = Number(rText);
  const p = Number(pText);

  if (
    algorithm !== "scrypt" ||
    n !== SCRYPT_N ||
    r !== SCRYPT_R ||
    p !== SCRYPT_P ||
    !salt ||
    !/^[a-f0-9]{128}$/i.test(expectedHex)
  ) {
    return false;
  }

  const actual = await scryptAsync(
    password,
    salt,
    SCRYPT_KEY_LENGTH,
    {
      N: n,
      r,
      p,
      maxmem: SCRYPT_MAX_MEMORY,
    }
  );

  const expected = Buffer.from(expectedHex, "hex");

  return (
    actual.length === expected.length &&
    crypto.timingSafeEqual(actual, expected)
  );
}

// ==========================================
// INPUT VALIDATION
// ==========================================

function validateRegistration(body) {
  const name =
    typeof body.name === "string"
      ? body.name.trim()
      : "";

  const email = normalizeEmail(body.email);

  const password =
    typeof body.password === "string"
      ? body.password
      : "";

  if (name.length < 2 || name.length > 80) {
    return {
      error: "Name must be between 2 and 80 characters.",
    };
  }

  if (!isValidEmail(email)) {
    return {
      error: "Enter a valid email address.",
    };
  }

  if (password.length < 8 || password.length > 128) {
    return {
      error: "Password must be between 8 and 128 characters.",
    };
  }

  return { name, email, password };
}

// ==========================================
// GUEST CONVERSATION MIGRATION
// ==========================================

async function claimUnassignedGuestMessages(
  dbSession,
  guestId,
  userId
) {
  // Only claim unassigned messages.
  // Never overwrite another registered user's ownership.
  await Message.updateMany(
    {
      guestId,
      userId: null,
    },
    {
      $set: { userId },
    },
    {
      session: dbSession,
    }
  );
}

// ==========================================
// REGISTER
// POST /api/auth/register
// ==========================================

router.post(
  "/register",
  verifyAllowedOrigin,
  async (req, res) => {
    noStore(res);

    const validated = validateRegistration(req.body || {});

    if (validated.error) {
      return res.status(400).json({
        error: validated.error,
      });
    }

    const { name, email, password } = validated;

    let dbSession;

    try {
      const passwordHash = await hashPassword(password);

      const rawToken = createAuthToken();

      const expiresAt = new Date(
        Date.now() + AUTH_SESSION_MAX_AGE_MS
      );

      dbSession = await mongoose.startSession();

      let createdUser;

      // Create the account, claim guest messages and create
      // the authentication session in one transaction.
      await dbSession.withTransaction(async () => {
        const existingUser = await User.findOne({
          email,
        })
          .select("_id")
          .session(dbSession)
          .lean();

        if (existingUser) {
          const error = new Error(
            "An account with this email already exists."
          );

          error.statusCode = 409;
          throw error;
        }

        const createdUsers = await User.create(
          [
            {
              name,
              email,
              passwordHash,
            },
          ],
          {
            session: dbSession,
          }
        );

        createdUser = createdUsers[0];

        // Revoke the current account session if the visitor
        // was already signed in and is registering another account.
        if (req.authSessionId) {
          await AuthSession.updateOne(
            {
              _id: req.authSessionId,
              revokedAt: null,
            },
            {
              $set: {
                revokedAt: new Date(),
              },
            },
            {
              session: dbSession,
            }
          );
        }

        await claimUnassignedGuestMessages(
          dbSession,
          req.guestId,
          createdUser._id
        );

        await AuthSession.create(
          [
            {
              userId: createdUser._id,
              tokenHash: hashAuthToken(rawToken),
              expiresAt,
            },
          ],
          {
            session: dbSession,
          }
        );
      });

      // Send the authentication cookie only after the
      // transaction successfully commits.
      setAuthCookie(res, rawToken);

      return res.status(201).json({
        success: true,
        user: publicUser(createdUser),
      });

    } catch (error) {
      if (
        error.code === 11000 ||
        error.statusCode === 409
      ) {
        return res.status(409).json({
          error:
            "An account with this email already exists.",
        });
      }

      console.error(
        "Registration error:",
        error.message
      );

      return res.status(500).json({
        error: "Registration failed. Please try again.",
      });

    } finally {
      if (dbSession) {
        await dbSession.endSession();
      }
    }
  }
);

// ==========================================
// LOGIN
// POST /api/auth/login
// ==========================================

router.post(
  "/login",
  verifyAllowedOrigin,
  async (req, res) => {
    noStore(res);

    const email = normalizeEmail(req.body?.email);

    const password =
      typeof req.body?.password === "string"
        ? req.body.password
        : "";

    if (
      !isValidEmail(email) ||
      !password ||
      password.length > 128
    ) {
      return res.status(400).json({
        error: "Enter a valid email and password.",
      });
    }

    try {
      const user = await User.findOne({
        email,
      }).select("+passwordHash");

      if (
        !user ||
        !(await verifyPassword(password, user.passwordHash))
      ) {
        return res.status(401).json({
          error: "Invalid email or password.",
        });
      }

      const rawToken = createAuthToken();

      const expiresAt = new Date(
        Date.now() + AUTH_SESSION_MAX_AGE_MS
      );

      const dbSession = await mongoose.startSession();

      try {
        await dbSession.withTransaction(async () => {
          // Revoke the previous session on this browser.
          if (req.authSessionId) {
            await AuthSession.updateOne(
              {
                _id: req.authSessionId,
                revokedAt: null,
              },
              {
                $set: {
                  revokedAt: new Date(),
                },
              },
              {
                session: dbSession,
              }
            );
          }

          // Create the new account session.
          await AuthSession.create(
            [
              {
                userId: user._id,
                tokenHash: hashAuthToken(rawToken),
                expiresAt,
              },
            ],
            {
              session: dbSession,
            }
          );

          // Claim unassigned conversations from this browser.
          await claimUnassignedGuestMessages(
            dbSession,
            req.guestId,
            user._id
          );
        });
      } finally {
        await dbSession.endSession();
      }

      setAuthCookie(res, rawToken);

      return res.json({
        success: true,
        user: publicUser(user),
      });

    } catch (error) {
      console.error("Login error:", error.message);

      return res.status(500).json({
        error: "Login failed. Please try again.",
      });
    }
  }
);

// ==========================================
// GET CURRENT ACCOUNT
// GET /api/auth/me
// ==========================================

router.get("/me", (req, res) => {
  noStore(res);

  if (!req.user) {
    return res.json({
      authenticated: false,
      user: null,
    });
  }

  return res.json({
    authenticated: true,
    user: publicUser(req.user),
  });
});

// ==========================================
// LOGOUT
// POST /api/auth/logout
// ==========================================

router.post(
  "/logout",
  verifyAllowedOrigin,
  async (req, res) => {
    noStore(res);

    try {
      if (req.authSessionId) {
        await AuthSession.updateOne(
          {
            _id: req.authSessionId,
            revokedAt: null,
          },
          {
            $set: {
              revokedAt: new Date(),
            },
          }
        );
      }

      clearAuthCookie(res);

      return res.json({
        success: true,
      });

    } catch (error) {
      console.error("Logout error:", error.message);

      clearAuthCookie(res);

      return res.status(500).json({
        error: "Could not complete logout. Please try again.",
      });
    }
  }
);

module.exports = router;