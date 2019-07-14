import supertest from "supertest";
import server from "../..";

describe("/events", () => {
  let request: supertest.SuperTest<supertest.Test>;

  async function createOneRandomEvent() {
    const randomEvent = Math.random()
      .toString(36)
      .substring(7);
    const event = { event: randomEvent, timestamp: new Date() };
    const res = await createOneEvent(event);

    return { res, event };
  }

  async function createOneEvent(event: any) {
    return request
      .post("/events")
      .set("content-type", "application/json")
      .send(event);
  }

  beforeAll(() => {
    request = supertest(server);
  });

  afterAll(() => {
    server.close();
  });

  describe("PUT /events", () => {
    test("Should create one", async () => {
      const { res, event } = await createOneRandomEvent();

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

  describe("GET /events/autocomplete", () => {
    test("Should find a event sending two letters", async () => {
      const { event } = await createOneRandomEvent();
      const search = event.event.substr(0, 2);

      const res = await request.get(`/events/autocomplete?q=${search}`);

      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBeGreaterThan(0);

      res.body.forEach((e: any) => {
        expect(e.event).toBeDefined();
        expect(e.event.search(search)).toBeGreaterThanOrEqual(0);
      });
    });

    test("Should find nothing if sending less then two letters", async () => {
      const { event } = await createOneRandomEvent();
      const search = event.event.substr(0, 1);

      const res = await request.get(`/events/autocomplete?q=${search}`);

      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBe(0);
    });

    test("Should find nothing if sending nothing", async () => {
      const { event } = await createOneRandomEvent();

      const res = await request.get(`/events/autocomplete?q=`);

      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBe(0);
    });

    test("Should find a maximum of 10 results", async () => {
      const { event } = await createOneRandomEvent();

      for (let i = 0; i < 50; i++) {
        await createOneEvent(event);
      }

      const search = event.event.substr(0, 2);

      const res = await request.get(`/events/autocomplete?q=${search}`);

      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBe(10);

      res.body.forEach((e: any) => {
        expect(e.event).toBeDefined();
        expect(e.event.search(search)).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe("GET /events/timeline", () => {
    test("Should return a timeline", async () => {
      const res = await request.get("/events/timeline");

      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
      expect(res.body).toEqual({
        timeline: [
          {
            products: [{ name: "Tenis Preto", price: 120 }],
            revenue: 120.0,
            store_name: "BH Shopping",
            timestamp: "2016-10-02T11:37:31.2300892-03:00",
            transaction_id: "3409340"
          },
          {
            products: [
              { name: "Camisa Azul", price: 100 },
              { name: "Calça Rosa", price: 150 }
            ],
            revenue: 250.0,
            store_name: "Patio Savassi",
            timestamp: "2016-09-22T13:57:31.2311892-03:00",
            transaction_id: "3029384"
          }
        ]
      });
    });
  });
});
