import KcAdminClient from 'keycloak-admin';
import { ConnectionConfig } from 'keycloak-admin/lib/client';

const keycloakRealm = process.env.KEYCLOAK_RELM || 'fullstack'
const keycloakUser = process.env.KEYCLOAK_USER || 'keycloak'
const keycloakPassword = process.env.KEYCLOAK_PASSWORD || 'keycloakPass'
const keycloakLocalUrl = process.env.KEYCLOAK_LOCAL_URL || 'http://keycloak:8080/auth'
const connConfig: ConnectionConfig = {
  baseUrl: keycloakLocalUrl,
    realmName: "master"
}

const kcAdminClient = new KcAdminClient(connConfig);

(async () => {
await kcAdminClient.auth({
  username: keycloakUser,
  password:  keycloakPassword,
  grantType: 'password',
  clientId: 'admin-cli',
});

const users = await kcAdminClient.users.find();
//console.log(users);


const cl = await kcAdminClient.clients.find()
const clientAccount = cl.filter(c => c.clientId == 'account')[0]
const clientSecAdmCons = cl.filter(c => c.clientId == 'security-admin-console')[0]

await kcAdminClient.clients.update({ id: clientAccount.id }, { ...clientAccount, enabled: true })
await kcAdminClient.clients.update({ id: clientSecAdmCons.id }, { ...clientSecAdmCons, enabled: true })
const updCls = await kcAdminClient.clients.find();

console.log(updCls);

kcAdminClient.setConfig({
  realmName: keycloakRealm,
});

const groups = await kcAdminClient.roles.find();
//console.log(groups);
})()