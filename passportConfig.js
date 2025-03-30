const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("./models/userSchema"); // Import your Mongoose User model


passport.use(
  new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
    try {
      // ✅ Step 1: Find the user by email
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return done(null, false, { message: "User not found" });
      }

      // ✅ Step 2: Compare passwords using bcrypt
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: "Incorrect password" });
      }
      bcrypt.compare(password, user.password).then(console.log); // Should return `true` if correct

      // ✅ Step 3: If passwords match, return user
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);


// 🔄 Serialize & Deserialize User
passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
