<script setup>
import { ref } from 'vue'
</script>

<template>
  <v-responsive>
    <v-app :theme="theme">
      <v-main>
        <v-container fluid class="ma-0 pa-0"><slot name="content"></slot></v-container>
      </v-main>
    </v-app>
  </v-responsive>
</template>
