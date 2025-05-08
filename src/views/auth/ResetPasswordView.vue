<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase'

const password = ref('')
const confirmPassword = ref('')
const success = ref(false)
const loading = ref(false)
const error = ref('')
const router = useRouter()

const handleResetPassword = async () => {
  error.value = ''
  success.value = false

  if (!password.value || !confirmPassword.value) {
    error.value = 'Please fill in all fields.'
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match.'
    return
  }

  loading.value = true

  try {
    const { error: resetError } = await supabase.auth.updateUser({
      password: password.value,
    })

    if (resetError) {
      throw resetError
    }

    success.value = true
  } catch (err) {
    error.value = err.message || 'An error occurred. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <v-container
    fluid
    class="d-flex flex-column justify-between pa-0 login-main-container"
    style="min-height: 100vh; position: relative"
  >
    <v-img
      style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-image: url('/images/background5.png');
        background-size: cover;
        background-position: center;
        z-index: -1;
      "
    ></v-img>
    <v-row class="flex-grow-1 mt-5" align="center" justify="center">
      <v-col cols="12" sm="7" md="6" class="text-center d-flex justify-center">
        <v-card
          elevation="6"
          class="pa-4"
          style="background-color: #ffffff; border-radius: 16px; max-width: 450px; width: 100%"
        >
          <h2 class="mb-4">Set New Password</h2>
          <v-form @submit.prevent="handleResetPassword">
            <v-text-field
              v-model="password"
              label="New Password"
              type="password"
              required
              class="mb-4"
            />
            <v-text-field
              v-model="confirmPassword"
              label="Confirm Password"
              type="password"
              required
              class="mb-4"
            />
            <v-alert v-if="error" type="error" class="mb-2">{{ error }}</v-alert>
            <v-alert v-if="success" type="success" class="mb-2">
              Your password has been reset successfully. You can now log in.
            </v-alert>
            <v-btn
              color="deep-orange"
              type="submit"
              size="large"
              :loading="loading"
              :disabled="success"
              class="mb-2"
              block
            >
              Reset Password
            </v-btn>

            <v-btn variant="text" block @click="router.push({ name: 'login' })"
              >Back to Login</v-btn
            >
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.login-main-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0 !important;
}
</style>
