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

// TODO test this after create user Dylan van den Bosch
export const MY_CONTACTS = gql`
  query UserContacts($userId: String!) {
    app_users(where: { id: { _eq: $userId } }) {
      user_contacts {
        firstname
        id
        lastname
        contact_emails {
          email
          id
        }
      }
    }
  }
`;
