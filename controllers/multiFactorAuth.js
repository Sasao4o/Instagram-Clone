const speakeasy = require('speakeasy');
const userModel = require("../models/userModel");
const catchAsync = require("../utilis/catchAsync")
var QRCode = require('qrcode');
const AppError = require('../utilis/AppError');
const authTool = require("../utilis/authTools")
    //Installation
exports.enable = catchAsync(async (req, res, next) => {
    if (req.user.multiFactorAuth) return next(new AppError("Multifactor Auth is already enabled", 403));
const secret = speakeasy.generateSecret();
const tempSecret = secret.base32;
const user = await userModel.findByIdAndUpdate(req.user._id, {tempsecret2FC: tempSecret}, {upsert:true});
res.status(202).json({
    status:"sucess",
    message:"Please Verify Your Secret"
})
    //Expiration Set For TempSecret
})

exports.verify = catchAsync(async (req, res, next) => {
    //Prevent Be Accessed From Any Where
const result = speakeasy.totp.verify({
    secret:req.user.tempsecret2FC,
    encoding:"base32",
    token:req.body.token
});
    if (!result) return next(new AppError("Please Enter a correct token", 403)); 
    const user = await userModel.findOne({_id:req.user._id});
    if (!user) return next(new AppError("Please Login Again", 403));
    user.secret2FC = user.tempsecret2FC;
    user.tempsecret2FC = undefined;
    user.multiFactorAuth = true;
    await user.save({validateBeforeSave:false});
    // authTool.generateToken(user, res)
    res.status(202).json({
        status:"sucess",
        message:"Multifactor authentication is enabled (QR CODE VERIFICATION)"
    })
});



exports.disable = catchAsync(async (req, res, next) => {
    const user = req.user;
    user.secret2FC = undefined;
    user.multiFactorAuth = false;
    await user.save({validateBeforeSave});
    res.status(202).json({
        status:"sucess",
        message:"Multifactor Authentication is disabled"
    })
});
 
 



  exports.verify2FCGate = catchAsync(async (req, res, next) => {
        
        const username = req.query.username;
        if(!username) return next(new AppError("Please try to login again 2fc error", 404))
        const user = await userModel.findOne({username});
        
   //Prevent Be Accessed From Any Where
  if (user.multiFactorAuth == false) {
         return authTool.generateToken(req.user ,res);
    }
 const result = speakeasy.totp.verify({
     secret:user.secret2FC,
     encoding:"base32",
     token:req.body.token
 });
   
     if (!result) return next(new AppError("Please Enter a correct token", 403)); 
     authTool.generateToken(user, res)
     res.status(202).json({
         status:"sucess",
         message:"Logged in"
     })
 });

 
