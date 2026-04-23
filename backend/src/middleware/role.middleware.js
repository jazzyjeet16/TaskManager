// src/middleware/role.middleware.js

// Factory function — call with one or more allowed roles
// Usage: authorize('admin') or authorize('admin', 'user')
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated.' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Requires role: [${roles.join(', ')}].`,
      });
    }
    next();
  };
};

module.exports = authorize;
