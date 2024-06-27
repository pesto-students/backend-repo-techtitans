const ROLES = {
  ADMIN: "admin",
  EXPERT: "expert",
  CUSTOMER: "customer",
};

const USER_ACTIVATION_STATUS = {
  APPROVED: "approved",
  REJECTED: "rejected",
  PENDING: "pending",
};

const REVIEW_STATUS = {
  INPROGRESS: "inProgress",
  COMPLETED: "completed",
};

// Define possible values for domain and industry
const DOMAIN_VALUES = [
  "Product Requirement Document",
  "Resume",
  "LOR",
  "Essay",
];

const INDUSTRY_VALUES = [
  "Software",
  "Hardware",
  "Pharmaceutical",
  "Banking",
  "Consulting",
];

// Basic URL regex pattern
const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

const EMAIL_SUB = {
  CUST_SIGNUP: "Welcome to DocChecker!",
  EXPERT_SIGNUP: "Thank You for Signing Up with DocChecker!",
  FOTGOT_PWD: "Password Reset Request",
  VERIFY_EMAIL: "Verifiy Your Email with DocChecker",
  USER_ACTIVATION: "Welcome! Your DocChecker Account is Activated",
  USER_REJECTION: "Account Activation Failed",
};

const STATUSCODE = {
  SUCCESS: 200,
  CREATED: 201,
  INTERNAL_ERROR: 500,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  ROLE_NOT_MATCHED: 403,
  NOTFOUND: 404,
};

const ERROR_MESSAGE = { message: "Some Error Occured" };

module.exports = {
  ROLES,
  USER_ACTIVATION_STATUS,
  REVIEW_STATUS,
  DOMAIN_VALUES,
  INDUSTRY_VALUES,
  URL_REGEX,
  EMAIL_SUB,
  STATUSCODE,
  ERROR_MESSAGE,
};
