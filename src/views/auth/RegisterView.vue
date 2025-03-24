<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import { useDisplay } from 'vuetify'
const { mobile } = useDisplay()
</script>

<template>
  <AppLayout>
    <template #content>
      <v-row>
        <v-col cols="12" md="6" class="mx-auto pt-10">
          <v-card class="mx-auto" elevation="24">
            <v-card-title class="text-center">
              <v-img
                src="images/ccisLogo.png"
                :width="mobile ? '75%' : '45%'"
                class="mx-auto"
              ></v-img>
              <h3 class="font-weight-black">CCIS Syllabus Management System</h3>
              <p>Register Form</p>
            </v-card-title>

            <v-card-text class="bg-surface-light pt-4">
              <v-form fast-fail @submit.prevent>
                <v-text-field label="First Name" variant="outlined"></v-text-field>

                <v-text-field label="Last Name" variant="outlined"></v-text-field>

                <v-text-field label="Email" variant="outlined"></v-text-field>

                <v-text-field label="Password" type="password" variant="outlined"></v-text-field>

                <v-text-field
                  label="Password Confirmation"
                  type="password"
                  variant="outlined"
                ></v-text-field>

                <v-btn
                  class="mt-2"
                  type="submit"
                  color="primary"
                  block
                  prepend-icon="mdi-account-plus"
                  >Register</v-btn
                >
              </v-form>

              <v-divider class="my-5"></v-divider>
              <h5 class="text-center">
                Already have an account?
                <RouterLink class="text-primary" to="/">Click here to Login</RouterLink>
              </h5>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row></template
    >
  </AppLayout>
</template>
