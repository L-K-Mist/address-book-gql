<template>
  <div>
    <v-card>
      <v-card-title class="headline">
        Good day, I have no current record of you.
        <br />Who are you?
      </v-card-title>
      <v-card-text>
        <p>
          I don't have your name saved in local storage yet. Please add it here,
          then I can feed you your own contacts and not someone else's.
        </p>
        <p>(Jone Dane, has some contacts already)</p>

        <v-form @submit.prevent="saveUserLocally()">
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
          <v-btn block type="submit" color="accent"
            >Make Me the Issuer of All Queries</v-btn
          >
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userFirstname: "",
      userLastname: "",
      nameRules: [
        v => !!v || "Name is required",
        v => v.length <= 10 || "Name must be less than 10 characters"
      ],
      lastnameRules: [
        v => !!v || "Name is required",
        v => v.length <= 20 || "Name must be less than 20 characters"
      ]
    };
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
      this.$store.dispatch("fetchContacts"); // Moved this dispatch call out of the currentUserId action, because when we removeUser() here, we update the currentUserId to null and don't want to fetchContacts.
      this.$emit("closeMe"); // Close the dialog.
    }
  }
};
</script>

<style lang="scss" scoped></style>
