import { InputType, Field, Int } from "type-graphql";

@InputType()
export class UpdateUserInput {
  @Field(() => String)
  username?: string;

  @Field(() => Boolean)
  enabled?: boolean;

  @Field(() => String)
  email?: string;

  @Field(() => String)
  federationLink?: string;

  @Field(() => String)
  firstName?: string;

  @Field(() => [String])
  groups?: string[];

  @Field(() => String)
  lastName?: string;

  @Field(() => [String])
  realmRoles?: string[];
}