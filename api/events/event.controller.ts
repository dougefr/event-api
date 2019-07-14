import Avj from "ajv";
import { logger } from "../../config";
import { ICustomContext } from "../../type";

const validateEvent = new Avj().compile({
  additionalProperties: false,
  properties: {
    _id: { type: "string" },
    event: { type: "string" },
    timestamp: { type: "string" }
  },
  required: ["event", "timestamp"]
});

export async function createOne(ctx: ICustomContext) {
  const { body } = ctx.request;

  if (validateEvent(body)) {
    const events = ctx.state.mongoDB.collection("events");
    const res = await events.insertOne(body);

    // Return the stored event
    ctx.body = await events.findOne(res.insertedId);
    ctx.status = 201;
  } else {
    ctx.status = 400;
  }
}

export async function autocomplete(ctx: ICustomContext) {
  const { q } = ctx.request.query;

  if (q && q.length >= 2) {
    const events = ctx.state.mongoDB.collection("events");
    ctx.body = await events
      .find({ event: new RegExp(q, "i") })
      .limit(10)
      .toArray();
  } else {
    ctx.body = [];
  }
}
