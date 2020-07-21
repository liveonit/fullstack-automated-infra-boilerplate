export const getToken = () : String => {
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

export const getUserRoles = () : String[]  => {
  const base64Payload = getToken().split('.')[1];
  const payload = JSON.parse(atob(base64Payload))
  return payload.realm_access 
  ? payload.realm_access.roles !== undefined
      ? payload.realm_access.roles
      : []
  : []
}