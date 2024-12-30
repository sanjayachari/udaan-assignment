const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
  const token = req.cookies.token;  // Assuming you're storing the token in a cookie
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, 'san', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    req.user = decoded.user;  // Store the decoded user in the request object
    next();  // Proceed to the next middleware/route handler
  });
};

module.exports = verifyJWT;
