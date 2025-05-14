<script setup>
import {
  requiredValidator,
  emailValidator,
  passwordValidator,
  confirmedValidator,
} from '@/utils/validators'
import { ref } from 'vue'
import { supabase, formActionDefault } from '@/utils/supabase.js'
import AlertNotification from '@/components/common/AlertNotification.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const formDataDefault = {
  fullname: '',
  email: '',
  department: '',
  password: '',
  password_confirmation: '',
}

const formData = ref({
  ...formDataDefault,
})

const formAction = ref({
  ...formActionDefault,
})

const isPasswordvisible = ref(false)
const isConfirmPasswordvisible = ref(false)
const refVForm = ref()

const onSubmit = async () => {
  formAction.value = { ...formActionDefault }
  formAction.value.formProcess = true

  const { data, error } = await supabase.auth.signUp({
    email: formData.value.email,
    password: formData.value.password,
    options: {
      data: {
        full_name: formData.value.fullname,
        department: formData.value.department,
      },
    },
  })

  if (error) {
    console.log(error)
    formAction.value.formErrorMessage = error.message
    formAction.value.formStatus = error.status
  } else if (data) {
    console.log(data)
    formAction.value.formSuccessMessage = 'You have registered an account!'

    // Save user data to localStorage (optional)
    localStorage.setItem(
      'user',
      JSON.stringify({
        fullname: formData.value.fullname,
        email: formData.value.email,
        department: formData.value.department,
      }),
    )

    // Reset form and navigate to dashboard
    refVForm.value?.reset()
    router.replace('/dashboard') // Redirect to the dashboard page
  }

  formAction.value.formProcess = false
}

const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid }) => {
    if (valid) onSubmit()
  })
}
</script>

<template>
  <!-- Alerts -->
  <AlertNotification
    :form-success-message="formAction.formSuccessMessage"
    :form-error-message="formAction.formErrorMessage"
  ></AlertNotification>

  <v-form @submit.prevent="onFormSubmit" ref="refVForm" class="register-form">
    <!-- Form Header -->
    <div class="text-center mb-5">
      <v-icon size="28" color="deep-orange">mdi-account-plus</v-icon>
      <h2 class="font-weight-bold mt-2">Create an Account</h2>
    </div>

    <!-- Full Name & Email -->
    <v-row>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="formData.fullname"
          label="Full Name"
          variant="solo-filled"
          prepend-inner-icon="mdi-account"
          :rules="[requiredValidator]"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="formData.email"
          label="Email Address"
          variant="solo-filled"
          prepend-inner-icon="mdi-email"
          :rules="[requiredValidator, emailValidator]"
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- Department -->
    <v-text-field
      v-model="formData.department"
      label="Department"
      variant="solo-filled"
      prepend-inner-icon="mdi-office-building"
      :rules="[requiredValidator]"
      class="mb-3"
    ></v-text-field>

    <v-row>
      <v-col cols="12" sm="6">
        <!-- Password -->
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
      </v-col>
      <v-col cols="12" sm="6">
        <!-- Confirm Password -->
        <v-text-field
          v-model="formData.password_confirmation"
          label="Confirm Password"
          variant="solo-filled"
          prepend-inner-icon="mdi-lock-check"
          class="mb-3"
          :append-inner-icon="isConfirmPasswordvisible ? 'mdi-eye' : 'mdi-eye-off'"
          :type="isConfirmPasswordvisible ? 'text' : 'password'"
          @click:append-inner="isConfirmPasswordvisible = !isConfirmPasswordvisible"
          :rules="[requiredValidator, confirmedValidator(password_confirmation)]"
        />
      </v-col>
    </v-row>

    <!-- Register Button -->
    <v-btn
      type="submit"
      block
      color="deep-orange"
      size="large"
      elevation="3"
      class="mt-3"
      :disabled="formAction.formProcess"
      :loading="formAction.formProcess"
    >
      Register
    </v-btn>

    <!-- Divider -->
    <v-divider class="my-5"></v-divider>

    <!-- Login Link -->
    <p class="text-center text-caption">
      Already have an account?
      <RouterLink class="text-deep-orange font-weight-bold" to="/"> Log in </RouterLink>
    </p>
  </v-form>
</template>

<style scoped>
.register-form {
  max-width: 450px;
  width: 100%;
  padding: clamp(20px, 4vw, 30px) clamp(15px, 3vw, 20px);
  border-radius: 12px;
  background: white;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
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
.register-form h2 {
  font-size: 1.1rem;
}
.register-form p,
.register-form .v-divider,
.register-form .text-center {
  font-size: 0.85rem;
}
@media (max-width: 600px) {
  .register-form {
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
  .register-form h2 {
    font-size: 1rem;
  }
  .register-form p,
  .register-form .v-divider,
  .register-form .text-center {
    font-size: 0.8rem;
  }
}
</style>
