import { InputType, Field, Int } from "type-graphql";

@InputType()
export class UpdateBookInput {
  @Field({ nullable: true })
  title?: string;

  @Field(type => Int, { nullable: true })
  authorId?: number;

  @Field({ nullable: true })
  isPublished?: boolean;
}