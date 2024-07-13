const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");
const User = require("../models/UserModel");

let server;

beforeAll(async () => {
  const port = 9000; // Use a different port for test
  server = app.listen(port, () => {
    console.log(`Test server is listening on port ${port}`);
  });
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  server.close();
});

describe("Auth Endpoints", () => {
  it("should sign up a new user", async () => {
    const res = await request(server).post("/api/signup").send({
      email: "testuser1@example.com",
      password: "Password@1234",
    });
    expect(res.statusCode).toBe(201);
  }, 10000); // Increase timeout to 10 seconds

  it("should log in an existing user", async () => {
    // First, sign up the user
    await request(server).post("/api/signup").send({
      email: "agyinjohn100@gmail.com",
      password: "UZZIAHpop@90",
    });

    const res = await request(server).post("/api/login").send({
      email: "agyinjohn100@gmail.com",
      password: "UZZIAHpop@90",
    });
    expect(res.statusCode).toBe(200);
  }, 10000); // Increase timeout to 10 seconds
});
