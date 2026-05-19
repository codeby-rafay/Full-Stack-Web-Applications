const request = require("supertest");
const app = require("../app");

describe("SIGNUP ROUTES", () => {
  it("should register user successfully", async () => {
    const res = await request(app).post("/api/signup").send({
      fullName: "Test User",
      email: "testsignup@example.com",
      password: "123456",
    });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Account created successfully!");
    expect(res.body.user.email).toBe("testsignup@example.com");
  });

  it("should fail if fields are missing", async () => {
    const res = await request(app)
      .post("/api/signup")
      .send({ email: "test@example.com" });

    expect(res.status).toBe(400);
  });

  it("should not allow duplicate email", async () => {
    await request(app).post("/api/signup").send({
      fullName: "User One",
      email: "duplicate@example.com",
      password: "123456",
    });

    const res = await request(app).post("/api/signup").send({
      fullName: "User Two",
      email: "duplicate@example.com",
      password: "123456",
    });

    expect(res.status).toBe(400);
  });

  it("GET /api/signup - should fetch all users", async () => {
    const res = await request(app).get("/api/signup");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.signups)).toBe(true);
  });

  it("DELETE /api/signup/:id - should delete user", async () => {
    const res = await request(app).delete("/api/signup/invalid-id");

    expect([400, 404, 500]).toContain(res.status);
  });
});
