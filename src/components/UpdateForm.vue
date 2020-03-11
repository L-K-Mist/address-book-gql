<template>
  <v-card>
    <v-card-title class="headline">Let's Update Your Contact</v-card-title>
    <v-form @submit.prevent="saveContact()" v-model="valid">
      <v-container class="pa-3">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="firstname"
              :rules="nameRules"
              :counter="10"
              label="First name"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="lastname"
              :rules="lastnameRules"
              :counter="20"
              label="Last name"
              required
            ></v-text-field>
          </v-col>
          <v-col
            v-for="(email, index) in emails"
            :key="`email` + index"
            cols="12"
            md="6"
          >
            <v-row>
              <v-col cols="10">
                <v-text-field
                  v-model="email.email"
                  :rules="emailRules"
                  label="E-mail"
                ></v-text-field>
              </v-col>
              <v-col cols="2" class="field-button-wrapper">
                <v-btn
                  v-if="index === emails.length - 1"
                  @click="addEmailField()"
                  class="mx-2"
                  fab
                  dark
                  x-small
                  color="accent"
                >
                  <v-icon dark>fa-plus</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
          <v-col
            v-for="(phone, index) in phones"
            :key="`phone` + index"
            cols="12"
            md="6"
          >
            <v-row>
              <v-col cols="10">
                <v-text-field
                  v-model="phone.phone_number"
                  label="Phone"
                ></v-text-field>
              </v-col>
              <v-col cols="2" class="field-button-wrapper">
                <v-btn
                  v-if="index === phones.length - 1"
                  @click="addPhoneField()"
                  class="mx-2"
                  fab
                  dark
                  x-small
                  color="accent"
                >
                  <v-icon dark>fa-plus</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-btn type="submit" block color="success">Update this Contact</v-btn>
      </v-container>
    </v-form>
  </v-card>
</template>

<script>
export default {
  props: ["contact"],
  data: () => ({
    valid: false,
    firstname: "",
    lastname: "",
    numberOfEmails: 2,
    nameRules: [
      v => !!v || "Name is required",
      v => v.length <= 10 || "Name must be less than 10 characters"
    ],
    lastnameRules: [
      v => !!v || "Name is required",
      v => v.length <= 20 || "Name must be less than 20 characters"
    ],
    emailRules: [v => /.+@.+/.test(v) || "E-mail must be valid"],
    emails: [
      {
        email: null
      }
    ],
    phones: [{ phone_number: null }]
  }),
  mounted() {
    console.log(this.contact);
    this.firstname = this.contact.firstname;
    this.lastname = this.contact.lastname;
    this.emails = this.contact.contact_emails;
    this.phones = this.contact.contact_phones;
  },
  methods: {
    addEmailField() {
      this.emails.push({ email: null });
    },
    addPhoneField() {
      this.phones.push({ phone_number: null });
    },
    async saveContact() {
      const { firstname, lastname, emails, phones } = this;
      await this.$store.dispatch("updateContact", {
        firstname,
        lastname,
        emails,
        phones,
        id: this.contact.id
      });

      this.$emit("closeMe");
    }
  }
};
</script>

<style lang="scss" scoped>
.field-button-wrapper .v-btn {
  position: relative;
  left: -30px;
  top: 7px;
}
</style>
