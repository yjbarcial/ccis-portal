<script setup>
import { onMounted, ref } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const saving = ref(false)
const changingPassword = ref(false)
const isEditing = ref(false)

const profile = ref({
  fullname: '',
  email: '',
  department: '',
  avatar: '',
})

const passwordForm = ref({
  current: '',
  new: '',
  confirm: '',
})

const loadProfile = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  if (user) {
    // Populate profile with data from localStorage
    profile.value.fullName = user.fullname || ''
    profile.value.email = user.email || ''
    profile.value.department = user.employeeID || ''

    profile.value.avatar = user.avatar || ''
  } else {
    profile.value.avatar = ''
  }
}

const saveProfile = () => {
  const userData = {
    fullname: profile.value.fullName,
    email: profile.value.email,
    employeeID: profile.value.department,
    avatar: profile.value.avatar, // Save avatar data
  }
  localStorage.setItem('user', JSON.stringify(userData))
  isEditing.value = false
}

const changePassword = async () => {
  if (passwordForm.value.new !== passwordForm.value.confirm) {
    // Show error message
    return
  }

  changingPassword.value = true
  try {
    // Implement API call to change password
    await new Promise((resolve) => setTimeout(resolve, 1000))
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
    const avatarURL = URL.createObjectURL(file)
    profile.value.avatar = avatarURL

    const user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      user.avatar = avatarURL
      localStorage.setItem('user', JSON.stringify(user))
    }
  }
}

const logout = () => {
  localStorage.removeItem('user')
  profile.value.avatar = ''
}

const login = async () => {
  const user = { fullname: 'Jane Doe', email: 'jane@example.com', employeeID: '54321', avatar: '' }
  localStorage.setItem('user', JSON.stringify(user))

  loadProfile()
}

onMounted(() => {
  const user = localStorage.getItem('user')
  if (user) {
    const userData = JSON.parse(user)
    profile.value.fullName = userData.fullname || ''
  }
})

onMounted(() => {
  loadProfile()
})
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
                    <!-- Clickable Avatar -->
                    <div
                      style="
                        cursor: pointer;
                        display: inline-block;
                        border-radius: 50%;
                        overflow: hidden;
                        width: 120px;
                        height: 120px;
                      "
                      @click="$refs.fileInput.click()"
                    >
                      <v-img
                        v-if="profile.avatar"
                        :src="profile.avatar"
                        cover
                        width="120"
                        height="120"
                      />
                      <v-avatar v-else size="120" color="orange-darken-2">
                        <v-icon size="48">mdi-account</v-icon>
                      </v-avatar>
                    </div>

                    <!-- Hidden File Input -->
                    <input
                      ref="fileInput"
                      type="file"
                      accept="image/*"
                      style="display: none"
                      @change="uploadAvatar"
                    />

                    <!-- Full Name -->
                    <v-row>
                      <v-col cols="12">
                        <div v-if="!isEditing" class="font-weight-bold">
                          {{ profile.fullName }}
                        </div>
                        <v-text-field
                          v-else
                          v-model="profile.fullName"
                          label="Full Name"
                          hide-details
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <!-- Email -->
                    <v-row>
                      <v-col cols="12">
                        <div v-if="!isEditing">{{ profile.email }}</div>
                        <v-text-field
                          v-else
                          v-model="profile.email"
                          label="Email"
                          hide-details
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <!-- Department -->
                    <v-row>
                      <v-col cols="12">
                        <div v-if="!isEditing">{{ profile.department }}</div>
                        <v-text-field
                          v-else
                          v-model="profile.department"
                          label="Department"
                          hide-details
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <!-- Edit & Save Buttons -->
                    <div class="text-center mt-4">
                      <v-btn v-if="!isEditing" color="orange-darken-2" @click="isEditing = true">
                        Edit Profile
                      </v-btn>

                      <v-btn v-else color="orange-darken-2" @click="saveProfile">
                        Save Changes
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>
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

        <!-- Footer -->
        <div class="my-1 text-black">
          <AppFooter />
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>
