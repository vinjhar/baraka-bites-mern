import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: String,
  name: String,

  email: { type: String, required: true, unique: true },
  password: { type: String }, 

  isVerified: { type: Boolean, default: false },
  verificationToken: String,

  recipesGenerated: { type: Number, default: 0 },
  recipesGeneratedResetAt: {type: Date, default: Date.now,},

  resetPasswordToken: String,
  resetPasswordExpires: Date,
  
  recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
  isPremium: { type: Boolean, default: false },

  stripeCustomerId: String,
  stripeSubscriptionId: String,
 
}, { timestamps: true });

export default mongoose.model('User', userSchema);
