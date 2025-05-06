<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import LoginForm from '@/components/auth/LoginForm.vue'

import { useDisplay } from 'vuetify'
const { mobile, xs, sm } = useDisplay()
</script>

<template>
  <v-container
    fluid
    class="d-flex flex-column justify-between pa-4"
    style="min-height: 100vh; position: relative"
  >
    <!-- Background Image -->
    <v-img
      src="/images/background5.png"
      cover
      class="position-absolute"
      style="
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: -1;
        /* filter: brightness(1) blur(.8px); */
      "
    ></v-img>

    <!-- Content -->
    <v-row class="flex-grow-1" align="center" justify="center">
      <v-col cols="12" sm="5" md="4" class="text-center" :class="{ 'mb-8': mobile }">
        <!-- Logo -->
        <v-img
          src="/images/ccisPortal.svg"
          width="86%"
          :width="mobile ? '65%' : sm ? '150px' : '200px'"
          class="mx-auto mb-4"
        />
      </v-col>
      <v-col cols="12" sm="7" md="6" class="text-center d-flex justify-center">
        <!-- Form -->
        <v-card
          elevation="6"
          :class="mobile ? 'mx-2' : sm ? 'mx-6' : 'mx-12'"
          class="pa-4"
          style="
            background-color: rgba(255, 255, 255, 0.5);
            border-radius: 16px;
            max-width: 450px;
            width: 100%;
          "
        >
          <LoginForm />
        </v-card>
      </v-col>
    </v-row>

    <v-footer class="py-3" style="background-color: transparent; position: relative; width: 100%">
      <v-row class="d-flex justify-center">
        <v-col class="text-center">
          <v-avatar size="24" class="mr-2">
            <v-img src="/images/ccisLogo.png" alt="CCIS Logo" />
          </v-avatar>
          <span class="text-white" :class="{ 'text-body-2': mobile }">
            &copy; 2025
            <a
              href="https://www.facebook.com/cciscarsu"
              class="text-orange text-decoration-none"
              target="_blank"
              rel="noopener noreferrer"
            >
              CCIS.</a
            >
            All rights reserved.
          </span>
        </v-col>
      </v-row>
    </v-footer>
  </v-container>
</template>
