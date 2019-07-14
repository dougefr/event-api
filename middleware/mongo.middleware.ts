import Koa from "koa";
import { Db } from "mongodb";

export function MongoMiddlewareFactory(db: Db) {
  return async function MongoMiddleware(
    ctx: Koa.Context,
    next: () => Promise<any>
  ) {
    ctx.state.mongoDB = db;
    await next();
  };
}
