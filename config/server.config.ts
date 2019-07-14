import http from "http";
import Koa from "koa";
import koaBody from "koa-body";
import { connectToMongo } from ".";
import * as api from "../api";
import { LoggerMiddleware, MongoMiddlewareFactory } from "../middleware";
import { ICustomState } from "../type";

export async function createServer() {
  const app = new Koa<ICustomState>();

  // Adiciona middlewares
  app.use(koaBody());
  app.use(LoggerMiddleware);
  app.use(MongoMiddlewareFactory(await connectToMongo()));

  // Adiciona rotas
  app.use(api.EventRouter.routes());

  // Inicializa o servidor
  const server = http.createServer(app.callback());
  server.listen(3000);

  return server;
}
