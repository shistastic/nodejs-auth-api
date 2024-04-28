const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  // Get the authorization header (containing the token)
  const authHeader = req.headers['authorization'];
  // Check if the token is present
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    return res.sendStatus(401); // Unauthorized if no token is found
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(401); // Forbidden if token is invalid
    }
    req.user = user; // Store the user object in the request for further use
    next(); // Call the next middleware or route handler
  });
}

module.exports = authenticateToken;