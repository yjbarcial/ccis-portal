<script setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/utils/supabase'
import { requiredValidator } from '@/utils/validators'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const authStore = useAuthStore()
const saving = ref(false)
const changingPassword = ref(false)
const isEditing = ref(false)
const showChangePassword = ref(false)
const loading = ref(false)

const profile = ref({
  fullName: '',
  email: '',
  department: '',
  avatar: '',
})

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const passwordValidator = (value) => {
  if (!value) return 'Password is required'
  if (value.length < 8) return 'Password must be at least 8 characters'
  if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter'
  if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter'
  if (!/[0-9]/.test(value)) return 'Password must contain at least one number'
  return true
}

const passwordMatchValidator = (value) => {
  if (value !== newPassword.value) return 'Passwords do not match'
  return true
}

const loadProfile = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      profile.value.fullName = user.user_metadata?.full_name || ''
      profile.value.email = user.email || ''
      profile.value.department = user.user_metadata?.department || ''
      profile.value.avatar = user.user_metadata?.avatar || ''
    }
  } catch (error) {
    console.error('Error loading profile:', error)
  }
}

const saveProfile = async () => {
  saving.value = true
  try {
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: profile.value.fullName,
        department: profile.value.department,
        avatar: profile.value.avatar,
      },
    })
    if (error) throw error
    isEditing.value = false
  } catch (error) {
    console.error('Error saving profile:', error)
  } finally {
    saving.value = false
  }
}

const changePassword = async () => {
  changingPassword.value = true
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword.value,
    })
    if (error) throw error

    // Clear the form
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    showChangePassword.value = false
  } catch (error) {
    console.error('Error changing password:', error)
  } finally {
    changingPassword.value = false
  }
}

const uploadAvatar = async (event) => {
  const file = event.target.files[0]
  if (file) {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${authStore.user.id}/${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file)

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(fileName)

      profile.value.avatar = publicUrl
      await saveProfile()
    } catch (error) {
      console.error('Error uploading avatar:', error)
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
      <v-container fluid class="py-6">
        <v-row>
          <v-col>
            <h1 class="text-h4 font-weight-bold mb-1">Profile</h1>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="4">
            <v-card class="profile-card mb-4">
              <v-card-text class="text-center">
                <v-avatar
                  :image="profile.avatar"
                  size="120"
                  class="mb-4"
                  @click="triggerFileInput"
                  style="cursor: pointer"
                >
                  <v-icon v-if="!profile.avatar" size="64">mdi-account</v-icon>
                </v-avatar>
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  style="display: none"
                  @change="uploadAvatar"
                />
                <div class="text-h6 font-weight-bold">{{ profile.fullName }}</div>
                <div class="text-subtitle-1 text-medium-emphasis">{{ profile.department }}</div>
              </v-card-text>
            </v-card>

            <v-card class="mb-4">
              <v-card-title class="text-h6">Account Settings</v-card-title>
              <v-divider />
              <v-list density="compact">
                <v-list-item
                  prepend-icon="mdi-account-edit"
                  title="Edit Profile"
                  @click="isEditing = true"
                />
                <v-list-item
                  prepend-icon="mdi-lock"
                  title="Change Password"
                  @click="showChangePassword = true"
                />
              </v-list>
            </v-card>
          </v-col>

          <v-col cols="12" md="8">
            <v-card>
              <v-card-title class="text-h6">Profile Information</v-card-title>
              <v-divider />
              <v-card-text>
                <v-form ref="form" @submit.prevent="saveProfile">
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="profile.fullName"
                        label="Full Name"
                        :readonly="!isEditing"
                        variant="outlined"
                        density="comfortable"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="profile.email"
                        label="Email"
                        readonly
                        variant="outlined"
                        density="comfortable"
                      />
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="profile.department"
                        label="Department"
                        :readonly="!isEditing"
                        variant="outlined"
                        density="comfortable"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="profile.position"
                        label="Position"
                        :readonly="!isEditing"
                        variant="outlined"
                        density="comfortable"
                      />
                    </v-col>
                  </v-row>

                  <v-row v-if="isEditing">
                    <v-col cols="12" class="text-right">
                      <v-btn
                        color="orange-darken-3"
                        variant="text"
                        @click="isEditing = false"
                        class="me-2"
                      >
                        Cancel
                      </v-btn>
                      <v-btn color="orange-darken-3" type="submit" :loading="loading">
                        Save Changes
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Change Password Dialog -->
        <v-dialog v-model="showChangePassword" max-width="500">
          <v-card>
            <v-card-title class="text-h6">Change Password</v-card-title>
            <v-divider />
            <v-card-text>
              <v-form ref="passwordForm" @submit.prevent="changePassword">
                <v-text-field
                  v-model="currentPassword"
                  label="Current Password"
                  type="password"
                  variant="outlined"
                  density="comfortable"
                  :rules="[requiredValidator]"
                />
                <v-text-field
                  v-model="newPassword"
                  label="New Password"
                  type="password"
                  variant="outlined"
                  density="comfortable"
                  :rules="[requiredValidator, passwordValidator]"
                />
                <v-text-field
                  v-model="confirmPassword"
                  label="Confirm New Password"
                  type="password"
                  variant="outlined"
                  density="comfortable"
                  :rules="[requiredValidator, passwordMatchValidator]"
                />
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="orange-darken-3" variant="text" @click="showChangePassword = false">
                Cancel
              </v-btn>
              <v-btn color="orange-darken-3" @click="changePassword" :loading="loading">
                Change Password
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.profile-card {
  border-radius: 12px;
  overflow: hidden;
}

.v-avatar {
  border: 3px solid rgb(var(--v-theme-orange-darken-3));
  transition: transform 0.3s ease;
}

.v-avatar:hover {
  transform: scale(1.05);
}
</style>
