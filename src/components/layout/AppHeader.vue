<script setup>
import { useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase'
import { ref, onMounted, watch } from 'vue'
import { useTheme } from 'vuetify'

const router = useRouter()

// State to store the current user and loading status
const user = ref(null)
const isLoading = ref(true)
const isAdmin = ref(false)

// Dark mode state
const theme = useTheme()
const isDark = ref(false)

// Drawer state for mobile navigation
const drawer = ref(false)

// Toggle dark mode function
const toggleDarkMode = () => {
  isDark.value = !isDark.value
  theme.global.name.value = isDark.value ? 'dark' : 'light'
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

const saveSettings = () => {
  loading.value = true
  try {
    // Save settings to localStorage
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  } finally {
    loading.value = false
  }
}

// Hardcoded list of admin emails
const adminEmails = [
  'yssahjulianah.barcial@carsu.edu.ph',
  'lovellhudson.clavel@carsu.edu.ph',
  'altheaguila.gorres@carsu.edu.ph',
  'magnoliajamkee.masong@carsu.edu.ph',
]

// Fetch the current user from Supabase
const fetchCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser()
  if (error) {
    console.error('Error fetching user:', error.message)
    return
  }
  user.value = data.user
  isAdmin.value = adminEmails.includes(data.user?.email)
}

// Fetch user on component mount
onMounted(async () => {
  // Load settings from localStorage
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
    theme.global.name.value = savedTheme
  }

  await fetchCurrentUser()
  isLoading.value = false
})

// Watch for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    user.value = session.user
    isAdmin.value = adminEmails.includes(session.user?.email)
  } else if (event === 'SIGNED_OUT') {
    user.value = null
    isAdmin.value = false
  }
})

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
        <div
          class="d-flex align-center hover-container"
          @click="goTo('dashboard')"
          style="cursor: pointer"
        >
          <v-img
            src="/images/ccisLogo7.png"
            alt="CCIS Logo"
            max-width="160"
            height="160"
            class="mr-2"
            transition="none"
            cover
          />
        </div>
      </v-toolbar-title>

      <!-- Desktop Navigation -->
      <div class="d-none d-md-flex align-center gap-4">
        <v-btn
          variant="text"
          @click="goTo('dashboard')"
          class="text-white"
          prepend-icon="mdi-widgets"
        >
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
        <!-- Admin Button (Visible Only to Admin Emails) -->
        <v-btn
          v-if="!isLoading && isAdmin"
          variant="text"
          @click="goTo('admin')"
          class="text-white"
          prepend-icon="mdi-shield-account"
        >
          Admin
        </v-btn>
        <v-btn icon @click="drawer = !drawer">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
      </div>

      <!-- Mobile Navigation -->
      <v-btn icon class="d-md-none" @click="drawer = !drawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-container>
  </v-app-bar>

  <!-- Navigation Drawer -->
  <v-navigation-drawer v-model="drawer" app temporary class="mobile-drawer">
    <v-list>
      <v-list-item @click="goTo('dashboard')">
        <v-list-item-icon>
          <v-icon class="orange-text">mdi-widgets</v-icon>
        </v-list-item-icon>
        <v-list-item-title class="orange-text">Dashboard</v-list-item-title>
      </v-list-item>

      <v-list-item @click="goTo('syllabi')">
        <v-list-item-icon>
          <v-icon class="orange-text">mdi-book-open-page-variant</v-icon>
        </v-list-item-icon>
        <v-list-item-title class="orange-text">Syllabi</v-list-item-title>
      </v-list-item>

      <v-list-item @click="goTo('theses')">
        <v-list-item-icon>
          <v-icon class="orange-text">mdi-clipboard-text</v-icon>
        </v-list-item-icon>
        <v-list-item-title class="orange-text">Theses</v-list-item-title>
      </v-list-item>

      <v-list-item v-if="!isLoading && isAdmin" @click="goTo('admin')">
        <v-list-item-icon>
          <v-icon class="orange-text">mdi-shield-account</v-icon>
        </v-list-item-icon>
        <v-list-item-title class="orange-text">Admin</v-list-item-title>
      </v-list-item>

      <v-divider></v-divider>

      <v-list-item @click="goTo('profile')">
        <v-list-item-icon>
          <v-icon class="orange-text">mdi-account-circle</v-icon>
        </v-list-item-icon>
        <v-list-item-title class="orange-text">Profile</v-list-item-title>
      </v-list-item>

      <v-list-item @click="goTo('settings')">
        <v-list-item-icon>
          <v-icon class="orange-text">mdi-cog</v-icon>
        </v-list-item-icon>
        <v-list-item-title class="orange-text">Settings</v-list-item-title>
      </v-list-item>

      <v-list-item @click="handleLogout">
        <v-list-item-icon>
          <v-icon class="orange-text">mdi-logout</v-icon>
        </v-list-item-icon>
        <v-list-item-title class="orange-text">Logout</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
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

/* Text popup style with shadow */
::v-deep(.menu-text-tooltip.v-overlay__content) {
  background-color: transparent !important;
  color: #f1702b !important;
  font-weight: 600;
  font-size: 12px;
  padding: 4px 4px;
  text-shadow: 2px 2px 4px rgba(156, 142, 142, 0.7);
  box-shadow: none;
}

/* Keep existing custom tooltip style for reference */
::v-deep(.custom-tooltip.v-overlay__content) {
  background-color: #fff3e0 !important; /* light orange */
  color: #e65100 !important; /* dark orange text */
  font-weight: 500;
  font-size: 13px;
  padding: 6px 12px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.hover-container {
  display: inline-flex;
  align-items: center;
}

.hover-container > v-img,
.hover-container > span {
  cursor: pointer; /* Pointer cursor only on the logo and title */
}

/* From Uiverse.io by JustCode14 */
/* Theme Switch */
/* The switch - the box around the slider */
.switch {
  font-size: 17px;
  position: relative;
  display: inline-block;
  width: 4em;
  height: 2.2em;
  border-radius: 30px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #2a2a2a;
  transition: 0.4s;
  border-radius: 30px;
  overflow: hidden;
}

.slider:before {
  position: absolute;
  content: '';
  height: 1.2em;
  width: 1.2em;
  border-radius: 20px;
  left: 0.5em;
  bottom: 0.5em;
  transition: 0.4s;
  transition-timing-function: cubic-bezier(0.81, -0.04, 0.38, 1.5);
  box-shadow: inset 8px -4px 0px 0px #fff;
}

.switch input:checked + .slider {
  background-color: #f16524;
}

.switch input:checked + .slider:before {
  transform: translateX(1.8em);
  box-shadow: inset 15px -4px 0px 15px #ffcf48;
}

.star {
  background-color: #fff;
  border-radius: 50%;
  position: absolute;
  width: 5px;
  transition: all 0.4s;
  height: 5px;
}

.star_1 {
  left: 2.5em;
  top: 0.5em;
}

.star_2 {
  left: 2.2em;
  top: 1.2em;
}

.star_3 {
  left: 3em;
  top: 0.9em;
}

.switch input:checked ~ .slider .star {
  opacity: 0;
}

.cloud {
  width: 3.5em;
  position: absolute;
  bottom: -1.4em;
  left: -1.1em;
  opacity: 0;
  transition: all 0.4s;
}

.switch input:checked ~ .slider .cloud {
  opacity: 1;
}

/* Mobile Drawer Background */
.mobile-drawer {
  background-color: white; /* Set the background to white */
}

/* Orange Text for Mobile Drawer */
.orange-text {
  color: #e65100 !important; /* orange-darken-4 */
}
</style>
