import KcAdminClient from 'keycloak-admin';
import { ConnectionConfig } from 'keycloak-admin/lib/client';

const keycloakRealm = process.env.KEYCLOAK_RELM || 'fullstack'
const keycloakUser = process.env.KEYCLOAK_USER || 'keycloak'
const keycloakPassword = process.env.KEYCLOAK_PASSWORD || 'keycloakPass'
const keycloakLocalUrl = process.env.KEYCLOAK_LOCAL_URL || 'http://keycloak:8080/auth'
const keycloakClientID = "dashboard";
const connConfig: ConnectionConfig = {
  baseUrl: keycloakLocalUrl,
  realmName: "master"
}


const kcConnect: () => Promise<KcAdminClient | undefined> = async () => {
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
    console.error("Can't connect with keylocak admin. Error: ", err);
  }
}

const getRoles = async () => {
  const kcAdmin = await kcConnect();
  const roles = await kcAdmin.roles.find();
  return roles
}

const getUsers = async () => {
  const kcAdmin = await kcConnect();
  const users = await kcAdmin.users.find();
  return users
}

const getUserWithRoles = async () => {
  const kcAdmin = await kcConnect();
  const users = await kcAdmin.users.find();
  const userWithRoles =  await Promise.all(users.map(async u => {
    const userRoles = await kcAdmin.users.listRealmRoleMappings({ id: u.id })
    return {...u, roles: userRoles.map(r => r.name)}
  }));
  return userWithRoles;
}

if (require.main === module) {
  (async () => {
    const roles = await getRoles();
    const users = await getUsers();
    const userWithRoles = await getUserWithRoles();
    console.log(roles);
    console.log(users);
    console.log(userWithRoles);
  })()
}
