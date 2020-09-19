import { ApolloClient, HttpLink, split, InMemoryCache, ServerError, gql } from '@apollo/client';

import { getMainDefinition } from '@apollo/client/utilities';
import { setContext } from '@apollo/link-context';
import { WebSocketLink } from '@apollo/client/link/ws';
import { onError } from '@apollo/client/link/error'
import { getToken, updateToken } from './keycloak';


const errorQuery = gql`
query ErrorQuery {
  error {
    __typename
    statusCode
    message
    locations
    path
  }
}`;


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


const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  const { cache } = operation.getContext();
  if (networkError || graphQLErrors) {
    graphQLErrors?.forEach(({ message, locations, path }) =>
      cache.writeQuery({
        query: errorQuery,
        data: {
          error: {
            __typename: 'error',
            message,
            locations,
            path
          }
        },
      })
    )
    networkError && cache.writeQuery({
      query: errorQuery,
      data: {
        error: {
          __typename: 'error',
          message: networkError,
          locations: "Network or server error",
          path: "None"
        }
      },
    })
  };
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

let clientAux;
if (getToken() !== "") {
  clientAux = new ApolloClient({
    link: errorLink.concat(authLink.concat(link)),
    cache: new InMemoryCache()
  });
} else clientAux = new ApolloClient({
  link: errorLink.concat(link),
  cache: new InMemoryCache(),
});
export const client = clientAux;