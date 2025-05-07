<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import AppFooter from './components/layout/AppFooter.vue'

onMounted(() => {
  // Ensure images are loaded
  const images = document.querySelectorAll('img')
  images.forEach((img) => {
    if (!img.complete) {
      img.style.opacity = '0'
      img.onload = () => {
        img.style.opacity = '1'
      }
    }
  })
})
</script>

<template>
  <div class="app-container">
    <div class="app-background"></div>
    <!-- Preload logos -->
    <div class="preload-images">
      <img src="/images/ccisPortal.svg" alt="preload" />
      <img src="/images/portalLogo.png" alt="preload" />
    </div>
    <RouterView />
    <AppFooter />
  </div>
</template>

<style>
.app-container {
  position: relative;
  min-height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.app-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: url('/images/background5.png');
  background-size: cover;
  background-position: center;
  z-index: -1;
}

/* Ensure all content is above the background */
:deep(.v-application) {
  position: relative;
  z-index: 1;
}

/* Preload images */
.preload-images {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
  z-index: -1;
}

/* Image handling */
:deep(img) {
  transition: opacity 0.1s ease-in-out !important;
  will-change: opacity;
}

:deep(.v-img) {
  transition: none !important;
  will-change: transform;
}

:deep(.v-avatar) {
  transition: none !important;
  will-change: transform;
}

/* Prevent any transitions */
:deep(*) {
  transition: none !important;
  animation: none !important;
}
</style>
