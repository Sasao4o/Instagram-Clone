const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const schema = new Schema({
    author:{
        id : {
        type:mongoose.Schema.ObjectId,
        required:["true", "Post Must Have an Author"]
        },
        username:String
    },
    img:{
    type: String,
    required:[true, "Please Upload your image correctly"]
    },
    description:{
        type:String
    },
    avatarImg:String,
    timePosted: {
        type:Date,
        default:Date.now()
    },
    comments:[{
        type:mongoose.Schema.ObjectId,
        ref:"Comment"
    }],
    likes:[{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    }]


});


const postModel = mongoose.model("Post", schema);


// postModel.aggregate([
//         {
//             $lookup: {
//                 from:"users",
//                 localField:"author.id",
//                 foreignField:"_id",
//                 as:"test"
//             }
//         }
//     ]).then(v => {
//         console.log(v);
//     })
    
    module.exports = postModel;