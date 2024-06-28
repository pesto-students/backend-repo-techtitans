const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const UserTokenCtrl = require("../controllers/userTokens.controller.js");
const {
  ERROR_MESSAGE,
  STATUSCODE,
  UNAUTHORIZED_MESSAGE,
} = require("../config/constants.js");

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
  try {
    let token = req.headers.authorization;

    if (!token) {
      return res.status(STATUSCODE.BAD_REQUEST).send(UNAUTHORIZED_MESSAGE);
    }

    if (!token?.startsWith("Bearer")) {
      return res.status(STATUSCODE.BAD_REQUEST).send(INVALIDTOKEN);
    }

    token = token.replace("Bearer ", "");

    await jwt.verify(token, config.secret, async (err, decoded) => {
      // console.log(err, decoded);
      if (err) {
        return res.status(STATUSCODE.UNAUTHORIZED).send(UNAUTHORIZED_MESSAGE);
      }

      await UserTokenCtrl.isActiveToken(decoded.userId, token);
      req.user = decoded;
      next();
    });
  } catch (ex) {
    if (ex.message == "session-expired/logged-out") {
      res.status(STATUSCODE.UNAUTHORIZED).send(ex);
    } else res.status(STATUSCODE.INTERNAL_ERROR).send(ERROR_MESSAGE);
  }
};

const authJwt = {
  createToken,
  verifyToken,
};
module.exports = authJwt;
