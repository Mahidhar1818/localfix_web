function roleCheck(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Access forbidden: requires one of the following roles: [${roles.join(', ')}]` 
      });
    }
    next();
  };
}

module.exports = roleCheck;
