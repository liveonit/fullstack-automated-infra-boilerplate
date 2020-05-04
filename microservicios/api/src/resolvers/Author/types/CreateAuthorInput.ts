import { InputType, Field } from "type-graphql";
import { Author } from "../../../models/Author";
import { Edition } from "../../../models/Edition";

@InputType()
export class CreateAuthorInput {
  
  @Field()
  name: string;

  @Field({ nullable: true })
  country?: string;

  @Field()
  age: number;
}