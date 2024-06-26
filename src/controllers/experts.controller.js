const { USER_ACTIVATION_STATUS } = require("../config/constants");
const { Experts } = require("../models");

exports.create = (user, status) => {
  return new Promise((resolve, reject) => {
    if (status === USER_ACTIVATION_STATUS.REJECTED) {
      resolve(user);
    }

    const Expert = new Experts({
      userId: user._id,
      username: user.username,
    });

    Expert.save(Expert)
      .then((data) => resolve(user))
      .catch((error) => reject(error));
  });
};

exports.update = (expert, reviewData) => {
  return new Promise((resolve, reject) => {
    const assigned = expert.assigned + 1;
    Experts.updateOne(
      { userId: expert.userId },
      {
        assigned,
        pending: assigned - expert.submitted,
      },
      { new: true }
    )
      .then((data) => resolve([data, reviewData]))
      .catch((error) => reject(error));
  });
};

exports.reviewSubmitted = (userId, revData) => {
  if (revData == null) {
    throw new Error("Document is either Submitted or Not Found.");
  }
  return new Promise((resolve, reject) => {
    Experts.findOne({ userId })
      .then((data) => {
        const { assigned, submitted } = data;

        return Experts.updateOne(
          { userId: userId },
          {
            submitted: submitted + 1,
            pending: assigned - (submitted + 1),
          }
        );
      })
      .then((data) => resolve(revData))
      .catch((error) => reject(error));
  });
};
