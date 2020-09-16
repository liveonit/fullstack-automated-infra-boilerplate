import { InputType, Field } from "type-graphql";

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