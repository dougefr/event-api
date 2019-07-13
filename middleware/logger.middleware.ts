import Koa from "koa";
import { logger } from "../config";

export async function LoggerMiddleware(
  ctx: Koa.Context,
  next: () => Promise<any>
) {
  logger.info(`${ctx.method} ${ctx.url}`);
  await next();
}
