<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-icon dark>fa-address-book</v-icon>
        <h1 class="ml-4">
          <span v-if="userFirstname">{{ userFirstname }}'s &nbsp;</span>
          <span>Address Book</span>
        </h1>
      </div>
      <v-spacer></v-spacer>
      <v-btn @click="removeUser()" text>
        <span class="mr-2">Clear User from Local Storage</span>
        <v-icon>fa-sign-out</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content>
      <ContactsList />
      <v-dialog
        v-model="askName"
        max-width="500px"
        transition="dialog-transition"
        persistent
      >
        <UserForm v-if="askName" @closeMe="askName = false" />
      </v-dialog>
    </v-content>
  </v-app>
</template>

<script>
import UserForm from "./components/UserForm";
import ContactsList from "./components/ContactsList";

export default {
  name: "App",

  components: {
    ContactsList,
    UserForm
  },

  data: () => ({
    askName: false,
    userFirstname: "",
    userLastname: ""
  }),
  mounted() {
    this.newVisitorOrNot();
  },
  methods: {
    newVisitorOrNot() {
      // If it's a returning visitor, pull their info from local storage and let store know who our current user is.
      // If there's nothing in local storage, get them to give us their first and last names.
      let localname = localStorage.getItem("fullname");
      if (!localname) {
        this.askName = true; // Trigger the askName dialog.
      } else {
        let names = localname.split("&`#"); // The &`# is chosen as unlikely combo to be inside someone's name. TODO Validate that name can't have such symbols.
        this.userFirstname = names[0];
        this.userLastname = names[1];
        console.log("mounted -> names", names);
        this.$store.dispatch(
          "currentUserId",
          this.userFirstname + this.userLastname
        ); // Now all calls to the contacts table will only deal with results tied to this user.
        this.$store.dispatch("fetchContacts");
      }
    },
    removeUser() {
      localStorage.removeItem("fullname");
      this.$store.dispatch("currentUserId", null);
      this.askName = true;
    }
  }
};
</script>

<style>
.v-content {
  background-color: hsla(0, 0%, 95%, 1);
}
</style>
