module.exports = function(requiredRole) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const User = require('../models/User');
    User.findById(req.user).then(user => {
      if (!user) return res.status(401).json({ error: 'User not found' });
      if (user.role !== requiredRole) {
        return res.status(403).json({ error: 'Forbidden: insufficient role' });
      }
      next();
    }).catch(() => res.status(500).json({ error: 'Server error' }));
  };
};
