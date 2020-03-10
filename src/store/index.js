import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
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
  mutations: {},
  actions: {},
  modules: {}
});
