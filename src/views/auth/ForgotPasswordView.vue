<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'

const email = ref('')
const success = ref(false)
const loading = ref(false)
const error = ref('')
const router = useRouter()
const { mobile, sm } = useDisplay()

const handleSubmit = async () => {
  error.value = ''
  if (!email.value) {
    error.value = 'Please enter your email.'
    return
  }
  loading.value = true
  // Simulate API call
  setTimeout(() => {
    loading.value = false
    success.value = true
  }, 1200)
}
</script>

<template>
  <v-container
    fluid
    class="d-flex flex-column justify-between pa-0 login-main-container"
    style="min-height: 100vh; position: relative"
  >
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
          <h2 class="mb-4">Forgot Password</h2>
          <v-form @submit.prevent="handleSubmit">
            <v-text-field
              v-model="email"
              label="Email"
              type="email"
              :disabled="success"
              required
              class="mb-4"
            />
            <v-alert v-if="error" type="error" class="mb-2">{{ error }}</v-alert>
            <v-alert v-if="success" type="success" class="mb-2">
              If your email is registered, you will receive a password reset link.
            </v-alert>
            <v-btn
              color="deep-orange"
              type="submit"
              :loading="loading"
              :disabled="success"
              class="mb-2"
              block
            >
              Send Reset Link
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
