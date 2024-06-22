const Joi = require("joi");

const highlightAreaSchema = Joi.object({
  height: Joi.number().required(),
  left: Joi.number().required(),
  pageIndex: Joi.number().integer().required(),
  top: Joi.number().required(),
  width: Joi.number().required(),
});

exports.Comment = Joi.object({
  id: Joi.number().required(),
  comment: Joi.string().required(),
  highlightAreas: Joi.array().items(highlightAreaSchema).required(),
  quote: Joi.string().required(),
});

exports.CreateBulkComments = Joi.object({
  comments: Joi.array().items(this.Comment).required()
})

exports.UpdateComment = Joi.object({
    comment:Joi.string().required()
})

exports.isValidDocIdCommId = Joi.object({
  docId: Joi.string().required(),
  commentId: Joi.string().required(),
});
