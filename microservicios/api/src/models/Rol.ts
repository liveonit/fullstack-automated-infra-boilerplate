import { ObjectType, Field, Int } from "type-graphql";
import PaginatedResponse from "../utils/PaginateEntity";

// NOT IN DB - ONLY REPRESENTATION

@ObjectType()
export class Rol {

  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

}

@ObjectType()
export class PaginateRoles extends PaginatedResponse(Rol) { };