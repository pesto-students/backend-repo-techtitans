const { STATUSCODE, ERROR_MESSAGE } = require("../config/constants");
const db = require("../models");
const Users = db.Users;

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    const user = await Users.findOne({ username: req.body.username, isActive:true });
    if (user) {
      return res
        .status(STATUSCODE.INTERNAL_ERROR)
        .send({ message: "Username is already in use!" });
    }

    const email = await Users.findOne({ emailId: req.body.emailId, isActive:true });
    if (email) {
      return res
        .status(STATUSCODE.INTERNAL_ERROR)
        .send({ message: "EmailId is already in use!" });
    }

    next();
  } catch (error) {
    return res.status(STATUSCODE.INTERNAL_ERROR).send(ERROR_MESSAGE);
  }
};

const checkDuplicateUsername = (req, res, next) => {
  Users.findOne({
    username: req.body.username,
    isActive:true
  })
    .then((data) => {
      if (data) {
        return res
          .status(STATUSCODE.INTERNAL_ERROR)
          .send({ message: "Username is already in use!" });
      }

      next();
    })
    .catch((error) =>
      res.status(STATUSCODE.INTERNAL_ERROR).send(ERROR_MESSAGE)
    );
};

const checkDuplicateEmailId = (req, res, next) => {
  Users.findOne({
    emailId: req.body.emailId,
    isActive:true
  })
    .then((data) => {
      if (data) {
        return res.status(STATUSCODE.INTERNAL_ERROR).send({ message: "Username is already in use!" });
      }

      next();
    })
    .catch((error) => res.status(STATUSCODE.INTERNAL_ERROR).send(ERROR_MESSAGE));
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkDuplicateUsername,
};

module.exports = verifySignUp;
