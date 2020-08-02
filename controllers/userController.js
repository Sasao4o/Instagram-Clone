const catchAsync = require("../utilis/catchAsync");
const userModel = require("../models/userModel");
const AppError = require("../utilis/AppError");
const handlerController = require("./handlerController");
                        //Multer Configuration
const multer = require("multer");
const sharp = require("sharp");
const path = require('path');
  // Multer Configuration 
  function checkFileType(file, cb){

  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}
    // const storage = multer.diskStorage({
    //     destination:path.resolve(path.dirname(require.main.filename), "./public/images"),
    //     filename:function (req, file, cb) { 
    //     //Mutates filename property in req.file
    //     console.log(file);
    //     cb(null, file.fieldname +  "" + Date.now() + path.extname(file.originalname) );
    //     }
    // });
    const multerStorage = multer.memoryStorage();
    const upload = multer({
        storage: multerStorage,
        fileFilter: (req, file, cb) => {
        checkFileType(file, cb)

        }
    }).single("img");
    exports.upload = upload //Mutates REQ.FILE IF UPLOAD DONE

   exports.resizePhoto = catchAsync(async (req, res, next) => {
            if (!req.file) return next();
            req.file.filename = req.user.username +  "" + Date.now() + path.extname(req.file.originalname)
            //Fekrt l memoryStorage ank 7ttha 3l memory w b3d request btro7 w 7attha ka buffer w sharp byege tt7km fl image w t3mlha save 3ndk w b3den mn 3ndh htzhr 3l dom tb3n
            await sharp(req.file.buffer)
            .resize(150, 150)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(path.resolve(path.dirname(require.main.filename), "./public/images/users", req.file.filename));
        next();
    });

    exports.resizePostPhoto = catchAsync(async (req, res, next) => {
        if (!req.file) return next();
        req.file.filename = req.user._id + "" + Date.now() + path.extname(req.file.originalname);
          await sharp(req.file.buffer)
            .resize(500, 500)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(path.resolve(path.dirname(require.main.filename), "./public/images/", req.file.filename));
            next();
    })
 
                        //ENd Multer

exports.updateInfo = catchAsync(async (req, res, next) => { 
    if (req.file) req.body.img = req.file.filename;
     const body = handlerController.filterObj(req.body, "img", "gender", "bio");
    const data = await userModel.findOneAndUpdate({_id:req.user._id}, body, {new: true});
    if (!data) return next(new AppError("Error finding your id check id provided", 403))
   
    res.status(202).json({
        status:"sucess",
        data
    })

});

exports.followUser = catchAsync(async (req, res, next) => {
    const name = req.params.username;
    const user = await userModel.findOne({username:name.toLowerCase()});
    if (name == req.user.username) return next(new AppError("This Page is not available right now", 404))
    if (!user) return next(new AppError("Please Enter a Correct username", 404))
    if (user.following.includes(req.user.id)) return next(new AppError("You Are Already Following That User", 400));
    user.followers.push(req.user.id);
    req.user.following.push(user._id);
    req.user.save({validateBeforeSave:false})
    user.save({validateBeforeSave:false});
    //  const data = await userModel.find({name}).populate("followers");
    res.status(202).json({
        status:"Sucess",
        message:"You Have Followed The Following User"
    })
});

