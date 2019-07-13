import http from "http";
import Koa from "koa";
import koaBody from "koa-body";
import * as api from "./api";
import { LoggerMiddleware, MongoMiddleware } from "./middleware";
import { ICustomState } from "./type";

const app = new Koa<ICustomState>();

// Adiciona middlewares
app.use(koaBody());
app.use(LoggerMiddleware);
app.use(MongoMiddleware);

// Adiciona rotas
app.use(api.EventRouter.routes());

// Inicializa o servidor
const server = http.createServer(app.callback());
server.listen(3000);

export default server;
