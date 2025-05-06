<script setup>
import AlertNotification from '@/components/common/AlertNotification.vue'
import { supabase } from '@/utils/supabase'
import { ref } from 'vue'
import { requiredValidator, passwordValidator, emailValidator } from '@/utils/validators'
import { isAuthenticated } from '@/utils/supabase'
import { useRouter } from 'vue-router'

const router = useRouter()

const formActionDefault = {
  formSuccessMessage: '',
  formErrorMessage: '',
  formStatus: null,
  formProcess: false,
}

const formDataDefault = {
  email: '',
  password: '',
}
//Load Variables
const formData = ref({
  ...formDataDefault,
})

const formAction = ref({
  ...formActionDefault,
})

const isPasswordvisible = ref(false)
const refVForm = ref()

const isLoggedIn = ref(false)

const onLogin = async () => {
  formAction.value = { ...formActionDefault }
  formAction.value.formProcess = true

  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.value.email,
    password: formData.value.password,
  })
  if (error) {
    console.log(error)
    formAction.value.formErrorMessage = error.message
    formAction.value.formStatus = error.status
  } else if (data) {
    console.log(data)
    formAction.value.formSuccessMessage = 'You have logged an account!'
    // Add here more actions if you want
    router.replace('/dashboard')
  }
  refVForm.value?.reset()
  formAction.value.formProcess = false
}

const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid }) => {
    if (valid) onLogin()
  })
}

// Get Authentication status from Supabase
const getLoggedStatus = async () => {
  isLoggedIn.value = await isAuthenticated()
}
</script>

<template>
  <AlertNotification
    :form-success-message="formAction.formSuccessMessage"
    :form-error-message="formAction.formErrorMessage"
  ></AlertNotification>

  <v-form ref="refVForm" @submit.prevent="onFormSubmit" class="login-form">
    <!-- Form Header -->
    <div class="text-center mb-5">
      <v-icon size="28" color="deep-orange">mdi-login</v-icon>
      <h2 class="text-subtitle-1 font-weight-bold mt-2">Log in to Your Account</h2>
    </div>

    <!-- Email Input -->
    <v-text-field
      v-model="formData.email"
      label="Email Address"
      variant="solo-filled"
      prepend-inner-icon="mdi-email"
      density="compact"
      :rules="[requiredValidator, emailValidator]"
    ></v-text-field>

    <!-- Password Input -->
    <v-text-field
      v-model="formData.password"
      label="Password"
      variant="solo-filled"
      prepend-inner-icon="mdi-lock"
      density="compact"
      :append-inner-icon="isPasswordvisible ? 'mdi-eye' : 'mdi-eye-off'"
      :type="isPasswordvisible ? 'text' : 'password'"
      @click:append-inner="isPasswordvisible = !isPasswordvisible"
      :rules="[requiredValidator, passwordValidator]"
    ></v-text-field>

    <!-- Actions -->
    <div class="d-flex justify-space-between align-center">
      <v-checkbox label="Remember me" density="compact"></v-checkbox>
      <RouterLink to="/forgot-password" class="text-deep-orange text-caption font-weight-medium">
        Forgot Password?
      </RouterLink>
    </div>

    <!-- Login Button -->
    <v-btn
      type="submit"
      block
      color="deep-orange"
      size="small"
      elevation="3"
      :loading="loading"
      @click="login"
    >
      Log In
    </v-btn>

    <!-- Divider -->
    <v-divider class="my-5"></v-divider>

    <!-- Sign Up Link -->
    <p class="text-center text-caption">
      Don't have an account?
      <RouterLink class="text-deep-orange font-weight-bold" to="/register"> Create one </RouterLink>
    </p>
  </v-form>
</template>

<style scoped>
.login-form {
  max-width: 520px;
  width: 100%;
  padding: clamp(20px, 4vw, 30px) clamp(15px, 3vw, 20px);
  border-radius: 12px;
  background: white;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
}

:deep(.v-field__input) {
  font-size: 0.75rem;
}

:deep(.v-label) {
  font-size: 0.75rem;
}

:deep(.v-btn) {
  font-size: 0.75rem;
}

:deep(.v-field__prepend-inner) {
  padding-top: 0;
  align-items: center;
  justify-content: center;
}

:deep(.v-field__append-inner) {
  padding-top: 0;
  align-items: center;
  justify-content: center;
}

:deep(.v-icon) {
  font-size: 18px;
}

@media (max-width: 600px) {
  .login-form {
    padding: 20px 15px;
  }

  :deep(.v-field__input),
  :deep(.v-label),
  :deep(.v-btn),
  :deep(.text-caption) {
    font-size: 0.75rem;
  }

  :deep(.v-icon) {
    font-size: 16px;
  }
}
</style>
