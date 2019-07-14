import Router from "koa-router";
import { autocomplete, createOne } from "./event.controller";

export const EventRouter = new Router({
  prefix: "/events"
})
  .post("/", createOne)
  .get("/autocomplete", autocomplete);
