import { ObjectType, Field, Int } from "type-graphql";
import PaginatedResponse from "../utils/PaginateEntity";
import UserRepresentation from "keycloak-admin/lib/defs/userRepresentation";
import { RequiredActionAlias } from "keycloak-admin/lib/defs/requiredActionProviderRepresentation";

// NOT IN DB - ONLY REPRESENTATION

@ObjectType()
export class User implements UserRepresentation {
  @Field(()=> String)
  id?:string;

  @Field(() => String)
  username: string;

  @Field(() => String, {nullable: true})
  password?: string;

  @Field(() => Boolean)
  enabled: boolean;

  @Field(() => Boolean)
  totp: boolean;

  @Field(() => Boolean)
  emailVerified: boolean;

  @Field(() => String)
  firstName?: string;

  @Field(() => String)
  lastName?: string;

  @Field(() => String)
  email?: string;

  @Field(() => [String])
  disableableCredentialTypes?: string[];

  @Field(() => [String])
  requiredActions?: RequiredActionAlias[];

  @Field(() => Int)
  notBefore?: number;

  @Field(() => [String])
  realmRoles?: string[];
}

@ObjectType()
export class PaginatedUsers extends PaginatedResponse(User) { };