export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin === true) {
    return next();
  }
  return res.status(403).json({ error: 'Access denied: Admins only.' });
};
