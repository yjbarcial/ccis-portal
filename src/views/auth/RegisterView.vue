<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'

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
              <v-divider class="my-5"></v-divider>
              <RegisterForm></RegisterForm>
              <v-divider class="my-5"></v-divider>
              <h5 class="text-center">
                Already have an account?
                <RouterLink to="/">Click here to Login</RouterLink>
              </h5>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row></template
    >
  </AppLayout>
</template>
