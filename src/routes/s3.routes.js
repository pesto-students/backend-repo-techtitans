const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const S3 = require("../controllers/s3.controller");

module.exports = function (app) {
  app.post("/api/file/upload", upload.single("file"), S3.uploadFile);
};
