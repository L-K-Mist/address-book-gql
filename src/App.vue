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
      <v-btn flat color="primary">
        <h3 class="mr-4">Clear User from Local Storage</h3>
        &nbsp;
        <v-icon>fa-sign-out</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content>
      <AddressBook />
      <ContactForm />
      <v-dialog
        v-model="askName"
        max-width="500px"
        transition="dialog-transition"
      >
        <v-card>
          <v-card-title class="headline"
            >Good day, I have no current record of you. Who are
            you?</v-card-title
          >
          <v-card-text>
            <p>
              I don't have your name saved in local storage yet. Please add it
              here, then I can feed you your own contacts and not someone
              else's.
            </p>

            <v-form v-if="askName" @submit.prevent="saveUserLocally()">
              <v-col cols="12">
                <v-text-field
                  v-model="userFirstname"
                  :rules="nameRules"
                  :counter="10"
                  label="First name"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="userLastname"
                  :rules="lastnameRules"
                  :counter="20"
                  label="Last name"
                  required
                ></v-text-field>
              </v-col>
              <br />
              <v-btn block type="submit" color="success"
                >Make Me the Issuer of All Queries</v-btn
              >
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-content>
  </v-app>
</template>

<script>
import AddressBook from "./components/AddressBook";
import ContactForm from "./components/ContactForm";

export default {
  name: "App",

  components: {
    AddressBook,
    ContactForm
  },

  data: () => ({
    userFirstname: "",
    userLastname: "",
    askName: false,
    nameRules: [
      v => !!v || "Name is required",
      v => v.length <= 10 || "Name must be less than 10 characters"
    ],
    lastnameRules: [
      v => !!v || "Name is required",
      v => v.length <= 20 || "Name must be less than 20 characters"
    ]
  }),
  mounted() {
    this.newVisitorOrNot();
  },
  methods: {
    saveUserLocally() {
      let fullname = this.userFirstname + "&`#" + this.userLastname;
      localStorage.setItem("fullname", fullname);
      this.$store.dispatch("createUser", {
        firstname: this.userFirstname,
        lastname: this.userLastname
      });
      this.$store.dispatch(
        "currentUserId",
        this.userFirstname + this.userLastname
      );
      this.askName = false; // Close the dialog.
    },
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
      }
    }
  }
};
</script>
