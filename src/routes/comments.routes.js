const { ROLES } = require("../config/constants");
const Comments = require("../controllers/comments.controller");
const { verifyRole } = require("../middlewares");
const { verifyToken } = require("../middlewares/authJwt");
const {
  validateBodyParams,
  validatePathParams,
} = require("../middlewares/schemaValidator");
const { comments, reviews } = require("../jsonSchema");

const { Comment, isValidDocIdCommId, UpdateComment, CreateBulkComments } = comments;
const { GetReviewByDocId } = reviews;
module.exports = function (app) {
  app.post(
    "/api/review/:docId/comment",
    [
      verifyToken,
      verifyRole([ROLES.EXPERT]),
      validatePathParams(GetReviewByDocId),
      validateBodyParams(Comment),
    ],
    Comments.createComment
  );

  app.put(
    "/api/review/:docId/comment/:commentId",
    [
      verifyToken,
      verifyRole([ROLES.EXPERT]),
      validatePathParams(isValidDocIdCommId),
      validateBodyParams(UpdateComment),
    ],
    Comments.updateComment
  );

  app.delete(
    "/api/review/:docId/comment/:commentId",
    [
      verifyToken,
      verifyRole([ROLES.EXPERT]),
      validatePathParams(isValidDocIdCommId),
    ],
    Comments.deleteComment
  );

  // app.put(
  //   "/api/review/:docId/comments",
  //   [
  //     verifyToken,
  //     verifyRole([ROLES.EXPERT]),
  //     validatePathParams(GetReviewByDocId),
  //     validateBodyParams(CreateBulkComments),
  //   ],
  //   Comments.addBulkComments
  // );
};
