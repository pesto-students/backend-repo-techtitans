const s3 = require("../config/s3.config");
const fs = require("fs");
const path = require("path");
const { STATUSCODE, ERROR_MESSAGE } = require("../config/constants");

const uploadFileToBucket = (filePath) => {
  return new Promise((resolve, reject) => {
    const fileContent = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileName,
      Body: fileContent,
      ContentType: "application/pdf",
    };

    // Uploading files to the bucket
    s3.upload(params, function (err, data) {
      fs.unlinkSync(filePath);

      if (err) {
        reject(err);
      } else resolve(data.Location);
    });
  });
};

exports.uploadFile = (req, res) => {
  const file = req.file;

  uploadFileToBucket(file.path)
    .then((s3Url) => res.status(STATUSCODE.SUCCESS).send({ url: s3Url }))
    .catch((error) =>
      res.status(STATUSCODE.INTERNAL_ERROR).send(ERROR_MESSAGE)
    );
};
