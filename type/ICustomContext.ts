import { ParameterizedContext } from "koa";
import { ICustomState } from ".";

export interface ICustomContext extends ParameterizedContext<ICustomState> {}
