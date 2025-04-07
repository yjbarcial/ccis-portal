<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import LoginForm from '@/components/auth/LoginForm.vue'

import { useDisplay } from 'vuetify'
const { mobile } = useDisplay()
</script>

<template>
  <v-container
    fluid
    class="d-flex align-center justify-center pa-0"
    style="height: 100vh; position: relative"
  >
    <!-- Background Image -->
    <v-img
      src="/images/ccisHiraya.jpg"
      cover
      class="position-absolute"
      style="top: 0; left: 0; width: 100vw; height: 100vh; z-index: -1; filter: brightness(0.5)"
    ></v-img>

    <!-- Content -->
    <v-row class="fill-height" align="center" justify="center">
      <v-col cols="12" md="5" class="text-center">
        <!-- Logo -->
        <v-img src="/images/ccisLogo.png" :width="mobile ? '65%' : '120px'" class="mx-auto mb-4" />

        <!-- Title -->
        <h2 class="text-white font-weight-bold mb-4">CCIS Syllabus & Thesis Portal</h2>

        <!-- Form -->
        <v-card
          elevation="6"
          class="mx-auto pa-5"
          style="background-color: rgba(255, 255, 255, 0.9); border-radius: 16px; max-width: 520px"
        >
          <LoginForm />
        </v-card>
      </v-col>
    </v-row>

    <!-- Footer -->
    <v-footer
      class="py-4"
      style="position: absolute; bottom: 0; width: 100%; background-color: rgba(0, 0, 0, 0.7)"
    >
      <v-row class="d-flex justify-center">
        <v-col class="text-center">
          <span class="text-white">© 2025 CCIS. All Rights Reserved.</span>
        </v-col>
      </v-row>
    </v-footer>
  </v-container>
</template>
