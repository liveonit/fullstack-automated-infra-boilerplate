import { InputType, Field } from "type-graphql";

@InputType()
export class CreateEditionInput {
  @Field()
  code: string;

  @Field({ nullable: true})
  date?: Date;

  @Field()
  bookId: number;
}