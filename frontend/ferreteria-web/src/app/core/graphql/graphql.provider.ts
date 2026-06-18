import { ApplicationConfig, inject } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { ApolloLink, InMemoryCache } from '@apollo/client/core';

const uri = 'https://sw2-ferreteria.duckdns.org/graphql';
export const graphqlProvider: ApplicationConfig['providers'] = [
  provideHttpClient(),

  provideApollo(() => {
    const httpLink = inject(HttpLink);

    const authLink = new ApolloLink((operation, forward) => {
      const token = localStorage.getItem('token');

      operation.setContext({
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      });

      return forward(operation);
    });

    return {
      link: authLink.concat(httpLink.create({ uri })),
      cache: new InMemoryCache(),
    };
  }),
];
