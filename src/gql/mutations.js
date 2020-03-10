import gql from "graphql-tag";

export const ADD_USER = gql`
  mutation($user: [app_users_insert_input!]!) {
    insert_app_users(objects: $user) {
      returning {
        firstname
        id
        lastname
      }
    }
  }
`;
