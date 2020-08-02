//Requirements
const catchAsync = require("../utilis/catchAsync")
const userModel = require("../models/userModel");
const authTool = require("../utilis/authTools")
const AppError = require("../utilis/AppError")
const sendEmail = require("../utilis/email")


exports.register = catchAsync(async (req, res, next) => {  
      const data = {
        email:req.body.email,
        username:req.body.username,
        password:req.body.password,
        passwordConfirmation:req.body.passwordConfirmation,
        img:req.body.img
                   }
     if (!data.email || !data.password) return next(new AppError("Please Enter an email and password"), 404)
     const user =  await userModel.create(data)
     const token = authTool.generateToken(user,res) //note This is bad practice as generateToken will only worked inside express (APP LAYER MUST BE INDEPENDET) 
      res.status(200).json({
            user,
            status:"sucess",
            token
        })

})

 exports.login = catchAsync(async (req, res, next) => {
      const data = {
         email:req.body.email,
         password:req.body.password
      };
      // Dont Pass a req or res properties through a service function so we make a data obj and passit then it is testable
      const user = await userModel.findOne({email:data.email});
       if (!user || !authTool.verifyPassword(data.password, user.password)) return next(new AppError("Please Enter a correct email and password", 404));
       const token = authTool.generateToken(user, res); //There is another gate wich checks 2FC  Delete that
         req.user = user;
         // next();
       res.status(202).json({
          status:"Sucess",
          message:"You Have Logined In",
          user
         
       })
 });

exports.isLoggedIn = catchAsync(async (req, res, next) => {
   const token =  req.cookies.jwt;
     
   if (await authTool.isBlacked(token)) return next();
   
   if (!token) return next();
   const tokenVeri = await authTool.tokenVerify(token);
   if (!tokenVeri) return next();
   const user = await userModel.findOne({_id: tokenVeri.id});
   if (!user)  return next();
   if (user.passwordUpdated) { 
   if (tokenVeri.iat * 1000 < user.passwordUpdatedAt) return next();
   }
   res.locals.user = user;
   req.user = user;
 
   return next();
});

exports.protectRoute = catchAsync(async (req, res, next) => {
   const token =  req.cookies.jwt;
   if (await authTool.isBlacked(token)) return next(new AppError("Please sign in again token expired", 404));
   if (!token) return next(new AppError("Please Sign In"), 404);
   const tokenVeri = await authTool.tokenVerify(token); 
   if (!tokenVeri) return next(new AppError("Please Sign In Again", 404) );
   const user = await userModel.findOne({_id: tokenVeri.id});
   if (!user) return next(new AppError("Please sign in again error token is invalid", 404))
   if (user.passwordUpdated) { 
   if (tokenVeri.iat * 1000 < user.passwordUpdatedAt) return next(new AppError("Please Sign In Again as your pw changed recently"), 404);
   }
   req.user = user;
   next();
});

//Route Must Be Protected
exports.restrictedTo = (...roles) => {

   return (req, res, next) => {
      const role = req.user.role;
      if (!req.user) return next(new AppError("Please Login To Join This Route As it has restrictions", 404));
      if (!roles.includes(role)) return next(new AppError("You are not authorized to enter that route", 404));
      next()

   }
}

exports.forgetPw = catchAsync(async (req, res, next) => {
   const email = req.body.email;
   const user = await userModel.findOne({email});
 
   if(!email || !user) return next(new AppError("Please enter a correct email adress", 404));
   const tokens = authTool.hashReset();
   user.passwordResetToken = tokens.hashedToken;
   user.passwordResetTokenExpire = Date.now() + 10 * 60 * 1000;
   user.save({validateBeforeSave:false})
    const result = await sendEmail({
   from: 'Local Host Service <admin@io.com>', // sender address
   to: email, // list of receivers
   subject: "Reset Token", // Subject line
   text: `To Reset Password Please Click On This Link ${req.protocol}://${req.hostname}:3000/resetPw/${tokens.plainToken} if you donot have idea about that message please ignore it and check ur account security stabilty`, // plain text body
    html: "<b>Reset Password?</b>", // html body
    });
   res.status(202).json({
      status:"Sucess",
      message:"Please check your mails"
   })


});

exports.resetPw = catchAsync(async (req, res, next) => {
    const {password, passwordConfirmation} = req.body;
    const passwordResetToken = req.params.token;
   const hashed =  authTool.hashReset(passwordResetToken);
    const user = await userModel.findOne({passwordResetToken:hashed.hashedToken, passwordResetTokenExpire: {$gt: Date.now()}}).select("+password")
    if (!password || !passwordConfirmation) return next(new AppError("Please enter your pw and pw confirmation", 404));
    
    if (!user) return next(new AppError("Please resend a pw reset token", 404))
    
    user.password = password;
    user.passwordConfirmation = passwordConfirmation;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpire = undefined;
    await user.save();
    authTool.generateToken(user, res);
   res.status(202).json({
      status:"Sucess",
      message:"Password Changed"
   })
})

exports.logout = catchAsync(async (req, res, next) => {
 
   if (!req.cookies.jwt) return next(new AppError("You already not logged in ", 403))
   authTool.blackListToken(req.cookies.jwt, res); //Bad Practice As passing response object
   res.status(202).json({
      status:"sucess",
      message:"you have logged out"
   })

});

// exports.multiFactorGate = catchAsync(async (req, res, next) => {
//         const user = req.user;
      
   
//     })
 /*
location.assign vs res.redirect
 */