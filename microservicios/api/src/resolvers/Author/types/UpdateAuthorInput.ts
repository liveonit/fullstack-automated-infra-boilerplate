import { InputType, Field } from "type-graphql";
import { Author } from "../../../models/Author";

@InputType()
export class UpdateAuthorInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  country?: string;

  @Field({ nullable: true })
  age?: number;
}