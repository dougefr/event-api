import Koa from "koa";
import { env, logger } from "../config";

export async function LoggerMiddleware(
  ctx: Koa.Context,
  next: () => Promise<any>
) {
  if (env.isDevelopment) {
    logger.info(`${ctx.method} ${ctx.url}`);
  }

  await next();
}
