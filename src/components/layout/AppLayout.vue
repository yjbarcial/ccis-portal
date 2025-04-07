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
    </v-app>
  </v-responsive>
</template>
