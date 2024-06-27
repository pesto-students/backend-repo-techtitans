const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Role = db.role;
const UserTokenCtrl = require("../controllers/userTokens.controller.js");
const { STATUSCODE, ERROR_MESSAGE } = require("../config/constants.js");

createToken = async (payload) => {
  const { _id, username, role, emailId } = payload;
  const jwtToken = jwt.sign(
    {
      userId: _id,
      username,
      emailId,
      role,
    },
    config.secret
  );

  payload.accessToken = jwtToken;

  await UserTokenCtrl.insertUserToken(
    payload._id,
    payload.accessToken,
    payload
  );

  return payload;
};

verifyToken = async (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(STATUSCODE.ROLE_NOT).send({ message: "No token provided!" });
  }

  if (!token?.startsWith("Bearer")) {
    return res.status(STATUSCODE.BAD_REQUEST).send({
      message: "Invalid token.",
    });
  }

  try {
    token = token.replace("Bearer ", "");

    await jwt.verify(token, config.secret, async (err, decoded) => {
      // console.log(err, decoded);
      if (err) {
        return res.status(STATUSCODE.UNAUTHORIZED).send({
          message: "Unauthorized!",
        });
      }

      await UserTokenCtrl.isActiveToken(decoded.userId, token);
      req.user = decoded;
      next();
    });
  } catch (ex) {
    res.status(STATUSCODE.INTERNAL_ERROR).send(ERROR_MESSAGE);
  }
};

isAdmin = (req, res, next) => {
  User.findById(req.user.userId).exec((err, user) => {
    if (err) {
      res.status(STATUSCODE.INTERNAL_ERROR).send(ERROR_MESSAGE);
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(STATUSCODE.INTERNAL_ERROR).send(ERROR_MESSAGE);
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "admin") {
            next();
            return;
          }
        }

        res.status(STATUSCODE.ROLE_NOT_MATCHED).send({ message: "Require Admin Role!" });
        return;
      }
    );
  });
};

isModerator = (req, res, next) => {
  User.findById(req.user.userId).exec((err, user) => {
    if (err) {
      res.status(STATUSCODE.INTERNAL_ERROR).send(ERROR_MESSAGE);
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(STATUSCODE.INTERNAL_ERROR).send(ERROR_MESSAGE);
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "moderator") {
            next();
            return;
          }
        }

        res.status(STATUSCODE.ROLE_NOT_MATCHED).send(ERROR_MESSAGE);
        return;
      }
    );
  });
};

const authJwt = {
  createToken,
  verifyToken,
  isAdmin,
  isModerator,
};
module.exports = authJwt;
