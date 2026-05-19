const request = require("supertest");
const app = require("../app");

describe("GOOGLE LOGIN ROUTES", () => {
  it("should return 400 if token is missing", async () => {
    const res = await request(app).post("/api/google-login").send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Token is required");
  });
});
