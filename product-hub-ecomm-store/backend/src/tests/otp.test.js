const request = require("supertest");
const app = require("../app");

describe("OTP ROUTES", () => {
  it("should send OTP successfully", async () => {
    const res = await request(app).post("/api/send-otp").send({
      email: "testsignup@example.com",
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("OTP sent successfully to your email");
  });

  it("should fail if email is missing", async () => {
    const res = await request(app).post("/api/send-otp").send({});

    expect(res.status).toBe(400);
  });

  it("should fail verify OTP if data missing", async () => {
    const res = await request(app).post("/api/verify-otp").send({
      email: "testsignup@example.com",
    });

    expect(res.status).toBe(400);
  });

  it("should fail reset password if data missing", async () => {
    const res = await request(app).post("/api/reset-password").send({
      email: "testsignup@example.com",
    });

    expect(res.status).toBe(400);
  });
});
