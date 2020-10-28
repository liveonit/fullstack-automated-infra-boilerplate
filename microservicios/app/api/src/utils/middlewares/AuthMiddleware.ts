import { MiddlewareFn } from "type-graphql";
import { verifyKeycloakToken } from '../helpers/Auth'
import { Request, Response, NextFunction } from "express";
import UserRepresentation from "keycloak-admin/lib/defs/userRepresentation";

export interface MyContext {
  req: Request;
  res: Response;
  payload?: UserRepresentation;
}

export const idAuthMiddleware: MiddlewareFn<MyContext> = async ({ context }, next: NextFunction) => {
  const authorization = context.req.headers["authorization"];

  if (!authorization) {
    throw new Error("unauthorized");
  }

  try {
    const payload: UserRepresentation = await verifyKeycloakToken(authorization);
    context.payload = payload;
  } catch (err) {
    console.log(err);
    throw Error("unauthorized")
  }
  return next();
};