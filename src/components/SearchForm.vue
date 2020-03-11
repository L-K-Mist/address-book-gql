<template>
  <v-card>
    <v-card-title class="headline"
      >Let's Find Who You're Looking For</v-card-title
    >
    <v-card-text>
      <v-form @submit.prevent="findContacts()">
        <v-container class="pa-3">
          <v-row>
            What string shall we search? This search will check both the First
            Name and the Last Name for a match.
            <v-col cols="12" md="6">
              <v-text-field
                v-model="searchString"
                label="Search String"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-btn type="submit" color="success">Search</v-btn>
        </v-container>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      searchString: ""
    };
  },
  methods: {
    async findContacts() {
      await this.$store.dispatch("searchContacts", this.searchString);
      this.$emit("closeMe");
    }
  }
};
</script>

<style lang="scss" scoped></style>
