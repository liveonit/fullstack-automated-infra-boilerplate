import { InputType, Field, Int } from "type-graphql";

@InputType()
export class UpdateUserInput {
  @Field(() => String,{ nullable: true })
  username?: string;

  @Field(() => Boolean,{ nullable: true })
  enabled?: boolean;

  @Field(() => String,{ nullable: true })
  firstName?: string;

  @Field(() => String, { nullable: true })
  lastName?: string;

  @Field(() => String,{ nullable: true })
  email?: string;

  @Field(() => [String],{ nullable: true })
  realmRoles?: string[];
}