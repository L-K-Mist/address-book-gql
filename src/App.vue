<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-icon dark>fas fa-address-book</v-icon>
        <h1 class="ml-4">
          <span v-if="userName">{{ userName }}'s &nbsp;</span>
          <span>Address Book</span>
        </h1>
      </div>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-content>
      <AddressBook />
      <ContactForm />
    </v-content>
  </v-app>
</template>

<script>
import AddressBook from "./components/AddressBook";
import ContactForm from "./components/ContactForm";
import { APP_USERS } from "./gql/queries";

import apollo from "./apollo";

export default {
  name: "App",

  components: {
    AddressBook,
    ContactForm
  },

  data: () => ({
    userName: "Dylan"
  }),
  mounted() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await apollo.query({
          query: APP_USERS
        });
        console.log("fetchUsers -> response", response);
      } catch (error) {
        console.log("TCL: getSchoolsKZN -> error", error);
      }
    }
  }
};
</script>
