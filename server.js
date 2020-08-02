const express = require("express");
    
        //UNCAUGHT ERRORS THAT HAPPENS SYNCHRONUSLY
        process.on("uncaughtException", err => {
        err = errorHandler.displayErr(err);
        console.log(err);
        process.exit(1);      
    });
const pug = require("pug");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")
const dotenv = require("dotenv").config({path:"./config.env"});
const mongoose = require("mongoose");
const errorHandler = require("./utilis/errorHandler");
const passport = require("passport");
const app = express();
//Connecting To Database
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(v => {
    console.log("Connected To MongoDB....")
}).catch(err => {
    console.log(`Error Due To Connecting Database Made By Server ${err}`)
});

//End Connecting
//Requires 


//Routes
const viewRoute = require("./routes/viewRoute");
const userRoute = require("./routes/userRoute");
const postRoute = require("./routes/postRoute");
const commentRoute = require("./routes/commentRoute");

//End Requires


// Global Middlewares
app.use(express.static("./public"))
app.use(express.urlencoded({ extended: false })); //MUST TO PARSE REQ.BODY FROM FORMS
app.set("view engine", "pug");
app.set("views", "./view");
app.use(cookieParser())
app.use(bodyParser.json())
app.use(passport.initialize());
app.use(passport.session());


//End Middlewares
//Routes
app.use("/", viewRoute);
app.use("/api/v2/user", userRoute);
app.use("/api/v2/post", postRoute);
app.use("/api/v2/comment", commentRoute);


//
//End Routes

//Error Handling Section
app.use(errorHandler.handleErr)
  
    process.on("unhandledRejection", (err, promise) => {
           err = errorHandler.displayErr(err);
            console.log(err);
               server.close(_=> {
                 process.exit(1);
               })
              
    })

//End Error Handling Section
app.listen(3000, () => {
    console.log("Connected To Server...")
});

/*
ALSO DOCUMENTATION BY SWAGGERRRRRRRRRRRR
Make HANDLER FACTORY FOR  ALL RES.STATUS().JSON()
Email Verification (ama y3ml sign up ast5dm node mailer w ab3t w a3ml verify w a3ml expire lw m3ml4 verify yt4al mn databse)
*/