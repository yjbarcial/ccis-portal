<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/utils/supabase'

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

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <v-app-bar color="orange-darken-4" dark flat app>
    <v-container fluid class="d-flex align-center justify-space-between">
      <!-- Logo and Title -->
      <v-toolbar-title>
        <div class="d-flex align-center" style="cursor: pointer" @click="goTo('dashboard')">
          <v-img
            src="/images/portalLogo.png"
            alt="CCIS Logo"
            max-width="25"
            height="25"
            class="mr-2 rounded-circle"
            transition="none"
            cover
          />
          <span>{{ title }}</span>
        </div>
      </v-toolbar-title>

      <!-- Navigation Buttons -->
      <div class="d-flex align-center gap-4">
        <v-btn variant="text" @click="goTo('dashboard')" class="text-white" prepend-icon="mdi-home">
          Dashboard
        </v-btn>
        <v-btn
          variant="text"
          @click="goTo('syllabi')"
          class="text-white"
          prepend-icon="mdi-book-open-page-variant"
        >
          Syllabi
        </v-btn>
        <v-btn
          variant="text"
          @click="goTo('theses')"
          class="text-white"
          prepend-icon="mdi-clipboard-text"
        >
          Theses
        </v-btn>

        <!-- User Menu with Tonal Tooltips -->
        <div class="d-flex justify-center align-center">
          <v-menu location="bottom center">
            <template v-slot:activator="{ props }">
              <v-btn icon v-bind="props">
                <v-avatar color="orange-darken-2" size="36">
                  <v-icon>mdi-menu</v-icon>
                </v-avatar>
              </v-btn>
            </template>

            <v-list class="d-flex flex-column align-center" id="listbox">
              <v-tooltip text="Profile" location="left" content-class="custom-tooltip">
                <template v-slot:activator="{ props }">
                  <v-list-item @click="goTo('profile')" v-bind="props" class="justify-center">
                    <v-icon>mdi-account-circle</v-icon>
                  </v-list-item>
                </template>
              </v-tooltip>

              <v-tooltip text="Settings" location="left" content-class="custom-tooltip">
                <template v-slot:activator="{ props }">
                  <v-list-item @click="goTo('settings')" v-bind="props" class="justify-center">
                    <v-icon>mdi-cog</v-icon>
                  </v-list-item>
                </template>
              </v-tooltip>

              <v-divider />

              <v-tooltip text="Logout" location="left" content-class="custom-tooltip">
                <template v-slot:activator="{ props }">
                  <v-list-item @click="handleLogout" v-bind="props" class="justify-center">
                    <v-icon>mdi-logout</v-icon>
                  </v-list-item>
                </template>
              </v-tooltip>
            </v-list>
          </v-menu>
        </div>
      </div>
    </v-container>
  </v-app-bar>
</template>

<style scoped>
#listbox {
  background-color: #e65100;
  border-radius: 30px;
  margin-top: 12px;
}
.v-list-item {
  border-radius: 20px;
  color: white;
}

/* Tonal-style tooltip */
::v-deep(.custom-tooltip.v-overlay__content) {
  background-color: #fff3e0 !important; /* light orange */
  color: #e65100 !important;            /* dark orange text */
  font-weight: 500;
  font-size: 13px;
  padding: 6px 12px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
</style>
