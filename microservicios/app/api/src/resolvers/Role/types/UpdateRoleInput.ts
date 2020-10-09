import { InputType, Field } from "type-graphql";

@InputType()
export class UpdateRoleInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  description?: string;
}