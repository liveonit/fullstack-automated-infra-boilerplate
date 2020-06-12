import { Resolver, Query, Arg, Subscription, Root, Args } from "type-graphql";

import { Log, PaginateLogs } from '../../models/Log'
import {  Between } from "typeorm";

@Resolver()
export class LogResolver {
  @Query(() => PaginateLogs)
  async logs(
    @Arg("limit", { nullable: true }) limit: number,
    @Arg("offset", { nullable: true }) offset: number,
    @Arg("timeStart", { nullable: true }) timeStart: number,
    @Arg("timeEnd", { nullable: true }) timeEnd: number): Promise<PaginateLogs> {
    let logs;
    if (offset && limit) {
      logs = await Log.find({ skip: offset, take: limit, where: { unixStartTime: Between(timeStart || Date.now() - 604800000, timeEnd || Date.now())} , order: { unixStartTime: "DESC" } })
    }
    else {

      logs = await Log.find({ where: { unixStartTime: Between(timeStart || Date.now() - 604800000, timeEnd || Date.now())} , order: { unixStartTime: "DESC" } })
    }
    
      return {
      count: logs.length,
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