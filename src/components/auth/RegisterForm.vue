<template>
  <v-form fast-fail @submit.prevent>
    <v-text-field label="First Name" variant="outlined"></v-text-field>

    <v-text-field label="Last Name" variant="outlined"></v-text-field>

    <v-text-field label="Email" variant="outlined"></v-text-field>

    <v-text-field label="Password" type="password" variant="outlined"></v-text-field>

    <v-text-field label="Password Confirmation" type="password" variant="outlined"></v-text-field>

    <v-btn class="mt-2" type="submit" color="primary" block prepend-icon="mdi-account-plus"
      >Register</v-btn
    >
  </v-form>
</template>
