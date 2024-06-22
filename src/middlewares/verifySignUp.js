const db = require("../models");
const Users = db.Users;

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    const user = await Users.findOne({ username: req.body.username });
    if (user) {
      return res.status(400).send({ message: "Username is already in use!" });
    }

    const email = await Users.findOne({ emailId: req.body.emailId });
    if (email) {
      return res.status(400).send({ message: "EmailId is already in use!" });
    }

    next();
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};

const checkDuplicateUsername = (req, res, next) => {
  Users.findOne({
    username: req.body.username,
  })
    .then((data) => {
      if (data) {
        return res.status(400).send({ message: "Username is already in use!" });
      }

      next();
    })
    .catch((error) => res.status(500).send({ message: error }));
};

const checkDuplicateEmailId = (req, res, next) => {
  Users.findOne({
    emailId: req.body.emailId,
  })
    .then((data) => {
      if (data) {
        return res.status(409).send({ message: "Username is already in use!" });
      }

      next();
    })
    .catch((error) => res.status(500).send({ message: error }));
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkDuplicateUsername
};

module.exports = verifySignUp;
