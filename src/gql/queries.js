import gql from "graphql-tag";

export const APP_USERS = gql`
  query {
    app_users {
      firstname
      id
      lastname
    }
  }
`;
