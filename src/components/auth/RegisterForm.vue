<script setup>
import { ref } from 'vue'

const isPasswordvisible = ref(false)
const isConfirmPasswordvisible = ref(false)
</script>

<template>
  <v-form @submit.prevent class="register-form">
    <!-- Form Header -->
    <div class="text-center mb-5">
      <v-icon size="36" color="deep-orange">mdi-account-plus</v-icon>
      <h2 class="font-weight-bold mt-2">Create an Account</h2>
    </div>

    <!-- First & Last Name -->
    <v-row>
      <v-col cols="12" sm="6">
        <v-text-field
          label="First Name"
          variant="solo-filled"
          prepend-inner-icon="mdi-account"
          class="mb-3"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          label="Last Name"
          variant="solo-filled"
          prepend-inner-icon="mdi-account"
          class="mb-3"
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- Email -->
    <v-text-field
      label="Email Address"
      variant="solo-filled"
      prepend-inner-icon="mdi-email"
      class="mb-3"
    ></v-text-field>
    <v-row>
      <v-col cols="12" sm="6">
        <!-- Password -->
        <v-text-field
          label="Password"
          type="password"
          prepend-inner-icon="mdi-lock"
          class="mb-3"
          variant="solo-filled"
          :append-inner-icon="isPasswordvisible ? 'mdi-eye' : 'mdi-eye-off'"
          :type="isPasswordvisible ? 'text' : 'password'"
          @click:append-inner="isPasswordvisible = !isPasswordvisible"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <!-- Confirm Password -->
        <v-text-field
          label="Confirm Password"
          type="password"
          variant="solo-filled"
          prepend-inner-icon="mdi-lock-check"
          class="mb-3"
          :append-inner-icon="isConfirmPasswordvisible ? 'mdi-eye' : 'mdi-eye-off'"
          :type="isConfirmPasswordvisible ? 'text' : 'password'"
          @click:append-inner="isConfirmPasswordvisible = !isConfirmPasswordvisible"
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- Register Button -->
    <v-btn type="submit" block color="deep-orange" size="large" elevation="3"> Register </v-btn>

    <!-- Divider -->
    <v-divider class="my-5"></v-divider>

    <!-- Login Link -->
    <p class="text-center">
      Already have an account?
      <RouterLink class="text-deep-orange font-weight-bold" to="/"> Log in </RouterLink>
    </p>
  </v-form>
</template>

<style scoped>
.register-form {
  max-width: 520px; /* Increased max-width */
  width: 100%;
  padding: 30px;
  border-radius: 12px;
  background: white;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
}
</style>
