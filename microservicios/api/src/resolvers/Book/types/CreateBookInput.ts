import { InputType, Field } from "type-graphql";
import { Author } from "../../../models/Author";
import { Edition } from "../../../models/Edition";

@InputType()
export class CreateBookInput {
  @Field({nullable: true})
  title: string;

  @Field()
  authorId: number;

  @Field({ defaultValue: true })
  isPublished: boolean;
}