import User from '../models/user.model.js';

export const checkSubscription = async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (user.isPremium || user.recipesGenerated < 3) {
    return next();
  }

  return res.status(403).json({ message: 'Upgrade to premium to generate more recipes' });
};
