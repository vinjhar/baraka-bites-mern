import User from '../models/user.model.js';

export const checkSubscription = async (req, res, next) => {
  try{const user = await User.findById(req.user._id);

  if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

  const now = new Date();
  const lastReset = user.recipesGeneratedResetAt || now;
  const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

  if (lastReset < oneMonthAgo) {
      user.recipesGenerated = 0;
      user.recipesGeneratedResetAt = now;
      await user.save();
    }

  if (user.isPremium || user.recipesGenerated < 3) {
    return next();
  }

  return res.status(403).json({ message: 'Upgrade to premium to generate more recipes' });
}catch(error){
  console.error('[Subscription Check Error]', error);
    return res.status(500).json({ message: 'Internal server error' });
}
};
