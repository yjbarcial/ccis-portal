<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import LoginForm from '@/components/auth/LoginForm.vue'

import { useDisplay } from 'vuetify'
const { mobile, xs, sm } = useDisplay()
</script>

<template>
  <v-container
    fluid
    class="d-flex flex-column justify-between pa-0 login-main-container"
    style="min-height: 100vh; position: relative"
  >
    <!-- Background Image -->
    <v-img
      src="/images/background5.png"
      cover
      class="position-absolute login-bg-img"
      style="inset: 0; width: 100vw; height: 100vh; object-fit: cover; z-index: -1"
    ></v-img>

    <!-- Content -->
    <v-row class="flex-grow-1 mt-5" align="center" justify="center">
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

    <v-footer
      class="login-footer mt-auto"
      style="background-color: transparent; position: relative; width: 100%"
    >
      <v-row class="d-flex justify-center">
        <v-col class="text-center">
          <v-avatar size="24" class="mr-2">
            <v-img src="/images/portalLogo.png" alt="CCIS Logo" />
          </v-avatar>
          <span
            class="text-white"
            :class="{ 'text-body-2': mobile }"
            style="text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5)"
          >
            &copy; 2025
            <a
              href="https://www.facebook.com/cciscarsu"
              class="text-deep-orange text-decoration-none"
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

<style scoped>
.login-main-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0 !important;
}
.login-bg-img {
  position: fixed !important;
  top: 0;
  left: 0;
  width: 100vw !important;
  height: 100vh !important;
  object-fit: cover !important;
  z-index: -1;
}
.login-footer {
  width: 100%;
  background: transparent;
  position: relative;
  margin-top: auto;
}
@media (max-width: 600px) {
  .login-main-container {
    padding: 0 !important;
  }
  .login-footer span {
    font-size: 0.9rem;
  }
}
</style>
