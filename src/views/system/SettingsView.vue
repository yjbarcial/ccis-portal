<template>
  <v-app>
    <app-header title="Settings" />

    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12" md="8" lg="6">
            <h1 class="text-h4 mb-6">Settings</h1>

            <!-- Notification Settings -->
            <v-card class="mb-6">
              <v-card-title>Notification Settings</v-card-title>
              <v-card-text>
                <v-switch
                  v-model="settings.emailNotifications"
                  label="Email Notifications"
                  color="orange-darken-4"
                ></v-switch>
                <v-switch
                  v-model="settings.pushNotifications"
                  label="Push Notifications"
                  color="orange-darken-4"
                ></v-switch>
              </v-card-text>
            </v-card>

            <!-- Theme Settings -->
            <v-card class="mb-6">
              <v-card-title>Theme Settings</v-card-title>
              <v-card-text>
                <v-select
                  v-model="settings.theme"
                  label="Theme"
                  :items="['light', 'dark', 'system']"
                  color="orange-darken-4"
                ></v-select>
              </v-card-text>
            </v-card>

            <!-- Save Button -->
            <v-btn color="orange-darken-4" @click="saveSettings" :loading="saving">
              Save Changes
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'

const saving = ref(false)
const settings = ref({
  emailNotifications: true,
  pushNotifications: false,
  theme: 'light',
})

const saveSettings = async () => {
  saving.value = true
  try {
    // Implement API call to save settings
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulated API call
    // Show success message
  } catch (error) {
    // Handle error
  } finally {
    saving.value = false
  }
}
</script>
