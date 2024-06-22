const { Experts } = require("../models");

exports.create = (userId, username) => {
  return new Promise((resolve, reject) => {
    const Expert = new Experts({
      userId,
      username,
    });

    Expert.save(Expert)
      .then((data) => resolve(data))
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
