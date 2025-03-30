<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'

import { useDisplay } from 'vuetify'
const { mobile } = useDisplay()
</script>

<template>
  <AppLayout>
    <template #content>
      <v-container
        fluid
        class="pa-0 d-flex align-center justify-center"
        style="
          height: 100vh;
          background: url('/images/ccisHiraya.jpg') no-repeat center center / cover;
          overflow: hidden;
        "
      >
        <v-row class="fill-height d-flex align-center justify-center">
          <v-col cols="12" md="4" class="d-flex flex-column align-center">
            <v-img src="images/ccisLogo.png" :width="mobile ? '55%' : '30%'" class="mb-4"></v-img>

            <!-- Title Outside the Card -->
            <div class="text-center mb-3">
              <h3 class="font-weight-black text-white">CCIS Syllabus Management System</h3>
              <p class="text-white">Login Form</p>
            </div>

            <!-- Card with Fixed Width & Height -->
            <v-card class="mx-auto" elevation="24" width="400" min-height="380">
              <v-card-text class="pt-4">
                <v-divider class="my-5"></v-divider>
                <RegisterForm></RegisterForm>
                <v-divider class="my-5"></v-divider>

                <h5 class="text-center">
                  Already have an account?
                  <RouterLink class="text-deep-orange font-weight-black" to="/"
                    >Click here to Login</RouterLink
                  >
                </h5>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </AppLayout>
</template>
