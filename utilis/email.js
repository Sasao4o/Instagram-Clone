// const nodemailer = require("nodemailer");
// const sendEmail =   options => {
// const transporter = nodemailer.createTransport({
//     host: "smtp.mailtrap.io",
//     port: 25,
//     auth: {
//       user: process.env.NODEMAILER_USER, // generated ethereal user
//       pass: process.env.NODEMAILER_PASSWORD, // generated ethereal password
//     }
//   });

// transporter.sendMail(options);
// return "Done"
// }


// module.exports = sendEmail;


const nodemailer = require("nodemailer");
const sendEmail = options => {
const transporter =  nodemailer.createTransport({
  host:"smtp.mailtrap.io",
  port:2525,
  // service:"gmail",
  auth:{
    user:"990264fa52f2c4",
    pass:"d2841d722a901b"

  }
});



 transporter.sendMail(options);
return "Done";
}
module.exports = sendEmail;
