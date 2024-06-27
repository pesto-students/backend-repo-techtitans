require("dotenv").config();
const multer = require("multer");
const cors = require("cors");
const express = require("express");
const app = express();

// Swagger setup
const { swaggerSpec } = require("./swagger.spec");
const swaggerUi = require("swagger-ui-express");
const { STATUSCODE, ERROR_MESSAGE } = require("./src/config/constants");
const {logger, logRequest, logResponse} = require("./src/config/logger.config");

app.use(cors());
/* for Angular Client (withCredentials) */
// app.use(
//   cors({
//     credentials: true,
//     origin: ["http://localhost:8081"],
//   })
// );

// parse requests of content-type - application/json
// Limit to 10KB for JSON bodies
app.use(express.json({ limit: '10kb' }));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(logRequest);
app.use(logResponse);

app.use((err, req, res, next) => {
  // logger.error("hello: ", err.message, err);

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(STATUSCODE.INTERNAL_ERROR)
        .send({ error: "File size is too large. Maximum size is 5MB." });
    }
    // return res.status(STATUSCODE.INTERNAL_ERROR).send(ERROR_MESSAGE);
  }
  // If no error, pass to the next middleware
  // next();
});

const db = require("./src/models");

// Connect to MongoDB database using Mongoose
db.mongoose
  .connect(db.connUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// routes
require("./src/routes/auth.routes")(app);
require("./src/routes/users.routes")(app);
require("./src/routes/reviews.routes")(app);
require("./src/routes/comments.routes")(app);
require("./src/routes/s3.routes")(app);

app.listen(process.env.PORT, () => {
  console.log("Server Started at PORT: ", process.env.PORT);
});
