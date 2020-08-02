const express = require("express");
const authController = require("../controllers/authController");
const postController = require("../controllers/postController");
//Very Bad Practice as VIEW shouldnot communicate with MODEL but CONTROLLER
 const userModel = require("../models/userModel");
 const postModel = require("../models/postModel");

 //End Bad Practice
const authTool = require("../utilis/authTools")
const AppError = require("../utilis/AppError");
const QRCode = require("qrcode");
// const userModel = require("../models/userModel");
const router = express.Router();
 
router.use(authController.isLoggedIn);
router.get("/", (req, res, next) => {
    if (req.user) return res.redirect("/home");
    res.render("index");
})
//A Social Media Concern
router.get("/home", async (req, res, next) => {
    const posts = await postController.getMyPosts(req.user);
   console.log(posts)
    res.render("feed",
        {
            posts
        }
    );
})

router.get("/profile", async (req, res, next) => {
    if (!req.user) return res.redirect("/");
    const myPosts = await userModel.findOne({_id:req.user._id}).populate("post");
   
    res.render("profile", {
        posts:myPosts.post
    });
})
router.get("/logout", (req, res, next) => {
    res.render("logout")
});

router.get("/forgetpassword", (req, res, next) => {
    res.render("forget");
})

router.get("/resetPw/:token", async (req, res, next) => {
  const passwordResetToken = req.params.token;
  const hashed =  authTool.hashReset(passwordResetToken);
//Bad Practice (VIEW SHOULDNT DEAL WITH MODELS)  
//   const user = await userModel.findOne({passwordResetToken:hashed.hashedToken, passwordResetTokenExpire: {$gt: Date.now()}}).select("+password")
        
//     if (!user) return res.redirect("/");

    return res.render("reset", {
        token:hashed.plainToken
        })

});

router.get("/signup", (req, res, next) => {
    res.render("signup");
});

router.get("/enable2fc",  (req, res, next) => {
     res.render("enable2fc");
        
 });
    
    router.get("/verify2fc",  (req, res, next) => {
    const userSecret = res.locals.user.tempsecret2FC;
    if (!userSecret) res.render("feed");
    const tempsecretoauth= `otpauth://totp/SecretKey?secret=${userSecret}`;
   QRCode.toDataURL(tempsecretoauth, function(err, data_url) {
    if(err) return next(new AppError("Error In QR CODE RENDERING", 403));
    
    res.render("2fc", {
        imgsrc: data_url
        });
        
 });

});

router.get("/multifactorgate", async (req, res, next) => {
        //Query Options IS tHE BEst Way To Transfer data across 2 different routes (STACKOVERFLOW REF);
        const username = req.query.username;
        //Bad Practice
        const user = await userModel.findOne({username});
        if (user.multiFactorAuth == false) return res.render("feed");
     const secret= `otpauth://totp/SecretKey?secret=${user.secret2FC}`;
     
           QRCode.toDataURL(secret, function(err, data_url) {
    if(err) return next(new AppError("Error In QR CODE RENDERING", 403));
                res.render("2fc", {
                 imgsrc: data_url,
                 user 
                });
        
            });
    });



router.get("/editprofile", (req, res, next) => {

    res.render("editprofile");
})

router.get("/auth/google", (req, res, next) => {
    res.render("oauth");
})


//Social Media Concerns

 
module.exports = router;