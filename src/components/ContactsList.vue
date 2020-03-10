<template>
  <div>
    <div v-for="contact in contacts" :key="contact.id">
      {{ contact.firstname }}
      <!-- <v-col v-for="email in contacts.contact_emails"></v-col> -->
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
