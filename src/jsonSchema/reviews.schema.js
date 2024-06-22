const Joi = require("joi");
const { REVIEW_STATUS } = require("../config/constants");

const AddReviewSchema = Joi.object({
  attachmentName: Joi.string().required(),
  attachment: Joi.string().required(),
  relevantExp: Joi.number().min(0).max(50).required(),
  reasonForReview: Joi.string().required(),
  description: Joi.string().optional(),
  docType: Joi.string().required(),
});

const GetReviewByDocId = Joi.object({
  docId: Joi.string().required().length(10),
});

const highlightAreaSchema = Joi.object({
  height: Joi.number().required(),
  left: Joi.number().required(),
  pageIndex: Joi.number().integer().required(),
  top: Joi.number().required(),
  width: Joi.number().required(),
});

const Comment = Joi.object({
  id: Joi.number().required(),
  comment: Joi.string().required(),
  highlightAreas: Joi.array().items(highlightAreaSchema).required(),
  quote: Joi.string().required(),
});

const SubmitReview = Joi.object({
  docId: Joi.string().required(),
  comments: Joi.array().items(Comment).required()
});

module.exports = {
  AddReviewSchema,
  GetReviewByDocId,
  SubmitReview,
};
