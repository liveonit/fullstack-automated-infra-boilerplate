import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, AfterInsert } from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";
import PaginatedResponse from "../utils/PaginateEntity";
import { pubsub } from '../'
@Entity()
@ObjectType()
export class Log extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column({ nullable: false })
  operation: string;

  @Field(() => String)
  @Column({ nullable: false })
  operationType: string;

  @Field(() => String)
  @Column({ nullable: true })
  payload: string;

  @Field(() => Number)
  @Column({ type: "bigint" })
  unixStartTime: number;

  @Field(() => Number)
  @Column({ nullable: false })
  executionTime: number;

  @Field(() => String)
  @Column({ nullable: true })
  resultPayload: string;

  @AfterInsert()
  pushNotificationNewLog() {
    pubsub.publish("NEW_LOG", this);
  }
}

@ObjectType()
export class PaginatedLogs extends PaginatedResponse(Log) { };