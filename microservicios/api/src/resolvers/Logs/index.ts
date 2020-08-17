import { Resolver, Query, Arg, Subscription, Root, Args } from "type-graphql";

import { Log, PaginatedLogs } from '../../models/Log'
import {  Between } from "typeorm";

@Resolver()
export class LogResolver {
  @Query(() => PaginatedLogs)
  async logs(
    @Arg("limit", { nullable: true }) limit: number,
    @Arg("offset", { nullable: true }) offset: number,
    @Arg("timeStart", { nullable: true }) timeStart: number,
    @Arg("timeEnd", { nullable: true }) timeEnd: number): Promise<PaginatedLogs> {
    let logs: Log[];
    let count: number;
    if (offset && limit) {
      logs = await Log.find({ where: { unixStartTime: Between(timeStart || Date.now() - 604800000, timeEnd || Date.now())} , order: { unixStartTime: "DESC" } })
      count = logs.length
      logs = logs.slice(offset, offset + limit + 1)
    }
    else {
      logs = await Log.find({ where: { unixStartTime: Between(timeStart || Date.now() - 604800000, timeEnd || Date.now())} , order: { unixStartTime: "DESC" } })
      count = logs.length
    }

      return {
      count,
      limit: limit ||  logs.length,
      offset: offset || 0,
      items: logs
    }
  }

  @Subscription({ topics: "NEW_LOG" })
  logsSubscription(
    @Root() log: Log,
  ): Log {
    return log;
  }
}
