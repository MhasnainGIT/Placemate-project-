const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const role = req.userRole || req.user?.role || req.role; // flexible retrieval
      if (!role) {
        return res.status(403).json({ message: 'Role not provided', success: false });
      }
      if (!allowedRoles.includes(role)) {
        return res.status(403).json({ message: 'Forbidden: insufficient role', success: false });
      }
      next();
    } catch (err) {
      return res.status(403).json({ message: 'Forbidden', success: false });
    }
  };
};

export default requireRole;
