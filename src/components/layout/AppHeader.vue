<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/utils/supabase'
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
})

const router = useRouter()
const authStore = useAuthStore()

const goTo = (route) => router.push({ name: route })

const handleLogout = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Logout failed:', error.message)
    return
  }
  router.push({ name: 'login' })
}
</script>

<template>
  <v-app-bar color="orange-darken-4" dark flat app>
    <v-container fluid class="d-flex align-center justify-space-between">
      <v-toolbar-title>
        <div class="d-flex align-center" style="cursor: pointer" @click="goTo('dashboard')">
          <v-img
            src="/images/ccisLogo.png"
            alt="CCIS Logo"
            max-width="30"
            height="30"
            class="mr-1"
            cover
          />
          <span>{{ title }}</span>
        </div>
      </v-toolbar-title>

      <div class="d-flex align-center gap-4">
        <v-btn variant="text" @click="goTo('dashboard')" class="text-white">Dashboard</v-btn>
        <v-btn variant="text" @click="goTo('syllabi')" class="text-white">Syllabi</v-btn>
        <v-btn variant="text" @click="goTo('theses')" class="text-white">Theses</v-btn>

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
