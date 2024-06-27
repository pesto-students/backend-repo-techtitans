const { STATUSCODE, ERROR_MESSAGE } = require("../config/constants");
const { Reviews } = require("../models");
const { logger } = require("../config/logger.config");

const getReviewByDocId = (docId, reviewerId) => {
  return new Promise((resolve, reject) => {
    Reviews.findOne({
      docId,
      reviewerId,
      isActive: true,
    })
      .then((data) => {
        if (data) resolve(data);

        reject(new Error("Review Not Found with Id: ", docId));
      })
      .catch((error) => reject(error));
  });
};

const insertComment = (Review, commenterId, input) => {
  return new Promise((resolve, reject) => {
    const Comment = {
      commenterId: commenterId,
      orderId: input.id,
      comment: input.comment,
      highlightAreas: input.highlightAreas,
      quote: input.quote,
    };

    Review.comments.push(Comment);

    Review.save()
      .then((data) => resolve(data))
      .catch((error) => reject(new Error(error.message)));
  });
};

const updComment = (Review, input, action) => {
  return new Promise((resolve, reject) => {
    const Comment = Review.comments.id(input.commentId);

    if (action === "UPDATE") Comment.comment = input.comment;
    if (action === "DELETE") Comment.isActive = false;

    Review.save()
      .then((data) => resolve(data))
      .catch((error) => reject(new Error(error.message)));
  });
};

exports.createComment = (req, res) => {
  getReviewByDocId(req.params.docId, req.user.userId)
    .then((Review) => insertComment(Review, req.user.userId, req.body))
    .then((data) => res.status(STATUSCODE.CREATED).send(data))
    .catch((error) => {
      logger.error(error.message, error);

      res.status(STATUSCODE.INTERNAL_ERROR).send(ERROR_MESSAGE);
    });
};

exports.deleteComment = (req, res) => {
  const { docId, commentId } = req.params;

  getReviewByDocId(docId, req.user.userId)
    .then((Review) => updComment(Review, { commentId }, "DELETE"))
    .then(() =>
      res
        .status(STATUSCODE.SUCCESS)
        .send({ message: "Comment Deleted Successfully." })
    )
    .catch((error) => {
      logger.error(error.message, error);

      res.status(STATUSCODE.INTERNAL_ERROR).send(ERROR_MESSAGE);
    });
};

exports.updateComment = (req, res) => {
  const { docId, commentId } = req.params;
  const inputJson = { commentId, comment: req.body.comment };

  getReviewByDocId(docId, req.user.userId)
    .then((Review) => updComment(Review, inputJson, "UPDATE"))
    .then(() =>
      res
        .status(STATUSCODE.SUCCESS)
        .send({ message: "Comment Updated Successfully." })
    )
    .catch((error) => {
      logger.error(error.message, error);

      res.status(STATUSCODE.INTERNAL_ERROR).send(ERROR_MESSAGE);
    });
};

exports.addBulkComments = (req, res) => {
  const commentsInp = req.body.comments.map((comment) => {
    comment.orderId = comment.id;
    comment.commenterId = req.user.userId;

    delete comment.id;

    return comment;
  });

  Reviews.findOneAndUpdate(
    { docId: req.params.docId },
    {
      $set: {
        comments: commentsInp,
      },
    },
    { new: true, runValidators: true }
  )
    .then((data) => res.status(STATUSCODE.SUCCESS).send(data))
    .catch((error) => {
      logger.error(error.message, error);

      res.status(STATUSCODE.INTERNAL_ERROR).send(ERROR_MESSAGE);
    });
};
