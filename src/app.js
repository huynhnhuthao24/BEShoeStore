const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const app = express();

// init midlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
// init db

// init routes
app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "test",
  });
});
// handle error

module.exports = app;
