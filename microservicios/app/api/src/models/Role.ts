import { ObjectType, Field } from "type-graphql";
import RoleRepresentation from "keycloak-admin/lib/defs/roleRepresentation";


// NOT IN DB - ONLY REPRESENTATION

@ObjectType()
export class Role implements RoleRepresentation {
  @Field(()=> String)
  id?: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  description?: string;
}