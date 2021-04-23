import { String } from "lodash";

export interface IUser {
  auth_time: Date;
  email: string;
  email_verified: boolean;
  exp: number;
  family_name: string;
  given_name: string;
  name: "Administrator User";
  preferred_username: "admin"
  roles: string[];
}



export const getToken = (): string => {
  console.log(window.k)
  if (window.k !== undefined) return window.k.token;
  return '';
}

export const updateToken = async (seconds: number) => {
  try {
    if (window.k !== undefined) {
      await window.k.updateToken(seconds)
    }
  }
  catch {
    alert('Failed to refresh token');
  }
}

export const logout = () => {
  window.k.logout();
}

export const getUserRoles = (): String[] => {
  const base64Payload = getToken().split('.')[1];
  const payload = JSON.parse(atob(base64Payload))
  return (payload.realm_access && payload.realm_access.roles)
    ? payload.realm_access.roles
    : []
}


export const getUserInfo = (): IUser => {
  const base64Payload = getToken().split('.')[1];
  const payload = JSON.parse(atob(base64Payload))
  const roles = (payload.realm_access && payload.realm_access.roles)
    ? payload.realm_access.roles
    : []
  const reduced: IUser = { ...payload, roles }
  return reduced
}