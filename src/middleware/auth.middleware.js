const { verifyToken } = require('../utils/jwt.utils');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token || (req.header('Authorization') && req.header('Authorization').replace('Bearer ', ''));
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = verifyToken(token);

    // Check if user exists and session matches
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (user.currentSessionId !== decoded.sessionId) {
      return res.status(401).json({ message: 'Session invalid. Please log in again.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized' });
  }
};

module.exports = { protect };
