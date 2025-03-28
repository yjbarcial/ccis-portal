<script setup>
import { ref } from 'vue'
</script>

<template>
  <v-responsive>
    <v-app :theme="theme">
      <v-main>
        <v-container><slot name="content"></slot></v-container>
      </v-main>

      <v-footer class="font-weight-bold" color="" border app
        >2024 - CCIS Syllabus Management System</v-footer
      >
    </v-app>
  </v-responsive>
</template>
