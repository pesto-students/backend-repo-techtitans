const { Users } = require("../models");
const bcrypt = require("bcryptjs");
const { authJwt } = require("../middlewares/index");
const {
  USER_ACTIVATION_STATUS,
  STATUSCODE,
  ERROR_MESSAGE,
} = require("../config/constants");
const ExpertsController = require("./experts.controller");
const { ROLES } = require("../config/constants");
const UserTokenCtrl = require("./userTokens.controller");
const MailerCtrl = require("./mailer.controller");
const OTPCtrl = require("./otp.controller");
const { logger } = require("../config/logger.config");

function hashPassword(pwd) {
  return bcrypt.hashSync(pwd, 8);
}

class UserNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "UserNotFoundError";
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = "UnauthorizedError";
  }
}

function isValidPassword(pwd, data) {
  if (!data) throw new UserNotFoundError("User Not Found");

  const isValid = bcrypt.compareSync(pwd, data.password);

  if (isValid) return data.toJSON();

  throw new UnauthorizedError("UNAUTHORIZED");
}

const findAll = (req, res) => {
  const input = {
    role: ROLES.EXPERT,
  };

  if (req.query.status) {
    input["isActive"] = {
      status: req.query.status,
    };
  }

  if (req.query.actStatus) {
    input["activationStatus.status"] = req.query.actStatus;
  }

  Users.find(input)
    .select("-password -_id") // Exclude the password field
    .then((data) => {
      res.status(STATUSCODE.SUCCESS).send({
        total: data.length,
        data,
      });
    })
    .catch((err) => {
      logger.error(err.message, err);

      res.status(STATUSCODE.INTERNAL_ERROR).send(ERROR_MESSAGE);
    });
};

const login = (req, res) => {
  Users.findOne({
    username: req.body.username,
    isActive: true,
  })
    .select("-isActive -createdAt -updatedAt -profile._id")
    .then((data) => isValidPassword(req.body.password, data))
    .then((data) => authJwt.createToken(data))
    .then((userData) => {
      delete userData.password;

      return userData;
    })
    .then((data) => res.status(STATUSCODE.SUCCESS).send(data))
    .catch((err) => {
      logger.error(err.message, err);

      if (err instanceof UserNotFoundError) {
        res.status(STATUSCODE.NOTFOUND).send(err.message);
      } else if (err instanceof UnauthorizedError) {
        res.status(STATUSCODE.UNAUTHORIZED).send(err.message);
      } else {
        res.status(STATUSCODE.INTERNAL_ERROR).send(ERROR_MESSAGE);
      }
    });
};

const expertSignUp = (req, res) => {
  const User = new Users({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    emailId: req.body.emailId,
    password: hashPassword(req.body.password),
    role: ROLES.EXPERT,
    profile: { ...req.body.profile },
  });

  Users.findOne({ username: User.get("username"), isActive: true })
    .then((userData) => {
      if (userData) {
        throw new Error("Username already exists");
      }

      // return data to next execution or next then method
      return User.save(User);
    })
    .then((data) => {
      MailerCtrl.sendSignUpMail(data);

      res.status(STATUSCODE.CREATED).send(data);
    })
    .catch((error) => {
      logger.error(error.message, error);

      res.status(STATUSCODE.INTERNAL_ERROR).send(ERROR_MESSAGE);
    });
};

const signUp = (req, res) => {
  const User = new Users({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    password: hashPassword(req.body.password),
    emailId: req.body.emailId,
    role: ROLES.CUSTOMER,
  });

  Users.findOne({ username: User.get("username"), isActive: true })
    .then((userData) => {
      if (userData) {
        throw new Error("Username already exists");
      }

      // return data to next execution or next then method
      return User.save(User);
    })
    // .then((data) => MailerCtrl.sendSignUpMail(data))
    .then((data) => {
      MailerCtrl.sendSignUpMail(data);

      res.status(STATUSCODE.CREATED).send(data);
    })
    .catch((error) => {
      logger.error(error.message, error);

      res.status(STATUSCODE.INTERNAL_ERROR).send(ERROR_MESSAGE);
    });
};

const signOut = (req, res) => {
  UserTokenCtrl.delete(req.user.userId)
    .then((data) => res.status(STATUSCODE.SUCCESS).send(data))
    .catch((error) => {
      logger.error(error.message, error);

      res.status(STATUSCODE.INTERNAL_ERROR).send(ERROR_MESSAGE);
    });
};

const updateProfile = (req, res) => {
  const updateObj = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    emailId: req.body.emailId,
    image: req.body.image,
  };

  if (req.user.role === ROLES.EXPERT) {
    updateObj["profile"] = { ...req.body.profile };
  }

  Users.findOne({ username: req.body.username, _id: { $ne: req.user.userId }, isActive:true })
    .then((data) => {
      if (data) {
        throw new Error("Username already exists");
      }

      return Users.findOne({
        emailId: req.body.emailId,
        _id: { $ne: req.user.userId },
        isActive:true
      });
    })
    .then((data) => {
      if (data) {
        throw new Error("EmailId is already in use");
      }

      return Users.findOneAndUpdate({ _id: req.user.userId }, updateObj, {
        new: true,
      });
    })
    .then((data) => {
      if (data) {
        res.status(STATUSCODE.SUCCESS).send({
          message: "Updated Successfully",
          data,
        });
      } else {
        throw new Error("Error occured while updating user");
      }
    })
    .catch((error) => {
      logger.error(error.message, error);

      res.status(STATUSCODE.INTERNAL_ERROR).send(ERROR_MESSAGE);
    });
};

const updateUserName = (req, res) => {
  Users.findOneAndUpdate(
    { _id: userId },
    {
      $set: {
        email: req.body.username,
      },
      select: "emailId",
    },
    { new: true, runValidators: true, findOneAndModify: false }
  )
    .then((data) =>
      res.status(STATUSCODE.SUCCESS).send({
        message: "Username Updated Successfully",
        data,
      })
    )
    .catch((error) => {
      logger.error(error.message, error);

      res.status(STATUSCODE.INTERNAL_ERROR).send(ERROR_MESSAGE);
    });
};

const deleteUser = (req, res) => {
  Users.findOneAndUpdate(
    { username: req.params.username },
    {
      $set: {
        isActive: false,
      },
    },
    { new: true, runValidators: true, findOneAndModify: false }
  )
    .then((data) => {
      if (data.acknowledged) {
        res.status(STATUSCODE.SUCCESS).send({
          message: "User Deleted Successfully",
        });
      }
    })
    .catch((error) => {
      logger.error(error.message, error);

      res.status(STATUSCODE.INTERNAL_ERROR).send(error.message);
    });
};

const updateUserStatus = (req, res) => {
  const { username } = req.params;
  let { userId, status, message } = req.body;
  let isActive = false;

  if (status.toLowerCase() === USER_ACTIVATION_STATUS.APPROVED) {
    status = USER_ACTIVATION_STATUS.APPROVED;
    isActive = true;
  } else status = USER_ACTIVATION_STATUS.REJECTED;

  Users.findOneAndUpdate(
    { username },
    {
      $set: {
        activationStatus: {
          status,
          message,
        },
        isActive,
      },
    },
    { new: true }
  )
    .then((data) => ExpertsController.create(data, status))
    .then((data) => {
      if (data.activationStatus.status === USER_ACTIVATION_STATUS.APPROVED) {
        MailerCtrl.sendExpertActivationMail(data);
      } else MailerCtrl.sendExpertRejectionMail(data);

      res.status(STATUSCODE.CREATED).send({
        message: `User ${
          status.charAt(0).toUpperCase() + status.slice(1)
        } Successfully`,
      });
    })
    .catch((error) => {
      logger.error(error.message, error);

      res.status(STATUSCODE.INTERNAL_ERROR).send(ERROR_MESSAGE);
    });
};

const updatePassword = (req, res) => {
  Users.findOneAndUpdate(
    { emailId: req.user.emailId, isActive: true },
    {
      $set: {
        password: hashPassword(req.body.password),
        isOtpVerified: false,
      },
    },
    { new: true, runValidators: true, findOneAndModify: false }
  )
    .then((data) => UserTokenCtrl.delete(data._id))
    .then(() =>
      res
        .status(STATUSCODE.SUCCESS)
        .send({ message: "Password Updated Successfully" })
    )
    .catch((error) => {
      logger.error(error.message, error);

      res.status(STATUSCODE.INTERNAL_ERROR).send(ERROR_MESSAGE);
    });
};

const updateResume = (req, res) => {};

const verifyEmail = (req, res) => {
  Users.findOneAndUpdate(
    { emailId: req.body.emailId, isActive: true },
    {
      $set: {
        otp: OTPCtrl.generateOTP(),
      },
    },
    { new: true, runValidators: true, findOneAndModify: false }
  )
    .then((data) => {
      return MailerCtrl.sendEmailVerificationMail(data.emailId, otp);
    })
    .then((data) => res.status(STATUSCODE.SUCCESS).send(data))
    .catch((error) => {
      logger.error(error.message, error);

      res.status(STATUSCODE.INTERNAL_ERROR).send(ERROR_MESSAGE);
    });
};

const forgotPassword = (req, res) => {
  Users.findOneAndUpdate(
    { emailId: req.body.emailId, isActive: true },
    {
      $set: {
        otp: OTPCtrl.generateOTP(6),
        isOtpVerified: false,
      },
    },
    { new: true, runValidators: true, findOneAndModify: false }
  )
    .then((data) => {
      console.log(data);
      if (!data) {
        throw new Error("EmailId Doesn't Exist");
      }

      return MailerCtrl.sendForgotPasswordEmail(data.emailId, data.otp);
    })
    .then((info) =>
      res
        .status(STATUSCODE.SUCCESS)
        .send({ message: "Email Sent Successfully" })
    )
    .catch((error) => {
      logger.error(error.message, error);

      res.status(STATUSCODE.INTERNAL_ERROR).send(ERROR_MESSAGE);
    });
};

const verifyOTP = (req, res) => {
  Users.findOneAndUpdate(
    { emailId: req.body.emailId, otp: req.body.otp, isOtpVerified: false },
    {
      $set: {
        isOtpVerified: true,
      },
    },
    { new: true, runValidators: true, findOneAndModify: false }
  )
    .then(async (data) => {
      console.log(data);
      if (!data) {
        throw new Error("Invalid OTP");
      }

      return authJwt.createToken(data);
    })
    .then((data) =>
      res.status(STATUSCODE.SUCCESS).send({
        status: true,
        accessToken: data.accessToken,
        message: `OTP Verified`,
      })
    )
    .catch((error) => {
      logger.error(error.message, error);

      res.status(STATUSCODE.INTERNAL_ERROR).send(ERROR_MESSAGE);
    });
};

exports.findAll = findAll;
exports.login = login;
exports.expertSignUp = expertSignUp;
exports.signUp = signUp;
exports.signOut = signOut;
exports.updateProfile = updateProfile;
exports.updateUserName = updateUserName;
exports.updateUserStatus = updateUserStatus;
exports.deleteUser = deleteUser;
exports.updatePassword = updatePassword;
exports.forgotPassword = forgotPassword;
exports.verifyOTP = verifyOTP;
