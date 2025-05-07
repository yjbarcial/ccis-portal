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
    <!-- Content -->
    <v-row class="flex-grow-1 mt-5" align="center" justify="center">
      <v-col cols="12" sm="5" md="4" class="text-center" :class="{ 'mb-8': mobile }">
        <!-- Logo -->
        <v-img
          src="/images/ccisPortal.svg"
          width="86%"
          :width="mobile ? '65%' : sm ? '150px' : '200px'"
          class="mx-auto mb-4"
          style="will-change: transform"
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
          <RegisterForm />
        </v-card>
      </v-col>
    </v-row>
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
    padding: 0 !important;
  }
  .register-footer span {
    font-size: 0.9rem;
  }
}
</style>
