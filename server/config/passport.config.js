import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user.model.js';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/v1/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;

    // 1. Try finding user by Google ID
    let user = await User.findOne({ googleId: profile.id });

    // 2. If not found, check if user with the same email exists (from email/pass signup)
    if (!user) {
      user = await User.findOne({ email });

      if (user) {
        // If user exists with email, just add googleId to their account
        user.googleId = profile.id;
        user.isVerified = true;
        await user.save();
      } else {
        // 3. Create new user
        user = await User.create({
          googleId: profile.id,
          email,
          name: profile.displayName,
          isVerified: true
        });
      }
    }

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
