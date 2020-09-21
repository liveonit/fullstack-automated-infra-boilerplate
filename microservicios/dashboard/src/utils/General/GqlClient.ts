import { ApolloClient, HttpLink, split, InMemoryCache } from '@apollo/client';

import { getMainDefinition } from '@apollo/client/utilities';
import { setContext } from '@apollo/link-context';
import { WebSocketLink } from '@apollo/client/link/ws';
import { onError } from '@apollo/client/link/error'
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


const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.error(
        "[GraphQL error]: ", {
        message, locations, path
      },
      ),
    );

  if (networkError) console.error(`[Network error]: ${networkError}`);

});


const authLink = setContext(async (_, { headers }) => {
  await updateToken(60);
  return {
    headers: {
      ...headers,
      authorization: getToken(),
    }
  }
});

const cache = new InMemoryCache({
  typePolicies: {
    SystemError: {
      keyFields: ["message"]
    }
  }
})

let clientAux;
if (getToken() !== "") {
  clientAux = new ApolloClient({
    link: errorLink.concat(authLink.concat(link)),
    cache,
  });
} else clientAux = new ApolloClient({
  link: errorLink.concat(link),
  cache,
});
export const client = clientAux;