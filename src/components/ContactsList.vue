<template>
  <v-container class="page mt-8" grid-list-xs>
    <v-card>
      <v-card-title class="headline">
        Contacts List
        <v-spacer></v-spacer>
        <v-btn color="accent" @click="addContact = true">
          <v-icon left>fa-plus</v-icon>Add a Contact
        </v-btn>
        <v-dialog
          v-model="addContact"
          max-width="720px"
          transition="dialog-transition"
        >
          <ContactForm v-if="addContact" @closeMe="addContact = false" />
        </v-dialog>
      </v-card-title>

      <v-card-text>
        <v-row justify="center">
          <v-expansion-panels v-model="panel" popout>
            <v-expansion-panel
              active-class="active-panel"
              v-for="contact in contacts"
              :key="contact.id"
            >
              <v-expansion-panel-header class="title">
                {{ contact.firstname }}
                {{ contact.lastname }}
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-sheet class="mx-auto" max-width="600">
                  <v-slide-group multiple show-arrows>
                    <v-slide-item
                      v-for="item in contact.contact_emails"
                      :key="`email` + item.id"
                      v-slot:default="{ active, toggle }"
                    >
                      <v-btn
                        class="mx-2"
                        :input-value="active"
                        active-class="orange white--text"
                        depressed
                        center-active
                        rounded
                        @click="toggle"
                        >{{ item.email }}</v-btn
                      >
                    </v-slide-item>
                  </v-slide-group>
                </v-sheet>
                <br />
                <v-sheet class="mx-auto" max-width="600">
                  <v-slide-group multiple show-arrows>
                    <v-slide-item
                      v-for="item in contact.contact_phones"
                      :key="`phone` + item.id"
                      v-slot:default="{ active, toggle }"
                    >
                      <v-btn
                        class="mx-2"
                        :input-value="active"
                        active-class="orange white--text"
                        depressed
                        rounded
                        @click="toggle"
                        >{{ item.phone_number }}</v-btn
                      >
                    </v-slide-item>
                  </v-slide-group>
                </v-sheet>
                <br />
                <v-row justify="center">
                  <v-btn
                    class="mr-2"
                    color="accent"
                    @click="deleteContact(contact)"
                  >
                    Delete
                    <v-icon right>fa-trash</v-icon>
                  </v-btn>
                  <v-btn @click="editContact(contact)" color="primary">
                    <v-icon left>fa-edit</v-icon>Edit
                  </v-btn>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <v-dialog v-model="editDialog" width="500">
            <UpdateForm :contact="activeContact" />
          </v-dialog>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import ContactForm from "../components/ContactForm";
import UpdateForm from "../components/UpdateForm";
export default {
  data() {
    return {
      panel: null, // Represents the index value of the selected expansion-panel
      addContact: false,
      editDialog: false,
      activeContact: null
    };
  },
  computed: {
    contacts() {
      return this.$store.state.contacts;
    }
  },
  methods: {
    deleteContact(contact) {
      console.log("deleteContact -> contact", contact);
      this.$store.dispatch("deleteContact", contact.id);
    },
    editContact(contact) {
      this.activeContact = contact;
      this.editDialog = true;
    }
  },
  components: {
    ContactForm,
    UpdateForm
  }
};
</script>

<style lang="scss" scoped>
.page {
  max-width: 900px;
}
</style>
