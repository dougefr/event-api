import Avj from "ajv";
import axios from "axios";
import {
  ICustomContext,
  IDitoQuestionsEvent,
  IDitoQuestionsEvents,
  ITimelineResponse
} from "../../type";

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

export async function timeline(ctx: ICustomContext) {
  const res = await axios.get<IDitoQuestionsEvents>(
    "https://storage.googleapis.com/dito-questions/events.json"
  );

  if (res.status === 200) {
    ctx.status = 200;
    ctx.body = processResponse();
  } else {
    throw new Error(`Remote API returned ${res.status} status code`);
  }

  function processResponse() {
    return {
      timeline: res.data.events
        .map(transformData)
        .reduce(groupByTransactionId, [])
        .map(mergeEvents)
        .sort(sortByTimestamp)
    };
  }

  function transformData(data: IDitoQuestionsEvent): ITimelineResponse {
    const extractFromCustomData = (key: string) =>
      data.custom_data
        .filter(d => d.key === key)
        .map(d => d.value)
        .shift();

    return {
      products: [
        {
          name: extractFromCustomData("product_name") as string,
          price: extractFromCustomData("product_price") as number
        }
      ],
      revenue: data.revenue,
      store_name: extractFromCustomData("store_name") as string,
      timestamp: data.timestamp,
      transaction_id: extractFromCustomData("transaction_id") as string
    };
  }

  function groupByTransactionId(
    prev: ITimelineResponse[][],
    curr: ITimelineResponse
  ) {
    const arr = prev.find(e => e[0].transaction_id === curr.transaction_id);

    if (arr) {
      arr.push(curr);
    } else {
      prev.push([curr]);
    }

    return prev;
  }

  function mergeEvents(toMerge: ITimelineResponse[]) {
    return toMerge.reduce((prev, curr) => {
      return {
        products: prev.products.concat(curr.products || []).filter(p => p.name),
        revenue: prev.revenue || curr.revenue,
        store_name: prev.store_name || curr.store_name,
        timestamp:
          prev.timestamp < curr.timestamp ? prev.timestamp : curr.timestamp,
        transaction_id: prev.transaction_id || curr.transaction_id
      };
    });
  }

  function sortByTimestamp(a: ITimelineResponse, b: ITimelineResponse) {
    return a.timestamp < b.timestamp ? 1 : -1;
  }
}
