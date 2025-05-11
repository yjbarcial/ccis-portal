<script setup>
import { useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase'
import { ref, onMounted, watch } from 'vue'

const router = useRouter()

// State to store the current user and loading status
const user = ref(null)
const isLoading = ref(true)
const isAdmin = ref(false)

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
        <div class="d-flex align-center hover-container" @click="goTo('home')">
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
              <div class="position-relative">
                <v-tooltip text="Profile" location="left" content-class="menu-text-tooltip">
                  <template v-slot:activator="{ props }">
                    <v-list-item v-bind="props" @click="goTo('profile')" class="justify-center">
                      <v-icon>mdi-account-circle</v-icon>
                    </v-list-item>
                  </template>
                </v-tooltip>
              </div>

              <div class="position-relative">
                <v-tooltip text="Settings" location="left" content-class="menu-text-tooltip">
                  <template v-slot:activator="{ props }">
                    <v-list-item v-bind="props" @click="goTo('settings')" class="justify-center">
                      <v-icon>mdi-cog</v-icon>
                    </v-list-item>
                  </template>
                </v-tooltip>
              </div>

              <v-divider />

              <div class="position-relative">
                <v-tooltip text="Logout" location="left" content-class="menu-text-tooltip">
                  <template v-slot:activator="{ props }">
                    <v-list-item v-bind="props" @click="handleLogout" class="justify-center">
                      <v-icon>mdi-logout</v-icon>
                    </v-list-item>
                  </template>
                </v-tooltip>
              </div>
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
</style>
