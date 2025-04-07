<script setup>
import { ref } from 'vue'
</script>

<template>
  <v-responsive>
    <v-app :theme="theme">
      <v-main class="d-flex flex-column" style="min-height: 100vh">
        <v-container class="flex-grow-1">
          <slot name="content"></slot>
        </v-container>
      </v-main>

      <!-- Footer stays at the bottom -->
      <v-footer class="font-weight-bold" color="transparent" border app>
        2024 - CCIS Syllabus Management System
      </v-footer>
    </v-app>
  </v-responsive>
</template>
