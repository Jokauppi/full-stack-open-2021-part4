const config = require("./utils/config");
const logger = require("./utils/logger");
const express = require("express");
require("express-async-errors");
const app = express();
const cors = require("cors");
const blogRouter = require("./controllers/blogs");
const userRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const middleware = require("./utils/middleware");
const mongoose = require("mongoose");

const mongoUrl = config.MONGODB_URI;

mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(logger.info("db connected"))
  .catch((error) => logger.info("db connection failed\n" + error));

app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== "test") app.use(middleware.requestLogger);

app.use("/api/blogs", middleware.userExtractor, blogRouter);
app.use("/api/users", middleware.userExtractor, userRouter);
app.use("/api/login", loginRouter);

if (process.env.NODE_ENV === "test") {
  const testingRouter = require("./controllers/testing");
  app.use("/api/testing", testingRouter);
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
