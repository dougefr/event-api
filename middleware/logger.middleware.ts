import Koa from "koa";
import { logger } from "../config";
import env from "../config/env.config";

export async function LoggerMiddleware(
  ctx: Koa.Context,
  next: () => Promise<any>
) {
  if (!env.isTest) {
    logger.info(`${ctx.method} ${ctx.url}`);
  }

  await next();
}
