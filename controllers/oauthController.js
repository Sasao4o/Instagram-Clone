const passport = require("passport");
const googleoauth = require("../utilis/googleoauth.js");
const oauthTool = require("../utilis/authTools");
exports.firstAuth = passport.authenticate('google', { scope: ['profile', "email"] });
exports.finalAuth = passport.authenticate('google', { failureRedirect: '/login' });
exports.generateToken = (req, res, next) => {
    const user = req.user
    oauthTool.generateToken(user, res); 
//Bad Practice (If iwanna generate token in a place not handling with http req would be problem can fix this by if (res) also not good pract)
    return res.redirect("/home")
}