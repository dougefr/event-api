import Router from "koa-router";
import { autocomplete, createOne, timeline } from "./event.controller";

export const EventRouter = new Router({
  prefix: "/events"
})
  .post("/", createOne)
  .get("/autocomplete", autocomplete)
  .get("/timeline", timeline);
