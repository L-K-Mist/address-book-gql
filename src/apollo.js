import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { InMemoryCache } from "apollo-cache-inmemory";

const httpLink = new HttpLink({
  uri: process.env.VUE_APP_SERVERLINK
});

/*eslint no-unused-vars: ["error", { "args": "none" }]*/
const errorLink = onError(
  ({ operation, response, graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      console.log("gqlError", {
        graphQLErrors
      });
    }
    if (networkError) {
      console.log({
        networkError
      });
    }
  }
);

var link = errorLink.concat(httpLink); // These are middleware

const apollo = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  connectToDevTools: true
});

export default apollo;
