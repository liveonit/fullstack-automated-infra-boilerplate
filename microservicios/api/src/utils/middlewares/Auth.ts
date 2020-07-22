import axios from 'axios'

const keycloakLocalUrl = process.env.KEYCLOAK_LOCAL_URL || 'http://keycloak:8080/auth'
const keycloakRealm = process.env.KEYCLOAK_RELM || 'fullstack'

export const verifyKeycloakToken = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const url = `${keycloakLocalUrl}/realms/${keycloakRealm}/protocol/openid-connect/userinfo`
      const resp = await axios.get(url, {
        headers: {
          Authorization: req.headers.authorization,
        }
      })

      if (resp.status !== 200) return res.status(401).json({
        error: `unauthorized`,
      })
      else next()
    }
    else throw Error("Error: authorization token is not defined in headers, and is required!")

  } catch (err) {
    console.error(err);
    res.status(401).json({
      error: `unauthorized`,
    });
  }
}