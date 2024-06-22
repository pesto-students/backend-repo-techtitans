const nodemailer = require("nodemailer");

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
//   pool: true,
  host: "smtp.gmail.com",
  port: 465, //587,
  secure: true, // upgrade later with STARTTLS
//   service: "Gmail",
  auth: {
    user: process.env.MAILER_EMAIL,
    pass: process.env.MAILER_PWD,
  },
//   tls: {
//     // do not fail on invalid certs
//     rejectUnauthorized: false,
//   },
});

transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

module.exports = transporter;
