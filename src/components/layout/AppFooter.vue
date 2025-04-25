<script setup>
import { ref } from 'vue'
</script>

<template>
  <v-footer
    class="py-3"
    style="
      background-color: transparent;
      width: 100%;
      bottom: 0px;
      z-index: 904;
      transform: translateY(50px);
      position: absolute;
      left: 0px;
      width: calc(100% + 0px);
    "
  >
    <v-row class="d-flex justify-center">
      <v-col class="text-center">
        <hr style="border: 0; height: 1px; background-color: orange" />
        <br />
        <v-avatar size="24" class="mr-2">
          <v-img src="/images/ccisLogo.png" alt="CCIS Logo" />
        </v-avatar>
        <span>&copy; 2025 CCIS. All Rights Reserved.</span>
      </v-col>
    </v-row>
  </v-footer>
</template>
