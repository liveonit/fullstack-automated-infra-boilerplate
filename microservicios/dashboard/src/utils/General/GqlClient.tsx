import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from "apollo-cache-inmemory";
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';


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

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});