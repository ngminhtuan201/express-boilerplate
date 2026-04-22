import express from "express";
import request from "supertest";
import { healthRouter } from "../health.route";

describe("Health Route Integration", () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use("/api/health", healthRouter);
  });

  it("should return 200 OK and health status", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: "Server is healthy",
      data: null,
    });
  });
});
