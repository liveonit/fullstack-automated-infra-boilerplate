import { client } from "./GqlClient"

export const getCachedItems = (entity: string) => {
  const serializedState = client.cache.extract()
  const result: any[] = [];
  for (var [k, v] of Object.entries(serializedState)) if (k.indexOf(entity + ":") >= 0) result.push(v);
  return result;
}