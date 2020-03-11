import Vue from "vue";
import Vuex from "vuex";
import apollo from "../apollo";
import { MY_CONTACTS, SEARCH_CONTACTS } from "../gql/queries";
import { ADD_USER, ADD_CONTACT, DELETE_CONTACT } from "../gql/mutations";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentUserId: null,
    activeContact: null,
    contacts: null,
    filteredContacts: null
  },
  mutations: {
    currentUserId(state, payload) {
      state.currentUserId = payload;
      console.log("currentUserId -> state.currentUserId", state.currentUserId);
    },
    contacts(state, payload) {
      state.contacts = payload;
      console.log("contacts -> state.contacts", state.contacts);
    },
    filteredContacts(state, payload) {
      state.filteredContacts = payload;
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

    async saveContact({ state, commit }, payload) {
      const { firstname, lastname, emails, phones } = payload;
      const user = {
        firstname,
        lastname,
        contact_emails: {
          data: emails
        },
        contact_phones: {
          data: phones
        },
        user_id: state.currentUserId
      };
      try {
        const response = await apollo.mutate({
          mutation: ADD_CONTACT,
          variables: {
            user
          }
        });
        const currentContacts =
          response.data.insert_user_contacts.returning[0].user.user_contacts;

        commit("contacts", currentContacts);
        return true;
      } catch (error) {
        console.log("saveContact -> error", error);
      }
    },
    async deleteContact({ commit }, payload) {
      console.log("deleteContact -> payload", payload);
      try {
        const response = await apollo.mutate({
          mutation: DELETE_CONTACT,
          variables: {
            id: payload
          }
        });
        console.log("deleteContact -> response", response.data);
        const currentContacts =
          response.data.delete_user_contacts.returning[0].user.user_contacts;
        commit("contacts", currentContacts);
        return true; // So that other actions (like updateContact) can know when this is resolved.
      } catch (error) {
        console.log("saveContact -> error", error);
      }
    },

    async updateContact({ dispatch, commit, state }, payload) {
      console.log("updateContact -> payload", payload);
      let deleted = await dispatch("deleteContact", payload.id);
      if (deleted) {
        const { firstname, lastname, emails, phones, id } = payload;
        let whole_emails = emails.filter(item => item.email !== "");
        let whole_numbers = phones.filter(item => item.phone_number !== "");
        const user = {
          id,
          firstname,
          lastname,
          contact_phones: {
            data: whole_numbers
          },
          contact_emails: {
            data: whole_emails
          },
          user_id: state.currentUserId
        };
        try {
          const response = await apollo.mutate({
            mutation: ADD_CONTACT,
            variables: {
              user
            }
          });
          const currentContacts =
            response.data.insert_user_contacts.returning[0].user.user_contacts;

          commit("contacts", currentContacts);
          return true;
        } catch (error) {
          console.log("saveContact -> error", error);
        }
      }
    },
    // Saving this for next empty action
    // eslint-disable-next-line no-empty-pattern
    async searchContacts({ state, commit }, payload) {
      try {
        const response = await apollo.query({
          query: SEARCH_CONTACTS,
          variables: { userId: state.currentUserId, searchTerm: `%${payload}%` }
        });
        console.log("fetchContacts -> response", response.data);
        commit("filteredContacts", response.data.user_contacts);
        return true;
      } catch (error) {
        console.log("fetchContacts -> error", error);
      }
    }
  },
  modules: {}
});
