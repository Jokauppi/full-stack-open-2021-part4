const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/user");

const loginRouter = require("express").Router();

loginRouter.post("/", async (request, response) => {
  const loginData = request.body;

  const user = await User.findOne({ username: loginData.username });

  const accessPermitted =
    user === null
      ? false
      : await bcrypt.compare(loginData.password, user.passwordHash);

  if (!user || !accessPermitted) {
    return response.status(401).json({ error: "invalid username or password" });
  }

  const tokenUser = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(tokenUser, process.env.JWT_SECRET);

  response
    .status(200)
    .send({ name: user.name, username: user.username, token });
});

module.exports = loginRouter;
