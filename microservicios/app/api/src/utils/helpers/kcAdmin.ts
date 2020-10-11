import KcAdminClient from 'keycloak-admin';
import { ConnectionConfig } from 'keycloak-admin/lib/client';
import { User } from '../../models/User';

const keycloakRealm = process.env.KEYCLOAK_RELM || 'fullstack'
const keycloakUser = process.env.KEYCLOAK_USER || 'keycloak'
const keycloakPassword = process.env.KEYCLOAK_PASSWORD || 'keycloakPass'
const keycloakLocalUrl = process.env.KEYCLOAK_LOCAL_URL || 'http://keycloak:8080/auth'
const keycloakClientID = "dashboard";
const connConfig: ConnectionConfig = {
  baseUrl: keycloakLocalUrl,
  realmName: "master"
}


export const kcConnect: () => Promise<KcAdminClient | undefined> = async () => {
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

export const getRoles = async () => {
  const kcAdmin = await kcConnect();
  const roles = await kcAdmin.roles.find();
  return roles
}

export const getUsers = async () => {
  const kcAdmin = await kcConnect();
  const users = await kcAdmin.users.find();
  return users
}

export const getUsersWithRoles = async () => {
  const kcAdmin = await kcConnect();
  const users = await kcAdmin.users.find();
  const userWithRoles = await Promise.all(users.map(async u => {
    const roles = (await kcAdmin.users.listRealmRoleMappings({ id: u.id }))
    delete u.access;
    return { ...u, roles } as User
  }));
  return userWithRoles;
}

export const getUserWithRoles = async (id: string) => {
  const kcAdmin = await kcConnect();
  const user = await kcAdmin.users.findOne({ id });
  const realmRoles = (await kcAdmin.users.listRealmRoleMappings({ id })).map(r => r.name);
  delete user.access;
  return { ...user, realmRoles } as User;
}

if (require.main === module) {
  (async () => {
    const roles = await getRoles();
    const users = await getUsers();
    const userWithRoles = await getUsersWithRoles();
    console.log(roles);
    console.log(users);
    console.log(userWithRoles);
  })()
}
