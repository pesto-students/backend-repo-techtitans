const s3 = require("../config/s3.config");
const fs = require("fs");
const path = require("path");

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
    .then((s3Url) => res.status(200).send({ url: s3Url }))
    .catch((error) => res.status(400).send(error));
};
