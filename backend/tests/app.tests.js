// tests/app.test.js

const request = require("supertest");
const app = require("../server"); // Assuming your Express app is exported from this module

describe("Video Platform API Endpoints", () => {
  // Test for signup endpoint
  it("should signup a new user", async () => {
    const response = await request(app).post("/api/signup").send({
      email: "testuser@example.com",
      password: "password123P",
    });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("userId");
    expect(response.body).toHaveProperty("email", "testuser@example.com");
  });

  // Test for login endpoint
  it("should login an existing user", async () => {
    const response = await request(app).post("/api/login").send({
      email: "testuser@example.com",
      password: "password123P",
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  // Test for password reset request endpoint
  it("should request a password reset", async () => {
    const response = await request(app).post("/api/reset-password").send({
      email: "testuser@example.com",
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message", "Password reset link sent");
  });

  // Test for video upload endpoint (Admin only)
  it("should upload a video", async () => {
    // Simulating admin authentication
    const adminToken = "your_admin_token";

    const response = await request(app)
      .post("/api/videos")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "Test Video",
        description: "A video for testing purposes",
        videoUrl: "http://example.com/video.mp4",
      });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("videoId");
  });

  // Test for fetching a video
  it("should fetch a video by ID", async () => {
    const response = await request(app).get("/api/videos/1");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("videoId", 1);
    expect(response.body).toHaveProperty("title");
  });

  // Test for navigating to the next video
  it("should fetch the next video", async () => {
    const response = await request(app).get("/api/videos/1/next");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("videoId");
    expect(response.body).toHaveProperty("title");
  });

  // Test for navigating to the previous video
  it("should fetch the previous video", async () => {
    const response = await request(app).get("/api/videos/2/previous");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("videoId");
    expect(response.body).toHaveProperty("title");
  });

  // Test for sharing a video link
  it("should share a video link", async () => {
    const response = await request(app).post("/api/videos/1/share").send({
      email: "friend@example.com",
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message", "Video link shared");
  });
});
