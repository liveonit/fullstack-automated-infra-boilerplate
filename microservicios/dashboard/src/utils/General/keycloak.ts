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
  return (payload.resource_access && payload.resource_access.dashboard && payload.resource_access.dashboard.roles)
    ? payload.resource_access.dashboard.roles
    : []
}


export const getUserInfo = (): IUser => {
  const base64Payload = getToken().split('.')[1];
  const payload = JSON.parse(atob(base64Payload))
  const roles = (payload.resource_access &&
    payload.resource_access.dashboard &&
    payload.resource_access.dashboard.roles)
    ? payload.resource_access.dashboard.roles
    : []
  const reduced: IUser = { ...payload, roles }
  return reduced
}