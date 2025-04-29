<script setup>
import { ref } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const saving = ref(false)
const changingPassword = ref(false)

const profile = ref({
  firstName: '',
  lastName: '',
  email: '',
  department: '',
  avatar: null,
})

const passwordForm = ref({
  current: '',
  new: '',
  confirm: '',
})

const saveProfile = async () => {
  saving.value = true
  try {
    // Implement API call to save profile
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulated API call
    // Show success message
  } catch (error) {
    // Handle error
  } finally {
    saving.value = false
  }
}

const changePassword = async () => {
  if (passwordForm.value.new !== passwordForm.value.confirm) {
    // Show error message
    return
  }

  changingPassword.value = true
  try {
    // Implement API call to change password
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulated API call
    // Show success message
    passwordForm.value = { current: '', new: '', confirm: '' }
  } catch (error) {
    // Handle error
  } finally {
    changingPassword.value = false
  }
}

const uploadAvatar = (event) => {
  const file = event.target.files[0]
  if (file) {
    profile.value.avatar = URL.createObjectURL(file) // preview the image
    // You can also handle the upload to a server here if needed
  }
}
</script>

<template>
  <v-app>
    <app-header title="CCIS Portal" />

    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12" md="8" lg="6">
            <h1 class="text-h4 mb-6">Profile</h1>

            <!-- Profile Information -->
            <v-card class="mb-6">
              <v-card-text>
                <v-row>
                  <v-col cols="12" class="text-center mb-4">
                    <v-avatar size="120" color="orange-darken-2">
                      <v-img v-if="profile.avatar" :src="profile.avatar"></v-img>
                      <v-icon v-else size="48">mdi-account</v-icon>
                    </v-avatar>

                    <div class="mt-2">
                      <!-- Hidden file input -->
                      <input
                        ref="fileInput"
                        type="file"
                        accept="image/*"
                        style="display: none"
                        @change="uploadAvatar"
                      />

                      <!-- Trigger button -->
                      <v-btn
                        variant="text"
                        color="orange-darken-4"
                        @click="$refs.fileInput.click()"
                      >
                        Change Avatar
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>

                <v-form @submit.prevent="saveProfile">
                  <v-text-field
                    v-model="profile.firstName"
                    label="First Name"
                    required
                    color="orange-darken-4"
                  ></v-text-field>

                  <v-text-field
                    v-model="profile.lastName"
                    label="Last Name"
                    required
                    color="orange-darken-4"
                  ></v-text-field>

                  <v-text-field
                    v-model="profile.email"
                    label="Email"
                    type="email"
                    required
                    color="orange-darken-4"
                  ></v-text-field>

                  <v-text-field
                    v-model="profile.department"
                    label="Department"
                    color="orange-darken-4"
                  ></v-text-field>

                  <v-btn type="submit" color="orange-darken-4" :loading="saving" class="mt-4">
                    Save Changes
                  </v-btn>
                </v-form>
              </v-card-text>
            </v-card>

            <!-- Change Password -->
            <v-card class="mb-4">
              <v-card-title>Change Password</v-card-title>
              <v-card-text>
                <v-form @submit.prevent="changePassword">
                  <v-text-field
                    v-model="passwordForm.current"
                    label="Current Password"
                    type="password"
                    required
                    color="orange-darken-4"
                  ></v-text-field>

                  <v-text-field
                    v-model="passwordForm.new"
                    label="New Password"
                    type="password"
                    required
                    color="orange-darken-4"
                  ></v-text-field>

                  <v-text-field
                    v-model="passwordForm.confirm"
                    label="Confirm New Password"
                    type="password"
                    required
                    color="orange-darken-4"
                  ></v-text-field>

                  <v-btn
                    type="submit"
                    color="orange-darken-4"
                    :loading="changingPassword"
                    class="mt-4"
                  >
                    Change Password
                  </v-btn>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-card>
              <v-card class="mb-6">
                <v-card-text>
                  <v-row>
                    <v-col cols="12" class="text-center mb-4">
                      <v-avatar size="120" color="orange-darken-2">
                        <v-img v-if="profile.avatar" :src="profile.avatar"></v-img>
                        <v-icon v-else size="48">mdi-account</v-icon>
                      </v-avatar>

                      <div class="mt-2">
                        <!-- Hidden file input -->
                        <input
                          ref="fileInput"
                          type="file"
                          accept="image/*"
                          style="display: none"
                          @change="uploadAvatar"
                        />

                        <!-- Trigger button -->
                        <v-btn
                          variant="text"
                          color="orange-darken-4"
                          @click="$refs.fileInput.click()"
                        >
                          Change Avatar
                        </v-btn>
                      </div>
                    </v-col>
                  </v-row>

                  <v-form @submit.prevent="saveProfile">
                    <v-text-field
                      v-model="profile.firstName"
                      label="First Name"
                      required
                      color="orange-darken-4"
                    ></v-text-field>

                    <v-text-field
                      v-model="profile.lastName"
                      label="Last Name"
                      required
                      color="orange-darken-4"
                    ></v-text-field>

                    <v-text-field
                      v-model="profile.email"
                      label="Email"
                      type="email"
                      required
                      color="orange-darken-4"
                    ></v-text-field>

                    <v-text-field
                      v-model="profile.department"
                      label="Department"
                      color="orange-darken-4"
                    ></v-text-field>

                    <v-btn type="submit" color="orange-darken-4" :loading="saving" class="mt-4">
                      Save Changes
                    </v-btn>
                  </v-form>
                </v-card-text>
              </v-card></v-card
            >
          </v-col>
        </v-row>

        <!-- Footer -->
        <div class="my-1 text-black">
          <AppFooter />
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>
