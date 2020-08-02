const mongoose = require("mongoose");
const authTool = require("../utilis/authTools")
const validator = require("validator")
const Schema = mongoose.Schema;
const schema = new Schema({
    email :{
        unique:true,
        type:String,
        required:[true, "You Must Enter an email address"],
        trim:true,
        lowercase:true,
        validate:{
            validator:validator.isEmail, 
            message:"Please Enter a valid email address"
          }

    },    username : {
            type:String,
            required:[true ,"You Must Enter a username"],
            unique:true,
            lowercase:true,
            trim:true
    }, 

    password: {
        type:String,
        required:[true ,"You Must Enter a password"],
        minlength:7
    },

    passwordConfirmation : {
        type:String,
        required:[true ,"You Must Enter a password"],
        minlength:7,
        validate:{
        validator:function(v) {
            return v == this.password
        },
        message:"Password and password confirmation doesnot match"
        }
    
    },
    img:{
        type:String,
        default:"default.png"
    },
    role:{
        type:String,
        enum:["admin", "user"],
        default:"user"
    },
    passwordUpdated:Boolean,
    passwordUpdatedAt: {
        type:Date
    },
    passwordResetToken:String,
    passwordResetTokenExpire:Date,
    multiFactorAuth:{
        type:Boolean,
        default:false
    },
    tempsecret2FC:{
        type:String
    },
    secret2FC: {
        type:String
    },
    bio:{
        type:String
    },
    gender:{
        type:String,
        lowercase:true,
        enum:["male", "female"]
    },
    googleId:String,
    //Social Media Section
    
    followers:[{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    }],
    following:[{
        type:mongoose.Schema.ObjectId,
        ref:"User"

    }],

    post:[{
    type:mongoose.Schema.ObjectId,
        ref:"Post"
    }]


}); 

schema.pre("save", function (next) {
    
    if (!this.isModified("password") || this.isNew) return next();
    this.passwordUpdatedAt = Date.now();
    this.passwordUpdated = true;
    next()
});
schema.pre("save", authTool.hashPassword)
const userModel = mongoose.model("User", schema);

     

module.exports = userModel;