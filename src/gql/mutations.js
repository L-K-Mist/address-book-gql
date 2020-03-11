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

export const ADD_CONTACT = gql`
  mutation AddContact($user: [user_contacts_insert_input!]!) {
    insert_user_contacts(objects: $user) {
      affected_rows
    }
  }
`;

export const DELETE_CONTACT = gql`
  mutation DeleteContact($id: Int!) {
    delete_user_contacts(where: { id: { _eq: $id } }) {
      returning {
        user {
          user_contacts {
            firstname
            id
            lastname
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
      }
    }
  }
`;
