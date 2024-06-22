// const { verifySignUp } = require("../middlewares");
const Role = require('../controllers/roles.controller');
const { verifyToken } = require('../middlewares').authJwt;

module.exports = function (app) {
  app.post("/api/role", Role.create);

  app.get("/api/roles", [verifyToken], Role.findAll);

  app.get("/api/role/:name", Role.findByName);

  app.delete("/api/role/:name", Role.delete);
};
