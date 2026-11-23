const crypto = require("node:crypto");
const AuthSession = require("../models/AuthSession");

const AUTH_COOKIE_NAME = "thinkgpt_auth";

const AUTH_SESSION_MAX_AGE_MS =
  30 * 24 * 60 * 60 * 1000;

const AUTH_SESSION_MAX_AGE_SECONDS =
  Math.floor(AUTH_SESSION_MAX_AGE_MS / 1000);

// Read cookies without requiring cookie-parser.
function readCookie(req, name) {
  const cookieHeader = req.headers.cookie || "";

  for (const part of cookieHeader.split(";")) {
    const separator = part.indexOf("=");

    if (separator < 0) continue;

    const key = part.slice(0, separator).trim();

    if (key === name) {
      return part.slice(separator + 1).trim();
    }
  }

  return null;
}

// Generate a cryptographically secure random token.
function createAuthToken() {
  return crypto.randomBytes(32).toString("base64url");
}

// Store only the SHA-256 hash in MongoDB.
function hashAuthToken(token) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

// Cookie configuration.
function cookieOptions() {
  const secure =
    process.env.NODE_ENV === "production"
      ? "; Secure"
      : "";

  return `Path=/; HttpOnly; SameSite=Lax${secure}`;
}

// Append instead of replacing Set-Cookie.
// This preserves the existing thinkgpt_guest cookie.
function setAuthCookie(res, token) {
  res.append(
    "Set-Cookie",
    `${AUTH_COOKIE_NAME}=${token}; ${cookieOptions()}; Max-Age=${AUTH_SESSION_MAX_AGE_SECONDS}`
  );
}

// Clear the authentication cookie on logout.
function clearAuthCookie(res) {
  res.append(
    "Set-Cookie",
    `${AUTH_COOKIE_NAME}=; ${cookieOptions()}; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
  );
}

// Attach the authenticated account to the request if
// a valid, unexpired authentication session exists.
async function optionalAuthMiddleware(req, res, next) {
  req.user = null;
  req.authSessionId = null;

  const token = readCookie(req, AUTH_COOKIE_NAME);

  if (
    !token ||
    !/^[A-Za-z0-9_-]{40,60}$/.test(token)
  ) {
    return next();
  }

  try {
    const tokenHash = hashAuthToken(token);

    const authSession = await AuthSession.findOne({
      tokenHash,
      expiresAt: { $gt: new Date() },
      revokedAt: null,
    }).populate({
      path: "userId",
      select: "name email createdAt",
    });

    if (authSession && authSession.userId) {
      req.user = authSession.userId;
      req.authSessionId = authSession._id;
    }

    return next();
  } catch (error) {
    return next(error);
  }
}

// Protect endpoints that require a registered account.
function requireAuthMiddleware(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      error: "Authentication required.",
      code: "AUTH_REQUIRED",
    });
  }

  return next();
}

module.exports = {
  AUTH_COOKIE_NAME,
  AUTH_SESSION_MAX_AGE_MS,
  createAuthToken,
  hashAuthToken,
  setAuthCookie,
  clearAuthCookie,
  optionalAuthMiddleware,
  requireAuthMiddleware,
};