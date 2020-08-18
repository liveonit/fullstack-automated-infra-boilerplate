import { ObjectType, Field, Int } from "type-graphql";
import PaginatedResponse from "../utils/PaginateEntity";
import UserRepresentation from "keycloak-admin/lib/defs/userRepresentation";
import { RequiredActionAlias } from "keycloak-admin/lib/defs/requiredActionProviderRepresentation";
import UserConsentRepresentation from "keycloak-admin/lib/defs/userConsentRepresentation";
import CredentialRepresentation from "keycloak-admin/lib/defs/credentialRepresentation";
import FederatedIdentityRepresentation from "keycloak-admin/lib/defs/federatedIdentityRepresentation";

// NOT IN DB - ONLY REPRESENTATION

@ObjectType()
export class User implements UserRepresentation {
  @Field(()=> String)
  id?: string;

  @Field(() => Int)
  createdTimestamp?: number;

  @Field(() => String)
  username?: string;

  @Field(() => Boolean)
  enabled?: boolean;

  @Field(() => Boolean)
  totp?: boolean;

  @Field(() => Boolean)
  emailVerified?: boolean;

  @Field(() => [String])
  disableableCredentialTypes?: string[];

  @Field(() => [String])
  requiredActions?: RequiredActionAlias[];

  @Field(() => Int)
  notBefore?: number;

  @Field(() => String)
  email?: string;


  @Field(() => String)
  federationLink?: string;

  @Field(() => String)
  firstName?: string;

  @Field(() => [String])
  groups?: string[];

  @Field(() => String)
  lastName?: string;

  @Field(() => String)
  origin?: string;

  @Field(() => [String])
  realmRoles?: string[];

  @Field(() => String)
  self?: string;

  @Field(() => String)
  serviceAccountClientId?: string;
}

@ObjectType()
export class PaginatedUsers extends PaginatedResponse(User) { };