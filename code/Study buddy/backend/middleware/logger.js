/**
 * Simple request logger middleware.
 *
 * Logs the HTTP method and requested URL for each incoming request.
 * Useful for debugging and monitoring requests during development.
 *
 * @param {object} req - The Express request object
 * @param {object} res - The Express response object
 * @param {function} next - Callback to pass control to the next middleware
 */

function logger(req, res, next) {
  console.log(`${req.method} ${req.url}`);
  next();
}
module.exports = logger;
