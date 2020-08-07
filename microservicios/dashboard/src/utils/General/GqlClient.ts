import { ApolloClient, HttpLink, split,  InMemoryCache  } from '@apollo/client';

import { getMainDefinition } from '@apollo/client/utilities';
import { setContext } from '@apollo/link-context';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getToken, updateToken } from './keycloak';

let loc = window.location, new_uri;
new_uri = loc.protocol === "https:"
  ? "wss:"
  : "ws:";
new_uri += "//" + loc.host + "/graphqlws";

const wsLink = new WebSocketLink({
  uri: new_uri,
  options: {
    reconnect: true
  }
});


const httpLink = new HttpLink({
  uri: `${loc.protocol}//${loc.host}/graphql`
});

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const authLink = setContext(async (_, { headers }) => {
  await updateToken(60);
  return {
    headers: {
      ...headers,
      authorization: getToken(),
    }
  }
});
let clientAux;
if (getToken() !== "") {
  clientAux = new ApolloClient({
    link: authLink.concat(link),
    cache: new InMemoryCache()
  });
} else clientAux = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});
export const client = clientAux;