import axios from 'axios'
import UserRepresentation from 'keycloak-admin/lib/defs/userRepresentation'

const keycloakLocalUrl = process.env.KEYCLOAK_LOCAL_URL || 'http://keycloak:8080/auth'
const keycloakRealm = process.env.KEYCLOAK_RELM || 'fullstack'

export const verifyKeycloakToken = async (token: string) : Promise<UserRepresentation> => {
      const url = `${keycloakLocalUrl}/realms/${keycloakRealm}/protocol/openid-connect/userinfo`
      const resp = await axios.get(url, {
        headers: {
          Authorization: token,
        }
      })

      if (resp.status !== 200) throw Error(`unauthorized`)
      return {} as UserRepresentation
}