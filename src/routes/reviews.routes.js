// const { verifySignUp } = require("../middlewares");
const Reviews = require("../controllers/review.controller");
const verifyRole = require("../middlewares/verifyRole");
const { verifyToken } = require("../middlewares/authJwt");
const {
  validateBodyParams,
  validatePathParams,
} = require("../middlewares/schemaValidator");
const { ROLES } = require("../config/constants");
const { AddReviewSchema, GetReviewByDocId, SubmitReview } =
  require("../jsonSchema").reviews;

const {} = require("../jsonSchema/");
module.exports = function (app) {
  app.post(
    "/api/review",
    [
      verifyToken,
      verifyRole([ROLES.CUSTOMER]),
      validateBodyParams(AddReviewSchema),
    ],
    Reviews.createReview
  );

  app.get(
    "/api/review/:docId",
    [
      verifyToken,
      verifyRole([ROLES.EXPERT, ROLES.CUSTOMER]),
      validatePathParams(GetReviewByDocId),
    ],
    Reviews.getReviewByDocId
  );

  app.get(
    "/api/user/reviews",
    [verifyToken, verifyRole([ROLES.EXPERT, ROLES.CUSTOMER])],
    Reviews.getUserReviews
  );

  app.put(
    "/api/review/submit",
    [
      verifyToken,
      verifyRole([ROLES.EXPERT]),
      validateBodyParams(SubmitReview),
    ],
    Reviews.submitReview
  );
};
