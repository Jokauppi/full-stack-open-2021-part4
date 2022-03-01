const Blog = require("../models/blog");
const User = require("../models/user");

const initialBlogs = [
  {
    title: "blog1",
    author: "blogger1",
    url: "blog.1.example",
    likes: 7,
  },
  {
    title: "blog2",
    author: "blogger2",
    url: "blog.2.example",
    likes: 8,
  },
];

const initialUsers = [
  {
    username: "user1",
    passwordHash:
      "$2b$10$O8xQ2cScsBwkV58rRE8CxujENzUexwtmACpMn5YUw7y0rnmKN2o8i",
    name: "User One",
  },
  {
    username: "user2",
    passwordHash:
      "$2b$10$I/tyTMAQHXebxyMBAjl4V.2AV7u9vOdXJicR/4UAQ.vzjBEsx.j8q",
    name: "User Two",
  },
];

const initialUsersPasswords = [
  {
    username: "user1",
    password: "pass1",
    name: "User One",
  },
  {
    username: "user2",
    password: "pass2",
    name: "User Two",
  },
];

let userToken = undefined;

const initUsers = async (api, users) => {
  await User.deleteMany({});
  users ??= initialUsersPasswords;
  for (const user of users) {
    await api.post("/api/users").send(user);
  }
};

const initBlogs = async (api, blogs) => {
  await Blog.deleteMany({});
  blogs ??= initialBlogs;

  for (const blog of blogs) {
    await api
      .post("/api/blogs")
      .set({ authorization: `Bearer ${userToken}` })
      .send(blog);
  }
};

const login = async (api, user) => {
  userToken = undefined;
  user ??= initialUsersPasswords[0];

  const response = await api.post("/api/login").send({
    username: user.username,
    password: user.password,
  });

  userToken = response.body.token;
  module.exports.userToken = userToken;
};

const getBlogs = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const getUsers = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = {
  initialBlogs,
  initialUsers,
  initialUsersPasswords,
  userToken,
  initUsers,
  initBlogs,
  login,
  getBlogs,
  getUsers,
};
