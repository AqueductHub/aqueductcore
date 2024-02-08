import { HttpLink, ApolloClient, InMemoryCache } from "@apollo/client";

import { ApolloOptions } from "constants/apolloOptions";
import { AQD_URI, isProduction } from "constants/api";

const AQDHttpLink = new HttpLink({
  uri: AQD_URI,
});

export const client = new ApolloClient({
  link: AQDHttpLink,
  cache: new InMemoryCache(ApolloOptions),
  connectToDevTools: !isProduction,
});
