import Vue from "vue";
import Vuex from "vuex";
import apollo from "../apollo";
import { MY_CONTACTS } from "../gql/queries";
import { ADD_USER } from "../gql/mutations";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentUserId: null,
    activeContact: {
      firstName: "Mike",
      lastName: "Schutte",
      emails: ["mike@schutte.com", "mike@schutte.co.za", "mike@schutte.org"],
      phoneNumbers: ["0833446552", "0833446551"]
    },
    contacts: [
      {
        firstName: "Mike",
        lastName: "Schutte",
        emails: ["mike@schutte.com", "mike@schutte.co.za", "mike@schutte.org"],
        phoneNumbers: ["0833446552", "0833446551"]
      }
    ]
  },
  mutations: {
    currentUserId(state, payload) {
      state.currentUserId = payload;
      console.log("currentUserId -> state.currentUserId", state.currentUserId);
    },
    contacts(state, payload) {
      state.contacts = payload;
    }
  },
  actions: {
    currentUserId({ commit, dispatch }, payload) {
      commit("currentUserId", payload);
      dispatch("fetchContacts");
    },
    // eslint-disable-next-line no-empty-pattern
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
        console.log("createUser -> error", error);
        if (error.message.includes("Uniqueness violation")) {
          alert(`Welcome Back, ${firstname}`);
          commit("currentUserId", id); // We now know that this is an existing user, so we can use this id for getting the right contacts.
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
        commit("contacts", response.data);
      } catch (error) {
        console.log("fetchContacts -> error", error);
      }
    }
  },
  modules: {}
});
