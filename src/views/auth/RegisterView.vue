<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'

import { useDisplay } from 'vuetify'
const { mobile } = useDisplay()
</script>

<template>
  <v-container
    fluid
    class="d-flex flex-column justify-between pa-0 register-main-container"
    style="min-height: 100vh; position: relative"
  >
    <v-img
      style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-image: url('/images/background5.png');
        background-size: cover;
        background-position: center;
        z-index: -1;
      "
    ></v-img>
    <!-- Content -->
    <v-row class="flex-grow-1 mt-2" align="center" justify="center">
      <v-col cols="12" sm="5" md="4" class="text-center" :class="{ 'mb-0': mobile }">
        <!-- Logo -->
        <v-img
          src="/images/ccisPortal.svg"
          width="86%"
          :width="mobile ? '65%' : sm ? '150px' : '200px'"
          class="mx-auto portal-logo"
          style="will-change: transform"
        />
      </v-col>
      <v-col cols="12" sm="7" md="6" class="text-center d-flex justify-center second-col">
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
          <RegisterForm />
        </v-card>
      </v-col>
    </v-row>
    <v-footer
      class="login-footer mt-auto"
      style="background-color: transparent; position: relative; width: 100%"
    >
      <v-row class="d-flex justify-center">
        <v-col class="text-center">
          <v-avatar size="24" class="mr-2" style="will-change: transform">
            <v-img src="/images/portalLogo.png" alt="CCIS Logo" style="will-change: transform" />
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
.register-main-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0 !important;
}

.register-footer {
  width: 100%;
  background: transparent;
  position: relative;
  margin-top: auto;
}
@media (max-width: 600px) {
  .register-main-container {
    padding: 10px !important;
  }

  .portal-logo {
    max-height: 100px;
  }
  .register-footer span {
    font-size: 0.9rem;
  }

  .second-col {
    margin-bottom: 10px !important;
  }
}
</style>
