const express = require("express");
const router = express.Router();
//Requirments
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const multiFactorAuth = require("../controllers/multiFactorAuth");
const oauthController = require("../controllers/oauthController");

 
 //Simple And Basic Authentication
 router
 .post("/signup", authController.register)
 .post("/login", authController.login) //, multiFactorAuth.verify2FCGate
 .post("/logout", authController.protectRoute, authController.logout)
 .post("/forgetpw", authController.forgetPw)
 .post("/resetPw/:token", authController.resetPw)
 .patch("/update", authController.protectRoute, (req, res, next) => {
    userController.upload(req, res, (err) => {
        
        if(err) return next(err);
        next()
    })
 }, userController.resizePhoto, userController.updateInfo);
    // MultiFactor Authentication
router.get("/2fc/enable", authController.protectRoute, multiFactorAuth.enable);
router.get("/2fc/disable", authController.protectRoute, multiFactorAuth.disable);
router.post("/2fc/verify",  multiFactorAuth.verify2FCGate); //authController.protectRoute,
//router.post("/2fc/verifygate", multiFactorAuth.verifygate); //authController.protectRoute, 

    //Passport and OAUTH Authentication Using Google API
router.get("/auth/google", oauthController.firstAuth);
router.get("/auth/google/redirect", oauthController.finalAuth, oauthController.generateToken)

        //Social Routes 
router.post("/follow/:username", authController.protectRoute, userController.followUser);

module.exports = router;