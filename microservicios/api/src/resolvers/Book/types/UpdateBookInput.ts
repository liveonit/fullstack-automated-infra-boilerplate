import { InputType, Field } from "type-graphql";
import { Author } from "../../../models/Author";

@InputType()
export class UpdateBookInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  authorId?: number;

  @Field({ nullable: true })
  isPublished?: boolean;
}