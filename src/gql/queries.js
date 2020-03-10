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
    user_contacts(where: { user_id: { _eq: $userId } }) {
      firstname
      lastname
      id
      contact_emails {
        id
        email
      }
      contact_phones {
        id
        phone_number
      }
    }
  }
`;
