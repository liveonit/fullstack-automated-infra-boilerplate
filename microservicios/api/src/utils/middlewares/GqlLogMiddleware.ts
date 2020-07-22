import { MiddlewareFn } from "type-graphql";
import { Log } from '../../models/Log'

export const GqlLog: MiddlewareFn = async ({ context, info, args }, next) => {
  const start = Date.now();
  let result;
  try {
    result = await next();
  } catch(err) {
    console.error(err);
    result = { ...(result || {}) , catchErr: err }
  } finally {
    const resolveTime = Date.now() - start;
    const log = {
      operation: info.fieldName.toString(),
      operationType: info.operation.operation,
      payload: JSON.stringify(args),
      unixStartTime: start,
      executionTime: resolveTime,
      resultPayload: JSON.stringify(result),
    }
    console.info("logger: ", {
      ...log,
      startTime: new Date(log.unixStartTime),
      payload: JSON.parse(log.payload),
      resultPayload: JSON.parse(log.resultPayload)
    });
    Log.create(log).save()
    return result;
  }
};