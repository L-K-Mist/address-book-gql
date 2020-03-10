<template>
  <div>
    <div v-for="contact in contacts" :key="contact.id">
      {{ contact.firstname }}
      <v-col v-for="item in contact.contact_emails" :key="`email` + item.id">{{
        item.email
      }}</v-col>
      <v-col v-for="item in contact.contact_phones" :key="`phone` + item.id">{{
        item.phone_number
      }}</v-col>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    contacts() {
      return this.$store.state.contacts;
    }
  }
};
</script>

<style lang="scss" scoped></style>
