const userModel = require("../models/userModel");
const oauthTool = require("./authTools");
const passport =  require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:"http://localhost:3000/api/v2/user/auth/google/redirect"

}, async (accessToken, refreshToken, profile, done) =>  {
    try { 
    const user = await userModel.findOne({googleId:profile.id});
    if (!user) {
        await userModel.collection.insert({googleId:profile.id, email:profile._json.email, username:profile.displayName})
    }
    done(null, user)
     }
    catch(err) {
        done(err, null);
    }
}))

 passport.serializeUser((user, done) => {
  
    done(null, user);

});