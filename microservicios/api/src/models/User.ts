import { ObjectType, Field, Int } from "type-graphql";
import PaginatedResponse from "../utils/PaginateEntity";
import { Rol } from './Rol'
import UserRepresentation from "keycloak-admin/lib/defs/userRepresentation";
import { RequiredActionAlias } from "keycloak-admin/lib/defs/requiredActionProviderRepresentation";
import UserConsentRepresentation from "keycloak-admin/lib/defs/userConsentRepresentation";
import CredentialRepresentation from "keycloak-admin/lib/defs/credentialRepresentation";
import FederatedIdentityRepresentation from "keycloak-admin/lib/defs/federatedIdentityRepresentation";
// NOT IN DB - ONLY REPRESENTATION

@ObjectType()
export class User implements UserRepresentation {
  id?: string;
  createdTimestamp?: number;
  username?: string;
  enabled?: boolean;
  totp?: boolean;
  emailVerified?: boolean;
  disableableCredentialTypes?: string[];
  requiredActions?: RequiredActionAlias[];
  notBefore?: number;
  access?: Record<string, boolean>;
  attributes?: Record<string, any>;
  clientConsents?: UserConsentRepresentation[];
  clientRoles?: Record<string, any>;
  credentials?: CredentialRepresentation[];
  email?: string;
  federatedIdentities?: FederatedIdentityRepresentation[];
  federationLink?: string;
  firstName?: string;
  groups?: string[];
  lastName?: string;
  origin?: string;
  realmRoles?: string[];
  self?: string;
  serviceAccountClientId?: string;
}

@ObjectType()
export class PaginatedUsers extends PaginatedResponse(User) { };