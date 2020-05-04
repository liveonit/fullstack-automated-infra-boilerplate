import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from "apollo-cache-inmemory";
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';

console.log("GQL_WS_URL", process.env.GQL_WS_URL)
const wsLink = new WebSocketLink({
  uri: process.env.REACT_APP_GQL_WS_URL || `ws://localhost:9000/graphql`,
  options: {
    reconnect: true
  }
});

console.log("GQL_HTTP_URL", process.env.GQL_HTTP_URL)
const httpLink = new HttpLink({
  uri: process.env.REACT_APP_GQL_HTTP_URL || 'http://localhost:9000/graphql',
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

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});