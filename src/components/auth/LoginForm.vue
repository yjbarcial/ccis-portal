<script setup>
import { ref } from 'vue'
import { requiredValidator, passwordValidator } from '@/utils/validators'

const isPasswordvisible = ref(false)
const refVForm = ref()

const formDataDefault = {
  email: '',
  password: '',
}

const formData = ref({
  ...formDataDefault,
})

const onLogin = () => {
  // alert(formData.value.employeeID)
}

const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid }) => {
    if (valid) onLogin()
  })
}
</script>

<template>
  <v-form ref="refVForm" @submit.prevent="onFormSubmit" class="login-form">
    <!-- Form Header -->
    <div class="text-center mb-5">
      <v-icon size="36" color="deep-orange">mdi-login</v-icon>
      <h2 class="font-weight-bold mt-2">Log in to Your Account</h2>
    </div>

    <!-- Employee ID Input -->
    <v-text-field
      v-model="formData.employeeID"
      label="Employee ID"
      variant="solo-filled"
      prepend-inner-icon="mdi-account-tie"
      class="mb-3"
      :rules="[requiredValidator]"
    ></v-text-field>

    <!-- Password Input -->
    <v-text-field
      v-model="formData.password"
      label="Password"
      variant="solo-filled"
      prepend-inner-icon="mdi-lock"
      class="mb-3"
      :append-inner-icon="isPasswordvisible ? 'mdi-eye' : 'mdi-eye-off'"
      :type="isPasswordvisible ? 'text' : 'password'"
      @click:append-inner="isPasswordvisible = !isPasswordvisible"
      :rules="[requiredValidator, passwordValidator]"
    ></v-text-field>

    <!-- Actions -->
    <div class="d-flex justify-space-between align-center mb-4">
      <v-checkbox label="Remember me"></v-checkbox>
      <RouterLink to="/forgot-password" class="text-deep-orange font-weight-medium">
        Forgot Password?
      </RouterLink>
    </div>

    <!-- Login Button -->
    <v-btn type="submit" block color="deep-orange" size="large" elevation="3"> Log In </v-btn>

    <!-- Divider -->
    <v-divider class="my-5"></v-divider>

    <!-- Sign Up Link -->
    <p class="text-center">
      Don't have an account?
      <RouterLink class="text-deep-orange font-weight-bold" to="/register"> Create one </RouterLink>
    </p>
  </v-form>
</template>

<style scoped>
.login-form {
  max-width: 520px; /* Same width as Register Form */
  width: 100%;
  padding: 30px;
  border-radius: 12px;
  background: white;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
}
</style>
