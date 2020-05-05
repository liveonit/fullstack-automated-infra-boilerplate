import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from "apollo-cache-inmemory";
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';

const wsLink = new WebSocketLink({
  uri: process.env.REACT_APP_API_URL ? `ws${process.env.REACT_APP_API_URL}/graphql` : `ws://localhost:9000/graphql`,
  options: {
    reconnect: true
  }
});


const httpLink = new HttpLink({
  uri: process.env.REACT_APP_API_URL ? `http${process.env.REACT_APP_API_URL}/graphql` : 'http://localhost:9000/graphql',
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