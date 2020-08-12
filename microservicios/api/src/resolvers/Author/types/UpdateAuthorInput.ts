import { InputType, Field, Int } from "type-graphql";
import { Author } from "../../../models/Author";

@InputType()
export class UpdateAuthorInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  country?: string;

  @Field(type => Int, { nullable: true })
  age?: number;
}