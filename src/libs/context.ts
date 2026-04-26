import { AsyncLocalStorage } from "async_hooks";

export interface IRequestContext {
  requestId: string;
  userId?: string;
}

export const requestContext = new AsyncLocalStorage<IRequestContext>();

export const getRequestContext = (): IRequestContext | undefined => {
  return requestContext.getStore();
};
