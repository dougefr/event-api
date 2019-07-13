import Router from "koa-router";
import { createOne } from "./event.controller";

export const EventRouter = new Router({
  prefix: "/events"
})
  .post("/", createOne)
  .get("/", createOne);
