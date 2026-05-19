const request = require("supertest");
const app = require("../app");

describe("LOGOUT ROUTE", () => {
  it("POST /api/logout - should logout user", async () => {
    const res = await request(app).post("/api/logout");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Logout successfully");
  });
});
