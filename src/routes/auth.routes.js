// const { verifySignUp } = require("../middlewares");
const User = require('../controllers/users.controller');
const ConsantsCtrl = require('../controllers/constants.controller');
const { verifyToken } = require('../middlewares/authJwt');
const { validateBodyParams } = require('../middlewares').jsonValidator;
const { checkDuplicateUsernameOrEmail, checkDuplicateUsername } = require('../middlewares').verifySignUp;
const { user, loginSchema, moderator, forgotPassword, OTP, Password } = require('../jsonSchema').user;

module.exports = function (app) {
  // app.post("/api/auth/signup", User.create);

  app.post("/api/auth/signup", [validateBodyParams(user), checkDuplicateUsernameOrEmail], User.signUp);

  app.post("/api/auth/expert/signup", [validateBodyParams(moderator), checkDuplicateUsernameOrEmail], User.expertSignUp);

  app.post("/api/auth/login", validateBodyParams(loginSchema), User.login);

  app.get("/api/auth/signout", [verifyToken], User.signOut);

  app.get("/api/domains", ConsantsCtrl.docTypes);
  
  app.get("/api/industries", ConsantsCtrl.industries);

  app.post("/api/auth/forgotPassword", validateBodyParams(forgotPassword), User.forgotPassword)
  
  app.post("/api/auth/verifyOTP", validateBodyParams(OTP), User.verifyOTP)

  app.post("/api/auth/updatePassword", [verifyToken, validateBodyParams(Password)], User.updatePassword)
};
