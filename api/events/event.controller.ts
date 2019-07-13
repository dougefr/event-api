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

export const createOne = async (ctx: ICustomContext) => {
  try {
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
  } catch (err) {
    logger.error(err);
    ctx.status = 500;
  }
};
