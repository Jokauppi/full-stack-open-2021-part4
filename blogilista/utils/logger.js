const info = (...params) => {
  if (process.env.NODE_ENV !== "test" || process.env.LOG_ERRORS === "true") {
    console.log(...params);
  }
};

const error = (...params) => {
  if (process.env.NODE_ENV !== "test" || process.env.LOG_ERRORS === "true") {
    console.log(...params);
  }
};

module.exports = {
  info,
  error,
};
