import { InputType, Field, Int } from "type-graphql";
import { Author } from "../../../models/Author";
import { Edition } from "../../../models/Edition";

@InputType()
export class CreateUserInput {
  @Field(() => String)
  username: string;

  @Field(() => Boolean)
  enabled: boolean;

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => String)
  email: string;

  @Field(() => [String])
  realmRoles: string[];

}