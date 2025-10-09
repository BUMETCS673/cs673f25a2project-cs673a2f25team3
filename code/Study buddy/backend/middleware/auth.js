const jwt = require("jsonwebtoken");

/**
 * Middleware to authenticate requests using JWT.
 * - Looks for a Bearer token in the "Authorization" header.
 * - Verifies the token using the secret stored in environment variables.
 * - If valid, attaches the user payload to req.user and calls next().
 * - If invalid or missing, responds with HTTP 401 (Unauthorized).
 */
function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, username: payload.username };
    next();
  } catch (e) {
    return res.status(401).json({ error: "Token invalid or expired" });
  }
}
module.exports = auth;