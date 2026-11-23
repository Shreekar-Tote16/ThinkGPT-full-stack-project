//C:\Users\user\ThinkGPT\backend\middleware\guestSession.js
const crypto = require("crypto");

const COOKIE_NAME = "thinkgpt_guest";
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days

function signGuestId(guestId, secret) {
  return crypto
    .createHmac("sha256", secret)
    .update(guestId)
    .digest("hex");
}

function safeEqual(a, b) {
  const first = Buffer.from(a);
  const second = Buffer.from(b);

  return (
    first.length === second.length &&
    crypto.timingSafeEqual(first, second)
  );
}

function readCookie(req, name) {
  const cookies = (req.headers.cookie || "").split(";");

  for (const item of cookies) {
    const index = item.indexOf("=");

    if (index === -1) continue;

    const key = item.slice(0, index).trim();
    const value = item.slice(index + 1).trim();

    if (key === name) return value;
  }

  return null;
}

function guestSessionMiddleware(req, res, next) {
  const secret = process.env.GUEST_SESSION_SECRET;

  if (!secret || Buffer.byteLength(secret) < 32) {
    return res.status(500).json({
      error: "Guest session security is not configured."
    });
  }

  const cookie = readCookie(req, COOKIE_NAME);
  let guestId = null;

  if (cookie) {
    const [storedId, storedSignature] = cookie.split(".");

    if (
      storedId &&
      storedSignature &&
      /^[a-f0-9]{64}$/i.test(storedId) &&
      /^[a-f0-9]{64}$/i.test(storedSignature)
    ) {
      const expectedSignature = signGuestId(storedId, secret);

      if (safeEqual(storedSignature, expectedSignature)) {
        guestId = storedId;
      }
    }
  }

  // Create a new identity if the cookie is missing or invalid.
  if (!guestId) {
    guestId = crypto.randomBytes(32).toString("hex");

    const signature = signGuestId(guestId, secret);
    const cookieValue = `${guestId}.${signature}`;

    const secure =
      process.env.NODE_ENV === "production" ? "; Secure" : "";

    res.append(
      "Set-Cookie",
      `${COOKIE_NAME}=${cookieValue}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}${secure}`
    );
  }

  // This value comes only from the validated server-side signature.
  req.guestId = guestId;

  // Never allow private guest data to be cached.
  res.setHeader("Cache-Control", "no-store");

  next();
}

module.exports = { guestSessionMiddleware };
