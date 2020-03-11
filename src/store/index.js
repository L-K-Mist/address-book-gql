import Vue from "vue";
import Vuex from "vuex";
import apollo from "../apollo";
import { MY_CONTACTS } from "../gql/queries";
import { ADD_USER, ADD_CONTACT, DELETE_CONTACT } from "../gql/mutations";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentUserId: null,
    activeContact: null,
    contacts: null
  },
  mutations: {
    currentUserId(state, payload) {
      state.currentUserId = payload;
      console.log("currentUserId -> state.currentUserId", state.currentUserId);
    },
    contacts(state, payload) {
      state.contacts = payload;
      console.log("contacts -> state.contacts", state.contacts);
    }
  },
  actions: {
    currentUserId({ commit }, payload) {
      commit("currentUserId", payload);
    },

    async createUser({ commit }, payload) {
      const { firstname, lastname } = payload;
      const id = firstname + lastname;
      try {
        const response = await apollo.mutate({
          mutation: ADD_USER,
          variables: {
            user: [
              {
                firstname,
                lastname,
                id
              }
            ]
          }
        });
        console.log("createUser -> response", response);
      } catch (error) {
        if (error.message.includes("Uniqueness violation")) {
          alert(`Welcome Back, ${firstname}`);
          commit("currentUserId", id); // We now know that this is an existing user, so we can use this id for getting the right contacts.
        } else {
          console.error("createUser -> error", error);
        }
      }
    },
    async fetchContacts({ commit, state }) {
      try {
        const response = await apollo.query({
          query: MY_CONTACTS,
          variables: { userId: state.currentUserId }
        });
        console.log("fetchContacts -> response", response.data);
        commit("contacts", response.data.user_contacts);
      } catch (error) {
        console.log("fetchContacts -> error", error);
      }
    },
    /**
    This is the sort of user-object that the GQL wants:
    {firstname: "Full", lastname: "Person", 
      contact_emails: {data: [{email: "one@email.com"}, {email: "two@email.com"}]},
      contact_phones: {data: [{phone_number: "111"}, {phone_number: "222"}]}, user_id: "JoneDane"}
     */
    // eslint-disable-next-line no-empty-pattern
    async saveContact({}, payload) {
      const { firstname, lastname, emails, phones } = payload;
      const user = {
        firstname,
        lastname,
        contact_emails: {
          data: emails
        },
        contact_phones: {
          data: phones
        }
      };
      try {
        const response = await apollo.mutate({
          mutation: ADD_CONTACT,
          variables: {
            user
          }
        });
        console.log("fetchContacts -> response", response.data);
      } catch (error) {
        console.log("saveContact -> error", error);
      }
    },
    // eslint-disable-next-line no-empty-pattern
    async deleteContact({}, payload) {
      console.log("deleteContact -> payload", payload);
      try {
        const response = await apollo.mutate({
          mutation: DELETE_CONTACT,
          variables: {
            id: payload
          }
        });
        console.log("fetchContacts -> response", response.data);
      } catch (error) {
        console.log("saveContact -> error", error);
      }
    }
  },
  modules: {}
});
