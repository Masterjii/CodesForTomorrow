const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
      // If no user is attached, then something went wrong with authentication
      if (!req.user) {
        return res.status(401).json({ message: "Not authorized, no user found" });
      }
  
      // Check if the user's role is in the allowedRoles array
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: "Forbidden: You do not have sufficient permissions" });
      }
      
      // User is authorized
      next();
    };
  };
  
  module.exports = { authorizeRoles };
  