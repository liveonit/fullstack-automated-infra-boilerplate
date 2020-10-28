import axios from 'axios'
import UserRepresentation from 'keycloak-admin/lib/defs/userRepresentation'
import { AuthChecker } from 'type-graphql'

const keycloakLocalUrl = process.env.KEYCLOAK_LOCAL_URL || 'http://keycloak:8080/auth'
const keycloakRealm = process.env.KEYCLOAK_RELM || 'fullstack'

export const verifyKeycloakToken = async (token: string): Promise<UserRepresentation> => {
  const url = `${keycloakLocalUrl}/realms/${keycloakRealm}/protocol/openid-connect/userinfo`
  const resp = await axios.get(url, {
    headers: {
      Authorization: token,
    }
  })

  if (resp.status !== 200) throw Error(`unauthorized`)
  return {} as UserRepresentation
}

export const keycloakCustomAuthChecker: AuthChecker = () => {
  // here we can read the user from context
  // and check his permission in the db against the `roles` argument
  // that comes from the `@Authorized` decorator, eg. ["ADMIN", "MODERATOR"]

  return true; // or false if access is denied
};