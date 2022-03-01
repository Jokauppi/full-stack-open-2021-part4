const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

const User = require("../models/user");

describe("When logging in", () => {
  const newUser = {
    username: "username",
    password: "pass",
    name: "User Name",
  };

  beforeEach(async () => {
    await User.deleteMany({});
  });

  test("right status code and data in the right type is returned", async () => {
    await api.post("/api/users").send(newUser);

    await api
      .post("/api/login")
      .send({
        username: "username",
        password: "pass",
      })
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("right status code on incorrect password", async () => {
    await api.post("/api/users").send(newUser);

    await api
      .post("/api/login")
      .send({
        username: "username",
        password: "non-existent-pass",
      })
      .expect(401);
  });

  test("right status code on incorrect username", async () => {
    await api.post("/api/users").send(newUser);

    await api
      .post("/api/login")
      .send({
        username: "non-existent-username",
        password: "pass",
      })
      .expect(401);
  });

  test("right data is returned", async () => {
    await api.post("/api/users").send(newUser);

    const response = await api.post("/api/login").send({
      username: "username",
      password: "pass",
    });

    const loginData = response.body;

    expect(loginData.token).toBeDefined();
    expect(loginData.username).toEqual("username");
    expect(loginData.name).toEqual("User Name");
  });
});

afterAll(() => {
  mongoose.connection.close();
});
