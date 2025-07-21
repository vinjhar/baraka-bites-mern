export const permission = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized: No user logged in.' });
  }

  if (req.user.isAdmin === true || req.user.isModerator === true) {
    return next();
  }

  return res.status(403).json({ error: 'Access denied: Admins only.' });
};
