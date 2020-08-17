import KcAdminClient from 'keycloak-admin';
import { ConnectionConfig } from 'keycloak-admin/lib/client';

const keycloakRealm = process.env.KEYCLOAK_RELM || 'fullstack'
const keycloakUser = process.env.KEYCLOAK_USER || 'admin'
const keycloakPassword = process.env.KEYCLOAK_PASSWORD || 'admin'
const keycloakLocalUrl = process.env.KEYCLOAK_LOCAL_URL || 'http://keycloak:8080/auth'
const connConfig: ConnectionConfig = {
  baseUrl: keycloakLocalUrl,
  realmName: "master"
}

export const kcAdminConn: () => Promise<KcAdminClient | undefined> = async () => {
  const kcAdminClient = new KcAdminClient(connConfig);
  try {
    await kcAdminClient.auth({
      username: keycloakUser,
      password: keycloakPassword,
      grantType: 'password',
      clientId: 'admin-cli',
    });
    kcAdminClient.setConfig({
      realmName: keycloakRealm,
    });
    return kcAdminClient;
  } catch (err) {
    console.error("Error: Can't connect with keycloak admin-cli. ", err);
    return undefined;
  }
}

  // const users = await kcAdminClient.users.find();

  // const cl = await kcAdminClient.clients.find()
  // const clientAccount = cl.find(c => c.clientId === 'account')
  // const clientSecAdmCons = cl.find(c => c.clientId === 'security-admin-console')

  // await kcAdminClient.clients.update({ id: clientAccount.id }, { ...clientAccount, enabled: true })
  // await kcAdminClient.clients.update({ id: clientSecAdmCons.id }, { ...clientSecAdmCons, enabled: true })
  // const updCls = await kcAdminClient.clients.find();

  // console.log(updCls);


  // const groups = await kcAdminClient.roles.find();
