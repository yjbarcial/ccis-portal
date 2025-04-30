<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/utils/supabase'
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
})

const router = useRouter()
const authStore = useAuthStore()

const isDarkMode = ref(false) // Track dark mode state

const goTo = (route) => router.push({ name: route })

const handleLogout = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Logout failed:', error.message)
    return
  }
  router.push({ name: 'login' })
}

// Watch the dark mode setting and update localStorage
watch(isDarkMode, (newVal) => {
  document.body.classList.toggle('dark', newVal)
  localStorage.setItem('theme', newVal ? 'dark' : 'light')
})

// Load saved theme preference from localStorage
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    isDarkMode.value = true
    document.body.classList.add('dark')
  } else {
    isDarkMode.value = false
    document.body.classList.remove('dark')
  }
})
</script>

<template>
  <v-app-bar color="orange-darken-4" dark flat app>
    <v-container fluid class="d-flex align-center justify-space-between">
      <v-toolbar-title>
        <div class="d-flex align-center" style="cursor: pointer" @click="goTo('dashboard')">
          <v-img
            src="/images/ccisLogo.png"
            alt="CCIS Logo"
            max-width="25"
            height="25"
            class="mr-1"
            transition="none"
            cover
          />
          <span>{{ title }}</span>
        </div>
      </v-toolbar-title>

      <div class="d-flex align-center gap-4">
        <v-btn variant="text" @click="goTo('dashboard')" class="text-white" prepend-icon="mdi-home"
          >Dashboard</v-btn
        >
        <v-btn
          variant="text"
          @click="goTo('syllabi')"
          class="text-white"
          prepend-icon="mdi-book-open-page-variant"
          >Syllabi</v-btn
        >
        <v-btn
          variant="text"
          @click="goTo('theses')"
          class="text-white"
          prepend-icon="mdi-clipboard-text"
          >Theses</v-btn
        >

        <!-- User Menu -->
        <v-menu location="bottom end">
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props">
              <v-avatar color="orange-darken-2" size="36">
                <v-icon>mdi-account</v-icon>
              </v-avatar>
            </v-btn>
          </template>

          <v-list>
            <v-list-item @click="goTo('profile')">
              <template v-slot:prepend>
                <v-icon>mdi-account-circle</v-icon>
              </template>
              <v-list-item-title>Profile</v-list-item-title>
            </v-list-item>

            <v-list-item @click="goTo('settings')">
              <template v-slot:prepend>
                <v-icon>mdi-cog</v-icon>
              </template>
              <v-list-item-title>Settings</v-list-item-title>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item @click="handleLogout" color="error">
              <template v-slot:prepend>
                <v-icon>mdi-logout</v-icon>
              </template>
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-container>
  </v-app-bar>
</template>
