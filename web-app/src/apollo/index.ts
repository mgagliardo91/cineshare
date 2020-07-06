import { ApolloLink, ApolloClient, HttpLink } from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';

const onErrorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const cache = new InMemoryCache({
  freezeResults: true,
});
const graphQLLink = new HttpLink({
  uri: `http://localhost:3000/graphql`,
  // fetchOptions: {
  //   mode: 'no-cors',
  // },
});

export default new ApolloClient({
  cache,
  link: ApolloLink.from([onErrorLink, graphQLLink]),
  assumeImmutableResults: true,
});
