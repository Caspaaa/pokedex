import { Apollo, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { ApplicationConfig, inject } from '@angular/core';
import {
  ApolloClientOptions,
  ApolloLink,
  InMemoryCache,
} from '@apollo/client/core';
import { onError } from '@apollo/client/link/error';
import { LocalStorageWrapper, persistCacheSync } from 'apollo3-cache-persist';

const cache = new InMemoryCache();

const uri = 'https://beta.pokeapi.co/graphql/v1beta';
export function apolloOptionsFactory(): ApolloClientOptions<any> {
  const httpLink = inject(HttpLink);

  if (typeof window !== 'undefined') {
    persistCacheSync({
      cache,
      storage: new LocalStorageWrapper(localStorage),
    });
  }

  return {
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors)
          graphQLErrors.forEach(({ message, locations, path }) =>
            console.log(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
          );
        if (networkError) console.log(`[Network error]: ${networkError}`);
      }),
      httpLink.create({ uri }),
    ]),
    cache: cache,
    // defaultOptions: {
    //   watchQuery: {
    //     fetchPolicy: 'network-only', // cache-first
    //     // fetchPolicy: 'cache-first', // cache-first
    //   },
    // },
  };
}

export const graphqlProvider: ApplicationConfig['providers'] = [
  Apollo,
  {
    provide: APOLLO_OPTIONS,
    useFactory: apolloOptionsFactory,
  },
];
