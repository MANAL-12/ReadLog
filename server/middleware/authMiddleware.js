
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  try {
    // Read the token from the browser cookie
    const token = req.cookies.token;

    // Check whether a token exists
    if (!token) {
      return res.status(401).json({
        message: 'Not authorized. Please log in.',
      });
    }

    // Verify the token using our secret key
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Attach the user ID to the request
    req.user = {
      userId: decoded.userId,
    };

    // Continue to the requested route
    next();

  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or expired token. Please log in again.',
    });
  }
};

module.exports = protect;
