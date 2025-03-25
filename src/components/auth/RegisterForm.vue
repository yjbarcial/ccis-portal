<template>
  <v-form fast-fail @submit.prevent>
    <v-row>
      <v-col cols="6" md="6"
        ><v-text-field label="First Name" variant="outlined"></v-text-field>
      </v-col>
      <v-col cols="6" md="6"
        ><v-text-field label="Last Name" variant="outlined"></v-text-field
      ></v-col>
    </v-row>

    <v-text-field label="Email" variant="outlined"></v-text-field>

    <v-text-field label="Password" type="password" variant="outlined"></v-text-field>

    <v-text-field label="Password Confirmation" type="password" variant="outlined"></v-text-field>

    <v-btn class="mt-2" type="submit" color="deep-orange" block prepend-icon="mdi-account-plus"
      >Register</v-btn
    >
  </v-form>
</template>
