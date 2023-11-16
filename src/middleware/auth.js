const jwt = require('jsonwebtoken');
const secretKey = process.env.API_SECRET_KEY;
const expiresIn = '30 days';

// Middleware to check if a token is provided and valid
function authenticateToken(req, res, next) {
  const header = req.header('Authorization');
  const token = header.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Missing token' });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }

    req.user = user;
    next();
  });
}

// Create and sign a token with the provided payload
function generateToken(payload) {
  return jwt.sign(payload, secretKey, { expiresIn });
}

module.exports = {
  authenticateToken,
  generateToken,
};
