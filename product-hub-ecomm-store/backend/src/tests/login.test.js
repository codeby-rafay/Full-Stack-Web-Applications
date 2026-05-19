const request = require("supertest");
const app = require("../app");

describe("LOGIN ROUTES", () => {
  it("should login successfully", async () => {
    const res = await request(app).post("/api/login").send({
      email: "testsignup@example.com",
      password: "123456",
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Login successful!");
    expect(res.body.token).toBeDefined();
  });

  it("should fail with wrong password", async () => {
    const res = await request(app).post("/api/login").send({
      email: "testsignup@example.com",
      password: "wrongpassword",
    });

    expect(res.status).toBe(400);
  });

  it("should fail if fields are empty", async () => {
    const res = await request(app).post("/api/login").send({
      email: "",
      password: "",
    });

    expect(res.status).toBe(400);
  });

  it("GET /api/login - should fetch login history", async () => {
    const res = await request(app).get("/api/login");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.logins)).toBe(true);
  });

  it("DELETE /api/login/:id - should delete login record", async () => {
    const res = await request(app).delete("/api/login/invalid-id");

    expect([200, 404]).toContain(res.status);
  });
});
