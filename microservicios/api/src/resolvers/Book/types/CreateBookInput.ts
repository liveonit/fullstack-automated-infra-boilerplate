import { InputType, Field } from "type-graphql";

@InputType()
export class CreateBookInput {
  @Field({nullable: true})
  title: string;

  @Field()
  authorId: number;

  @Field({ defaultValue: true })
  isPublished: boolean;
}