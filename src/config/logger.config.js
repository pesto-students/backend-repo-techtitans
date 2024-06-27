const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf, colorize, errors } = format;
const path = require("path");

// Custom format for the log messages
const customFormat = printf(({ level, message, label, timestamp, stack }) => {
  return `${timestamp} [${label}] ${level}: ${stack || message}`;
});

// Define logger
const logger = createLogger({
  level: "info", // Log level
  format: combine(
    label({ label: path.basename(process.mainModule.filename) }),
    timestamp(),
    errors({ stack: true }), // Capture stack trace
    colorize(),
    customFormat
  ),
  transports: [
    new transports.Console(), // Log to console
    new transports.File({ filename: "logs/app.log" }), // Log to file
  ],
  exceptionHandlers: [
    new transports.File({ filename: "logs/exceptions.log" }), // Log exceptions to file
  ],
  rejectionHandlers: [
    new transports.File({ filename: "logs/rejections.log" }), // Log unhandled rejections to file
  ],
});

// Middleware to log request details
const logRequest = (req, res, next) => {
  logger.info(
    `Request  for: ${req.method} ${req.url} - Body: ${JSON.stringify(req.body)}`
  );
  next();
};

// Middleware to log response details
const logResponse = (req, res, next) => {
  const oldWrite = res.write;
  const oldEnd = res.end;

  const chunks = [];

  res.write = function (chunk) {
    chunks.push(chunk);
    oldWrite.apply(res, arguments);
  };

  res.end = function (chunk) {
    if (chunk) {
      chunks.push(chunk);
    }
    const body = Buffer.concat(chunks).toString("utf8");

    if (res.statusCode === 304) {
      logger.info(
        `Response for ${req.method} ${req.url} - Status: ${res.statusCode} - Body: Not Modified`
      );
    } else {
      logger.info(
        `Response for ${req.method} ${req.url} - Status: ${res.statusCode} - Body: ${body}`
      );
    }

    oldEnd.apply(res, arguments);
  };

  next();
};

module.exports = { logger, logRequest, logResponse };
