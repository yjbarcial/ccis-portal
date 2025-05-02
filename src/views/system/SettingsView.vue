<script setup>
import { ref, onMounted } from 'vue'
import { useTheme } from 'vuetify'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const theme = useTheme()
const isDark = ref(false)
const notifications = ref(true)
const emailNotifications = ref(true)
const loading = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  theme.global.name.value = isDark.value ? 'dark' : 'light'
  saveSettings()
}

const saveSettings = () => {
  loading.value = true
  try {
    // Save settings to localStorage
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    localStorage.setItem('notifications', notifications.value)
    localStorage.setItem('emailNotifications', emailNotifications.value)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // Load settings from localStorage
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
    theme.global.name.value = savedTheme
  }

  const savedNotifications = localStorage.getItem('notifications')
  if (savedNotifications) {
    notifications.value = savedNotifications === 'true'
  }

  const savedEmailNotifications = localStorage.getItem('emailNotifications')
  if (savedEmailNotifications) {
    emailNotifications.value = savedEmailNotifications === 'true'
  }
})
</script>

<template>
  <v-app>
    <app-header title="CCIS Portal" />
    <v-main>
      <v-container fluid class="py-6">
        <v-row>
          <v-col>
            <h1 class="text-h4 font-weight-bold mb-1">Settings</h1>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="8" lg="6">
            <v-card class="mb-4">
              <v-card-title class="text-h6">Appearance</v-card-title>
              <v-divider />
              <v-card-text>
                <v-list>
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon>mdi-theme-light-dark</v-icon>
                    </template>
                    <v-list-item-title>Dark Mode</v-list-item-title>
                    <template v-slot:append>
                      <v-switch
                        v-model="isDark"
                        color="orange-darken-3"
                        @change="toggleTheme"
                        :loading="loading"
                      />
                    </template>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>

            <v-card class="mb-4">
              <v-card-title class="text-h6">Notifications</v-card-title>
              <v-divider />
              <v-card-text>
                <v-list>
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon>mdi-bell</v-icon>
                    </template>
                    <v-list-item-title>Push Notifications</v-list-item-title>
                    <template v-slot:append>
                      <v-switch
                        v-model="notifications"
                        color="orange-darken-3"
                        @change="saveSettings"
                      />
                    </template>
                  </v-list-item>
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon>mdi-email</v-icon>
                    </template>
                    <v-list-item-title>Email Notifications</v-list-item-title>
                    <template v-slot:append>
                      <v-switch
                        v-model="emailNotifications"
                        color="orange-darken-3"
                        @change="saveSettings"
                      />
                    </template>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>

            <v-card>
              <v-card-title class="text-h6">About</v-card-title>
              <v-divider />
              <v-card-text>
                <v-list>
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon>mdi-information</v-icon>
                    </template>
                    <v-list-item-title>Version</v-list-item-title>
                    <v-list-item-subtitle>1.0.0</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon>mdi-copyright</v-icon>
                    </template>
                    <v-list-item-title>Copyright</v-list-item-title>
                    <v-list-item-subtitle>© 2024 CCIS Portal</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.v-card {
  border-radius: 12px;
  overflow: hidden;
}

.v-list-item {
  min-height: 48px;
}
</style>
