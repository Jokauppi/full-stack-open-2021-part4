const bcrypt = require("bcrypt");
const userRouter = require("express").Router();
const User = require("../models/user");

userRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    title: 1,
    author: 1,
    url: 1,
    likes: 1,
  });
  response.json(users);
});

userRouter.post("/", async (request, response) => {
  const newUser = request.body;

  if (newUser.password.length < 3) {
    const err = new Error("User validation failed");
    err.name = "ValidationError";
    throw err;
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(newUser.password, saltRounds);

  const user = new User({
    username: newUser.username,
    name: newUser.name,
    passwordHash: passwordHash,
  });

  const createdUser = await user.save();

  response.status(201).json(createdUser);
});

module.exports = userRouter;
