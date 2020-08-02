const handlerController = require("./handlerController");
const commentModel = require("../models/commentModel");
const postModel = require("../models/postModel");
const catchAsync = require("../utilis/catchAsync")
const AppError = require("../utilis/AppError");
exports.getComment = handlerController.getOne(commentModel);
exports.getComments = handlerController.getAll(commentModel);
exports.deleteComment = handlerController.deleteOne(commentModel);
exports.updateComment = handlerController.updateOne(commentModel);


exports.createComment = catchAsync(async (req, res, next) => {
 const user = req.user;
    const data = {
        text:req.body.text,
        author:{
            id:user._id,
            username:user.username
        }
    }
     
     if (data.text == "") return next(new AppError("Please enter a comment", 404)) 
    const postId = req.params.postId;
    if (!postId) return next(new AppError("Comment Must Belogns to a post", 404))
    const post = await postModel.findOne({_id:postId});
    if (!post) return next(new AppError("Post Is Not Found", 404));
    const comment = await commentModel.create(data)
      post.comments.push(comment._id);
   await post.save({validateBeforeSave:false});
   res.status(202).json({
            status:"sucess",
            message:"commented is added",
            comment
   })
});

exports.likeComment = catchAsync(async (req, res, next) => {
const user = req.user;
        const commentId = req.params.commentId;
        if (!commentId) return next(new AppError("Like Must Belongs to a post", 404));
        const comment =    await  commentModel.findOne({_id:commentId});
        if (!comment) return next(new AppError("comment is not found", 404));
        if (comment.likes.includes(user._id)) return next(new AppError("You already liked that post"), 403);
        comment.likes.push(user._id);
        await comment.save({validateBeforeSave:false});
        res.status(202).json({
            status:"Sucess",
            message:"Comment Is Liked"
        })

});

exports.dislikeComment = catchAsync(async (req, res, next) => {
         const user = req.user;
        const commentId = req.params.commentId;
        if (!commentId) return next(new AppError("Like Must Belongs to a comment", 404));
        const comment =    await  commentModel.findOneAndUpdate({_id:commentId}, {$pull : {likes : user._id}}, {new:true});
          res.status(202).json({
            status:"Sucess"
        })

});