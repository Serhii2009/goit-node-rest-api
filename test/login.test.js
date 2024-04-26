import mongoose from "mongoose";
import request from "supertest";

import app from "../app.js";

describe("Test Login Controller", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DB_HOST);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("should return status code 200", async () => {
    const response = await request(app).post("/users/login").send({
      email: "elenaa@mail.com",
      password: "123456",
    });
    expect(response.status).toBe(200);
  });

  test("should return a token in the response", async () => {
    const response = await request(app).post("/users/login").send({
      email: "elenaa@mail.com",
      password: "123456",
    });
    expect(response.body.token).toBeDefined();
  });

  test("should return a user object with email and subscription fields as strings", async () => {
    const response = await request(app).post("/users/login").send({
      email: "elenaa@mail.com",
      password: "123456",
    });
    expect(response.body.user).toHaveProperty("email");
    expect(response.body.user).toHaveProperty("subscription");
    expect(typeof response.body.user.email).toBe("string");
    expect(typeof response.body.user.subscription).toBe("string");
  });
});
