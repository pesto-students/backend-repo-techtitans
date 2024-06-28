// mailerController.js
const transporter = require("../config/mailer.config");
const { EMAIL_SUB, ROLES } = require("../config/constants");
const bcrypt = require("bcryptjs");
const ejs = require("ejs");
const path = require("path");

function hashEmail(emailId) {
  return bcrypt.hashSync(emailId, 4);
}
// Function to send an email
const sendMail = (to, subject, html, text = "") => {
  const mailOptions = {
    from: "doc.checker.tt@gmail.com",
    to: to,
    subject: subject,
    text: text,
    html: html,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return reject(error);
      }
      resolve(info);
    });
  });
};

const sendEmailTemplate = (templateName, templateData, to, subject) => {
  const templatePath = path.join(
    __dirname,
    "../templates",
    `${templateName}.ejs`
  );
  console.log(templatePath);
  const mailOptions = {
    from: "doc.checker.tt@gmail.com",
    to: to,
    subject: subject,
  };

  ejs.renderFile(templatePath, templateData, (err, html) => {
    if (err) {
      console.error("Error rendering email template:", err);
      return;
    }
    mailOptions.html = html;
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  });
};

const sendCustomerSignUpEmail = (user) => {
  return new Promise((resolve, reject) => {
    sendMail(
      user.emailId,
      EMAIL_SUB.CUST_SIGNUP,
      "Welcome to DocChecker...!",
      "<p>This is a test email.</p>"
    )
      .then((info) => {
        console.log(info);

        resolve(user);
      })
      .catch((error) => reject(error));
  });
};

const sendOTP = (user) => {
  return new Promise((resolve, reject) => {
    sendMail(
      user.emailId,
      EMAIL_SUB.FOTGOT_PWD,
      "Welcome to DocChecker...!",
      "<p>This is a test email.</p>"
    )
      .then((info) => {
        console.log(info);

        resolve(user);
      })
      .catch((error) => reject(error));
  });
};

const sendEmailVerificationMail = (to, otp) => {
  const subject = EMAIL_SUB.VERIFY_EMAIL;
  // const text = `You requested a password reset. Use the following token to reset your password: ${otp}`;
  const html = `<div><p>Click on the below button to verify your email. </p><div><a href='http://localhost:8090/auth/verifyEmail/${to}/${hashEmail(
    otp
  )}'></a><div></div>`;

  return sendMail(to, subject, html);
};
const sendForgotPasswordEmail = (to, otp) => {
  const subject = EMAIL_SUB.FOTGOT_PWD;
  const text = `You requested a password reset. Use the following token to reset your password: ${otp}`;
  const html = `<p>You requested a password reset. Use the following token to reset your password: <strong>${otp}</strong></p>`;

  return sendMail(to, subject, html);
};

const sendSignUpMail = (user) => {
  const data = { username: user.username };

  return sendEmailTemplate(
    "signupSuccess",
    data,
    user.emailId,
    user.role === ROLES.CUSTOMER
      ? EMAIL_SUB.CUST_SIGNUP
      : EMAIL_SUB.EXPERT_SIGNUP
  );
};

const sendExpertActivationMail = (user) => {
  const data = { username: user.username, activationLink:
    "https://deploy-preview-1--deluxe-centaur-41dfe8.netlify.app/", };

  return sendEmailTemplate(
    "userActivation",
    data,
    user.emailId,
    EMAIL_SUB.USER_ACTIVATION
  );
};

const sendExpertRejectionMail = (user) => {
  const data = {
    username: user.username
  };

  return sendEmailTemplate(
    "userRejection",
    data,
    user.emailId,
    EMAIL_SUB.USER_REJECTION
  );
};

module.exports = {
  // sendCustomerSignUpEmail,
  sendForgotPasswordEmail,
  sendEmailVerificationMail,
  sendOTP,
  sendSignUpMail,
  sendExpertActivationMail,
  sendExpertRejectionMail,
};
