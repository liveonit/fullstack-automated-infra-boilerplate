import React from 'react';
import { updateToken } from '../../../utils/General/keycloakUtils';

let keycloak: any;

declare global {
	interface Window {
			Keycloak:any;
			k: any;
	}
}

export const init = () => {
  // If the Keycloak constructor doesn't exist we'll throw an error.
  if (window.Keycloak === undefined) {
    throw new Error('Can\'t find the Keycloak global constructor');
  }

  // Initialize a Keycloak object
  keycloak = new window.Keycloak({
    url: process.env.REACT_APP_KEYCLOAK_URK || '/auth',
    realm: process.env.REACT_APP_KEYCLOAK_REALM || 'Fullstack',
    clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID || 'dashboard'
  });

  window.k = keycloak;
}

interface Props {
	children: React.ReactChild
}

const Keycloak: React.FC<Props> = ({children}) => {
	// We'll use this variable to halt the app
	// excecution until the user is Authenticated
	const [isAuthenticated, setIsAuthenticated] = React.useState(false);
	// The `init()` method we'll be in charge of starting
	// the authentication flow.
	React.useEffect(() => {
		keycloak
			.init({
				// The `onLoad` option can be configured
				// with two possible values:
				// - `login-required`
				// - `check-sso`
				// Both do the same, except the first one
				// redirects the user to the login page if
				// he's not authenticated.
				onLoad: 'login-required',
				timeSkew: 0
			})
			.success((authenticated: boolean) => {
				// We can continue rendering the app
				// now that the user has been authenticated
				setIsAuthenticated(authenticated)
				if (authenticated) updateToken(60);
			})
			.error((err: Error) => {
				// Log an error method if something went
				// wrong.
				console.error(err);
			});
	}, []);
	// We'll render the component `children` only after the
	// user has been authenticated.
	return isAuthenticated
	? children as React.ReactElement
	: <div>Please wait...</div>
}

export default Keycloak;