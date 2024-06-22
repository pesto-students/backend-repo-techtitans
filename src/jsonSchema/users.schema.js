const Joi = require("joi");
const {
  USER_ACTIVATION_STATUS,
  DOMAIN_VALUES,
  INDUSTRY_VALUES,
} = require("../config/constants");
const DOMAIN_SCHEMA = Joi.array().items(Joi.string().valid(...DOMAIN_VALUES));
const INDUSTRY_SCHEMA = Joi.array().items(
  Joi.string().valid(...INDUSTRY_VALUES)
);

exports.user = Joi.object({
  emailId: Joi.string().email().required(),
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
});

exports.moderator = Joi.object({
  emailId: Joi.string().email().required(),
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
  profile: Joi.object({
    profileSummary: Joi.string(),
    linkedInUrl: Joi.string(),
    yearsOfExperience: Joi.number(),
    domainOfExpertise: DOMAIN_SCHEMA.required(),
    industry: INDUSTRY_SCHEMA.required(),
    resume: Joi.string().required(),
  }),
});

exports.loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const BASE_SCHEMA = Joi.object({
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  username: Joi.string().required(),
  emailId: Joi.string().email().required(),
  image: Joi.string().optional(),
});

exports.updateUserProfile = BASE_SCHEMA;

exports.updateExpertProfile = BASE_SCHEMA.keys({
  profile: Joi.object({
    profileSummary: Joi.string().required(),
    linkedInUrl: Joi.string().required(),
    yearsOfExperience: Joi.number().required(),
    domainOfExpertise: DOMAIN_SCHEMA.required(),
    industry: INDUSTRY_SCHEMA.required(),
    resume: Joi.string().required(),
  }),
});

exports.isUserIdExists = Joi.object({
  userId: Joi.string().required(),
});

exports.UserName = Joi.object({
  username: Joi.string().required(),
});

exports.ActivationStatus = Joi.object({
  userId: Joi.string().required(),
  status: Joi.string().required().valid("approved", "rejected"),
  message: Joi.string().when("status", {
    is: USER_ACTIVATION_STATUS.REJECTED,
    then: Joi.string().required(),
    otherwise: Joi.forbidden(),
  }),
});

exports.forgotPassword = Joi.object({
  emailId: Joi.string().email().required(),
});

exports.OTP = this.forgotPassword.keys({
  otp: Joi.string().required().length(6),
});

exports.Password = Joi.object({
  password: Joi.string().required(),
});
