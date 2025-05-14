<script setup>
import { ref, onMounted, watch } from 'vue'
import { useTheme } from 'vuetify'

// Access theme from Vuetify
const theme = useTheme()

// Reactive state for dark mode
const isDark = ref(false)

// Load theme preference on mount
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
  }
})

// Watch for theme changes
watch(
  () => theme.global.name.value,
  (newTheme) => {
    isDark.value = newTheme === 'dark'
  },
)
</script>

<template>
  <v-footer class="py-3" :class="{ 'bg-dark': isDark, 'bg-light': !isDark }">
    <v-row class="d-flex justify-center">
      <v-col class="text-center">
        <hr style="border: 0; height: 1px; background-color: orange" />
        <br />
        <v-avatar size="28" class="mr-2 mb-1">
          <v-img src="/images/portalLogo.png" alt="CCIS Logo" />
        </v-avatar>
        <span :class="{ 'text-white': isDark }">
          &copy; 2025
          <a
            href="https://www.facebook.com/cciscarsu"
            class="text-orange text-decoration-none"
            target="_blank"
            rel="noopener noreferrer"
          >
            CCIS </a
          >. All rights reserved.
        </span>
      </v-col>
    </v-row>
  </v-footer>
</template>

<style scoped>
.bg-dark {
  background-color: #121212 !important;
}

.bg-light {
  background-color: white !important;
}

.text-orange {
  color: #e65100 !important;
}
</style>
