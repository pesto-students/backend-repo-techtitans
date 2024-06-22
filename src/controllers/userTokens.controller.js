const { UserTokens } = require("../models");

exports.insertUserToken = (userId, token, userData) => {
  return new Promise((resolve, reject) => {
    UserTokens.findOneAndUpdate(
      { userId },
      { token, isActive: true },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )
      .then(() => resolve(userData))
      .catch((error) => reject(error));
  });
};

exports.isActiveToken = (userId, token, userData) => {
  return new Promise((resolve, reject) => {
    UserTokens.findOne({ userId, token, isActive: true })
      .then((data) => {
        if (!data) reject({ message: "session-expired/logged-out" });
        else resolve(true);
      })
      .catch((error) => reject(error));
  });
};

exports.delete = (userId) => {
  return new Promise((resolve, reject) => {
    UserTokens.updateOne({ userId }, { isActive: false }, { new: true })
      .then((data) => {
        if (data.acknowledged) {
          resolve({ message: "Logged Out Successfully" });
        } else {
          reject(new Error("Error While Logging Out"));
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};
