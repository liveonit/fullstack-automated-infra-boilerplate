import { InputType, Field } from "type-graphql";

@InputType()
export class UpdateEditionInput {
  @Field({ nullable: true })
  code?: string;

  @Field({ nullable: true })
  date?: Date;

  @Field({ nullable: true })
  bookId?: number;
}