const mongoose = require("mongoose");

let commentSchema = new mongoose.Schema({
  text: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  commentedTime:{
    type:Date,
    default:Date.now()
  },
  likes:[{
  type:mongoose.Schema.ObjectId
  }]
});

module.exports = mongoose.model("Comment", commentSchema);
