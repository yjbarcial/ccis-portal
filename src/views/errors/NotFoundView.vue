<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const goHome = () => {
  router.push({ name: 'dashboard' }) // Replace with your dashboard route name
}
</script>

<template>
    <v-container class="text-center mt-10">
      <h1 class="text-h2 font-weight-bold mb-4">404 - Page Not Found</h1>
      <p class="mb-6">The page you're looking for doesn't exist.</p>
      <v-btn color="orange-darken-3" @click="goHome">Back to Dashboard</v-btn>
    </v-container>
  </template>