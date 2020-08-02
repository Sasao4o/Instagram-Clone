const handlerController = require("./handlerController");
const postModel = require("../models/postModel");
const catchAsync = require("../utilis/catchAsync");
const AppError = require("../utilis/AppError");
const userModel = require("../models/userModel");
exports.createPost = handlerController.createOne(postModel);
exports.getPost = handlerController.getOne(postModel);
exports.getPosts = handlerController.getAll(postModel);
exports.deletePost = handlerController.deleteOne(postModel);
exports.updatePost = handlerController.updateOne(postModel);

exports.getMyPosts = async (activeUser) => {
       
        
        const posts = await userModel.aggregate([{
                $match: {
                _id: activeUser._id
                }
                },

                {
                $lookup: {
                from: "users",
                localField: "following",
                foreignField: "_id",
                as: "followings"
                }
                },
                {
                $project: {
                followings: 1,
                _id: -1
                }
                },
                {
                $unwind: "$followings"
                },
                {
                $unwind: "$followings.post"
                },
                {
                $group: {
                _id: "",
                posts: {
                $push: "$followings.post"
                }
                }
                },
                {
                $unwind: "$posts"
                },
                {
                $lookup: {

                from: "posts",
                localField: "posts",
                foreignField: "_id",
                as: "post"

                }
                },
                {
                $unwind: "$post"
                },
                {
                $sort: {
                "post.timePosted": -1
                }
                },
                {
                $project:{
                "post":1,
                "_id":0
                }
                },
                {
                $lookup:{
                 from:"comments",
                 localField:"post.comments",
                 foreignField:"_id",
                 as:"userComments"
                }
                }
                

                ]);
              
        return posts
      
};      


exports.likePost = catchAsync(async (req, res, next) => {
        const user = req.user;
        const postId = req.params.postId;
        if (!postId) return next(new AppError("Like Must Belongs to a post", 404));
        const post =    await  postModel.findOne({_id:postId});
        if (!post) return next(new AppError("Post is not found", 404));
        if (post.likes.includes(user._id)) return next(new AppError("You already liked that post"), 403);
        post.likes.push(user._id);
        await post.save({validateBeforeSave:false});
        res.status(202).json({
            status:"Sucess",
            message:"Post Is Liked"
        })
});

//Dislike Implementation 
exports.dislikePost = catchAsync(async (req, res, next) => {
        const user = req.user;
        const postId = req.params.postId;
        if (!postId) return next(new AppError("Like Must Belongs to a post", 404));
        const post =    await  postModel.findOneAndUpdate({_id:postId}, {$pull : {likes : user._id}}, {new:true});

          res.status(202).json({
            status:"Sucess"
        })
});

        // Bad Practice as i will use find every time in foreach in UI wich is much expensive without indexes 
// exports.isLiked = catchAsync(async (req, res, next) => {
//         const postId = req.params.postId;
//         const post =    await  postModel.findOne({_id:postId});
//         if (!post) return next(new AppError("Post is not found", 404));
//        post.likes.includes(user._id) 
// });