import Koa from "koa";
import { getMongoDB } from "../config";

export async function MongoMiddleware(
  ctx: Koa.Context,
  next: () => Promise<any>
) {
  ctx.state.mongoDB = await getMongoDB();
  await next();
}
