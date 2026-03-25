import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import userModel from '../models/user.model.js';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.NODE_ENV === 'production' 
        ? "https://convode.onrender.com/users/google/callback" 
        : "http://localhost:3000/users/google/callback",
    passReqToCallback: true

  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
        // Find the user by email
        let user = await userModel.findOne({ email: profile.emails[0].value });

        if (!user) {
            // NEW: Create user with username from Google Profile
            user = await userModel.create({
                email: profile.emails[0].value,
                googleId: profile.id,
                username: profile.displayName // Google's full name (e.g., "Priyanka Patel")
            });
        } else {
            // If user exists but doesn't have a googleId or username, update them
            let updated = false;
            if (!user.googleId) {
                user.googleId = profile.id;
                updated = true;
            }
            if (!user.username) {
                user.username = profile.displayName;
                updated = true;
            }
            
            if (updated) await user.save();
        }

        return done(null, user);
    } catch (err) {
        console.error("Google Auth Error:", err);
        return done(err, null);
    }
}));

export default passport;