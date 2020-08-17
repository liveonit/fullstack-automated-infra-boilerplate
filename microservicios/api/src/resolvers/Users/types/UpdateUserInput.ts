import { InputType, Field, Int } from "type-graphql";

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  country?: string;

  @Field(type => Int, { nullable: true })
  age?: number;
}