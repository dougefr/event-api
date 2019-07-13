import { Db, MongoClient } from "mongodb";
import supertest from "supertest";
import server from "../..";

describe("/events", () => {
  let request: supertest.SuperTest<supertest.Test>;

  beforeAll(() => {
    request = supertest(server);
  });

  afterAll(() => {
    server.close();
  });

  describe("PUT /events", () => {
    test("Should create one", async () => {
      const event = { event: "buy", timestamp: new Date() };

      const res = await request
        .post("/events")
        .set("content-type", "application/json")
        .send(event);

      expect(res.status).toBe(201);
      expect(res.body._id).toBeDefined();
      expect(res.body._id).not.toBeNull();
      expect(res.body.event).toBe(event.event);
      expect(res.body.timestamp).toBe(event.timestamp.toISOString());
    });

    test("Should occur error when sending an invalid object", async () => {
      const event = { event1: "buy", timestamp1: new Date() };

      const res = await request
        .post("/events")
        .set("content-type", "application/json")
        .send(event);

      expect(res.status).toBe(400);
    });

    test("Should occur error when sending nothing", async () => {
      const res = await request
        .post("/events")
        .set("content-type", "application/json");

      expect(res.status).toBe(400);
    });
  });
});
