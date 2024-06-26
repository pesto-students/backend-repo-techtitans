// abortEarly: if True get all errors at a time
// Default value is true if not specified

const { STATUSCODE } = require("../config/constants");

// { "abortEarly": false }
const validateBodyParams = (schema) => (req, res, next) =>
  schema
    .validateAsync(req.body, { abortEarly: false })
    .then(() => next())
    .catch((ex) =>
      res.status(STATUSCODE.BAD_REQUEST).send(ex.details.map((i) => i.message.replace('required', 'missing')).join(",\n"))
    );

const validatePathParams = (schema) => (req, res, next) =>
  schema
    .validateAsync(req.params, { abortEarly: false })
    .then(() => next())
    .catch((ex) =>
      res.status(STATUSCODE.BAD_REQUEST).send(ex.details.map((i) => i.message.replace('required', 'missing')).join(",\n"))
    );

const validateQueryParams = (schema) => (req, res, next) => {
  let { error, value } = schema.validate(req.query, { abortEarly: false });
  if (error)
    res.status(STATUSCODE.BAD_REQUEST).send(error.details.map((i) => i.message.replace('required', 'missing')).join(",\n"));
  next();
};

module.exports = {
  validateBodyParams,
  validatePathParams,
  validateQueryParams,
};
