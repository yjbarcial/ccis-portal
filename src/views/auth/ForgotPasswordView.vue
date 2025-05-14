<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import { supabase } from '@/utils/supabase'
import { requiredValidator, emailValidator } from '@/utils/validators'

const email = ref('')
const success = ref(false)
const loading = ref(false)
const error = ref('')
const router = useRouter()
const { mobile, sm } = useDisplay()

const handleSubmit = async () => {
  error.value = ''
  success.value = false

  if (!email.value) {
    error.value = 'Please enter your email.'
    return
  }

  loading.value = true

  try {
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.value, {
      redirectTo: `${window.location.origin}/reset-password`, // Adjust this URL to your reset password page
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
      <v-col cols="12" sm="5" md="4" class="text-center" :class="{ 'mb-8': mobile }">
        <v-img
          src="/images/ccisPortal.svg"
          width="86%"
          :width="mobile ? '65%' : sm ? '150px' : '200px'"
          class="mx-auto mb-4"
          style="will-change: transform"
        />
      </v-col>
      <v-col cols="12" sm="7" md="6" class="text-center d-flex justify-center">
        <v-card
          elevation="6"
          :class="mobile ? 'mx-2' : sm ? 'mx-6' : 'mx-12'"
          class="pa-4"
          style="background-color: #ffffff; border-radius: 16px; max-width: 450px; width: 100%"
        >
          <h2 class="mb-4">Reset Password</h2>
          <v-form @submit.prevent="handleSubmit">
            <!-- Email Input -->
            <v-text-field
              v-model="email"
              label="Email Address"
              variant="solo-filled"
              prepend-inner-icon="mdi-email"
              density="compact"
              class="mb-4"
              :rules="[requiredValidator, emailValidator]"
              :disabled="success"
            ></v-text-field>

            <v-alert v-if="error" type="error" class="mb-2">{{ error }}</v-alert>
            <v-alert v-if="success" type="success" class="mb-2">
              If your email is registered, you will receive a password reset link.
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
