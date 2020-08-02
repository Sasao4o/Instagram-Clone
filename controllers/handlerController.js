const catchAsync = require("../utilis/catchAsync");
const AppError = require("../utilis/AppError");
const ApiFeatures = require("../utilis/ApiFeatures");
const authTool = require("../utilis/authTools");
filterObj = (obj, ...allowed) => {
  let filterdObj = {...obj};
  const objKeys = Object.keys(filterdObj);
  objKeys.forEach(v => {
    if (!allowed.includes(v)) {
      delete filterdObj[v];
    }
  })
    return filterdObj;
}
 

exports.createOne = (Model) => {
  return catchAsync(async (req, res, next) => {
  //VIIIII
  // const modelName = Model.collection.collectionName
  
  
  if (Model.collection.collectionName == "posts") {  
    let data;
    let filename = undefined
  if (req.file) {
     filename = req.file.filename;
  }
  
   data = await Model.create({
    description:req.body.description,
    author:{
      id:req.user._id,
      username:req.user.username
      },
      img:filename
  });
  req.user.post.push(data);
   await req.user.save({validateBeforeSave:false});
    
} else {
   data = await Model.create(req.body);
}
  res.status(202).json({
    status:"Sucess",
    data

  });
});
}
exports.getAll = Model => {
return catchAsync(async (req, res, next) => {
 
 
const data = new ApiFeatures(Model.find({}), req.query).filter().sort().paginate().field();
if (Model.collection.collectionName == "posts") {  
const result = await data.query.sort({timePosted:-1});
} else if (Model.collection.collectionName = "comments") {
const result = await data.query.sort({commentedTime:-1});
} else {
  const result = await data.query;
}
  
//Res.stauts(204) L Process sucess bs No JSON TO BE SENT TO THE CLIENT (NOT VERY GOOD HERE);
res.status(202).json({
  status:"sucess",
  result
})

});
}
exports.deleteOne = Model => {
  return catchAsync(async (req, res, next) => {
      console.log(req.user.username)
      const data = await Model.findOneAndDelete({_id:req.params.id, "author.username":req.user.username});

      console.log(data);
      if (!data) return next(new AppError("Please Enter a Valid data Id", 404))
      res.status(202).json({
        status:"Sucess",
        message:"data has been deleted"
      });
  });

}
exports.getOne = Model => {
  return catchAsync(async (req, res, next) => {
      const data = await Model.findById(req.params.id);
      if (!data) return next(new AppError("Please Enter a Valid data Id", 404))
      res.status(202).json({
        status:"Sucess",

        data
      });
  });

}

exports.updateOne = Model => {
  return catchAsync(async (req, res, next) => {
    const _id = req.params.id;
    const body = filterObj(req.body, "text", "description", "img", "bio", "gender")
    const data = await Model.findOneAndUpdate({_id}, body, {new: true});
   
 
    if (!data) return next(new AppError("Error finding your id check id provided", 403))
   
    res.status(202).json({
        status:"sucess",
        data
    })

});
}

 

 

exports.filterObj = filterObj