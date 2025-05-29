<script setup>
import { useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase'
import { ref, onMounted, watch } from 'vue'
import { useTheme } from 'vuetify'
import { ADMIN_EMAILS } from '@/utils/constants'

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
const profileDropdown = ref(false) // State for profile dropdown in mobile drawer

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

// Fetch the current user from Supabase
const fetchCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser()
  if (error) {
    console.error('Error fetching user:', error.message)
    return
  }
  user.value = data.user
  isAdmin.value = ADMIN_EMAILS.includes(data.user?.email)
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
    isAdmin.value = ADMIN_EMAILS.includes(session.user?.email)
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
        <v-btn
          v-if="!isLoading && isAdmin"
          variant="text"
          @click="goTo('admin')"
          class="text-white"
          prepend-icon="mdi-shield-account"
        >
          Admin
        </v-btn>
        <v-menu location="bottom center">
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props">
              <v-avatar color="orange-darken-4" size="36">
                <v-icon>mdi-menu</v-icon>
              </v-avatar>
            </v-btn>
          </template>

          <v-list class="d-flex flex-column align-center" id="listbox">
            <v-tooltip text="Profile" location="left" content-class="custom-tooltip">
              <template v-slot:activator="{ props }">
                <v-list-item @click="goTo('profile')" class="justify-center">
                  <v-icon>mdi-account-circle</v-icon>
                </v-list-item>
              </template>
            </v-tooltip>

            <v-tooltip text="Settings" location="left" content-class="custom-tooltip">
              <template v-slot:activator="{ props }">
                <v-list-item @click="goTo('settings')" class="justify-center">
                  <v-icon>mdi-cog</v-icon>
                </v-list-item>
              </template>
            </v-tooltip>

            <v-divider />

            <v-tooltip text="Logout" location="left" content-class="custom-tooltip">
              <template v-slot:activator="{ props }">
                <v-list-item @click="handleLogout" class="justify-center">
                  <v-icon>mdi-logout</v-icon>
                </v-list-item>
              </template>
            </v-tooltip>
          </v-list>
        </v-menu>
        <label class="switch mx-3">
          <input
            type="checkbox"
            :checked="!isDark"
            @change="toggleDarkMode"
            style="z-index: 2; position: relative"
          />
          <span class="slider">
            <div class="star star_1"></div>
            <div class="star star_2"></div>
            <div class="star star_3"></div>
            <svg viewBox="0 0 16 16" class="cloud_1 cloud">
              <path
                transform="matrix(.77976 0 0 .78395-299.99-418.63)"
                fill="#fff"
                d="m391.84 540.91c-.421-.329-.949-.524-1.523-.524-1.351 0-2.451 1.084-2.485 2.435-1.395.526-2.388 1.88-2.388 3.466 0 1.874 1.385 3.423 3.182 3.667v.034h12.73v-.006c1.775-.104 3.182-1.584 3.182-3.395 0-1.747-1.309-3.186-2.994-3.379.007-.106.011-.214.011-.322 0-2.707-2.271-4.901-5.072-4.901-2.073 0-3.856 1.202-4.643 2.925"
              ></path>
            </svg>
          </span>
        </label>
      </div>

      <!-- Mobile Navigation -->
      <v-btn icon class="d-md-none" @click="drawer = !drawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-container>
  </v-app-bar>

  <!-- Mobile Navigation Drawer -->
  <v-navigation-drawer v-model="drawer" app temporary class="mobile-drawer d-md-none">
    <v-list class="pa-0">
      <!-- User Profile Section -->
      <v-list-item class="user-profile-section">
        <v-avatar color="orange-darken-4" size="48" class="mb-2">
          <v-icon size="24" color="white">mdi-account</v-icon>
        </v-avatar>
        <v-list-item-title class="text-subtitle-1 font-weight-bold text-white">
          {{ user?.user_metadata?.full_name || 'Guest' }}
        </v-list-item-title>
        <v-list-item-subtitle class="text-caption text-white">
          {{ user?.user_metadata?.department || 'Department' }}
        </v-list-item-subtitle>
        <v-list-item-subtitle class="text-caption text-white">
          {{ user?.user_metadata?.position || 'Position' }}
        </v-list-item-subtitle>
      </v-list-item>

      <v-divider class="my-2"></v-divider>

      <!-- Navigation Section -->
      <v-list-subheader class="text-uppercase font-weight-bold text-orange-darken-4">
        Navigation
      </v-list-subheader>

      <v-list-item
        @click="goTo('dashboard')"
        :class="{ 'active-item': currentRoute === 'dashboard' }"
        class="list-item-centered"
        rounded="lg"
      >
        <template v-slot:prepend>
          <v-icon icon="mdi-widgets" color="orange-darken-4" class="me-3"></v-icon>
        </template>
        <v-list-item-title class="text-body-1">Dashboard</v-list-item-title>
      </v-list-item>

      <v-list-item
        @click="goTo('syllabi')"
        :class="{ 'active-item': currentRoute === 'syllabi' }"
        class="list-item-centered"
        rounded="lg"
      >
        <template v-slot:prepend>
          <v-icon icon="mdi-book-open-page-variant" color="orange-darken-4" class="me-3"></v-icon>
        </template>
        <v-list-item-title class="text-body-1">Syllabi</v-list-item-title>
      </v-list-item>

      <v-list-item
        @click="goTo('theses')"
        :class="{ 'active-item': currentRoute === 'theses' }"
        class="list-item-centered"
        rounded="lg"
      >
        <template v-slot:prepend>
          <v-icon icon="mdi-clipboard-text" color="orange-darken-4" class="me-3"></v-icon>
        </template>
        <v-list-item-title class="text-body-1">Theses</v-list-item-title>
      </v-list-item>

      <v-list-item
        v-if="!isLoading && isAdmin"
        @click="goTo('admin')"
        :class="{ 'active-item': currentRoute === 'admin' }"
        class="list-item-centered"
        rounded="lg"
      >
        <template v-slot:prepend>
          <v-icon icon="mdi-shield-account" color="orange-darken-4" class="me-3"></v-icon>
        </template>
        <v-list-item-title class="text-body-1">Admin</v-list-item-title>
      </v-list-item>

      <v-divider class="my-2"></v-divider>

      <!-- User Actions Section -->
      <v-list-subheader class="text-uppercase font-weight-bold text-orange-darken-4">
        User Actions
      </v-list-subheader>

      <v-list-item
        @click="goTo('profile')"
        :class="{ 'active-item': currentRoute === 'profile' }"
        class="list-item-centered"
        rounded="lg"
      >
        <template v-slot:prepend>
          <v-icon icon="mdi-account-circle" color="orange-darken-4" class="me-3"></v-icon>
        </template>
        <v-list-item-title class="text-body-1">Profile</v-list-item-title>
      </v-list-item>

      <v-list-item
        @click="goTo('settings')"
        :class="{ 'active-item': currentRoute === 'settings' }"
        class="list-item-centered"
        rounded="lg"
      >
        <template v-slot:prepend>
          <v-icon icon="mdi-cog" color="orange-darken-4" class="me-3"></v-icon>
        </template>
        <v-list-item-title class="text-body-1">Settings</v-list-item-title>
      </v-list-item>

      <v-divider class="my-2"></v-divider>

      <!-- Preferences Section -->
      <v-list-subheader class="text-uppercase font-weight-bold text-orange-darken-4">
        Preferences
      </v-list-subheader>

      <v-list-item class="list-item-centered" rounded="lg">
        <div class="d-flex flex-column align-start w-100">
          <v-list-item-title class="text-body-1 text-orange-darken-4 mb-2"
            >Dark Mode</v-list-item-title
          >
          <label class="switch">
            <input
              type="checkbox"
              :checked="!isDark"
              @change="toggleDarkMode"
              style="z-index: 2; position: relative"
            />
            <span class="slider">
              <div class="star star_1"></div>
              <div class="star star_2"></div>
              <div class="star star_3"></div>
              <svg viewBox="0 0 16 16" class="cloud_1 cloud">
                <path
                  transform="matrix(.77976 0 0 .78395-299.99-418.63)"
                  fill="#fff"
                  d="m391.84 540.91c-.421-.329-.949-.524-1.523-.524-1.351 0-2.451 1.084-2.485 2.435-1.395.526-2.388 1.88-2.388 3.466 0 1.874 1.385 3.423 3.182 3.667v.034h12.73v-.006c1.775-.104 3.182-1.584 3.182-3.395 0-1.747-1.309-3.186-2.994-3.379.007-.106.011-.214.011-.322 0-2.707-2.271-4.901-5.072-4.901-2.073 0-3.856 1.202-4.643 2.925"
                ></path>
              </svg>
            </span>
          </label>
        </div>
      </v-list-item>

      <v-list-item @click="handleLogout" class="list-item-centered mt-4" rounded="lg">
        <template v-slot:prepend>
          <v-icon icon="mdi-logout" color="error" class="me-3"></v-icon>
        </template>
        <v-list-item-title class="text-body-1 text-error">Logout</v-list-item-title>
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

/* Modern Mobile Drawer Styling */
.mobile-drawer {
  background-color: rgb(var(--v-theme-background));
  border-right: 1px solid rgba(0, 0, 0, 0.08);
}

.user-profile-section {
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-orange-darken-4)) 0%,
    rgb(var(--v-theme-orange)) 100%
  );
  padding: 20px 16px;
  text-align: center;
  color: white;
}

.user-profile-section .v-list-item-title,
.user-profile-section .v-list-item-subtitle {
  color: black !important;
  line-height: 1.2;
}

.v-list-subheader {
  opacity: 0.8;
  letter-spacing: 0.5px;
  padding: 16px 16px 8px;
}

.list-item-centered {
  margin: 4px 8px;
  transition: all 0.3s ease;
  padding: 12px 16px;
}

.list-item-centered:hover {
  background-color: rgb(var(--v-theme-orange-lighten-5));
  transform: translateX(4px);
}

.active-item {
  background-color: rgb(var(--v-theme-orange-lighten-5));
  border-left: 4px solid rgb(var(--v-theme-orange-darken-4));
}

.active-item .v-list-item-title {
  color: rgb(var(--v-theme-orange-darken-4));
  font-weight: 500;
}

.v-list-item-title {
  font-size: 0.95rem;
  font-weight: 400;
  transition: color 0.3s ease;
  color: rgba(0, 0, 0, 0.87);
}

.v-divider {
  opacity: 0.1;
}

/* Keep the original Uiverse dark mode switch styles */
.switch {
  font-size: 17px;
  position: relative;
  display: inline-block;
  width: 4em;
  height: 2.2em;
  border-radius: 30px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

/* ... rest of the Uiverse switch styles ... */
</style>
