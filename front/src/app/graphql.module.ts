import {NgModule} from '@angular/core';
import {ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
import {HttpLinkModule, HttpLink} from 'apollo-angular-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {WebSocketLink} from "apollo-link-ws";
import {split} from "apollo-link";
import { getMainDefinition } from 'apollo-utilities';

const uriHttp = 'http://localhost:8080/v1/graphql'; // <-- add the URL of the GraphQL server here
const uriWs = 'ws://localhost:8080/v1/graphql';

export function createApollo(httpLink: HttpLink) {
  const http = httpLink.create({uri : uriHttp});

  const ws = new WebSocketLink({
    uri: uriWs,
    options: {
      reconnect: true
    }
  });

  const link = split(
    // split based on operation type
    ({ query }) => {
      const { kind, operation }: any = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    ws,
    http,
  );


  return {
    link: link,
    cache: new InMemoryCache(),
  };
}

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
