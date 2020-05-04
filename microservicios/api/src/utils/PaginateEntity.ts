import { ObjectType, Field, ClassType } from "type-graphql";


export default function PaginatedResponse<TItem>(TItemClass: ClassType<TItem>) {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedResponseClass {

  @Field(() => Number)
  count: number;

  @Field(() => Number)
  limit: number;

  @Field(() => Number)
  offset: number;
  
  @Field(() => [TItemClass])
  items: TItem[]
  }
  return PaginatedResponseClass;
  
}
