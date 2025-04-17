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

const formDataDefault = {
  firstname: '',
  lastname: '',
  email: '',
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
  // alert(formData.value.employeeID)
  const { data, error } = await supabase.auth.signUp({
    email: formData.value.email,
    password: formData.value.password,
    options: {
      data: {
        firstname: formData.value.firstname,
        lastname: formData.value.lastname,
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
    // Add here more actions if you want
    refVForm.value?.reset()
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
      <v-icon size="36" color="deep-orange">mdi-account-plus</v-icon>
      <h2 class="font-weight-bold mt-2">Create an Account</h2>
    </div>

    <!-- First & Last Name -->
    <v-row>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="formData.firstname"
          label="First Name"
          variant="solo-filled"
          prepend-inner-icon="mdi-account"
          class="mb-3"
          :rules="[requiredValidator]"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="formData.lastname"
          label="Last Name"
          variant="solo-filled"
          prepend-inner-icon="mdi-account"
          class="mb-3"
          :rules="[requiredValidator]"
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- Email -->
    <v-text-field
      v-model="formData.email"
      label="Email Address"
      variant="solo-filled"
      prepend-inner-icon="mdi-email"
      class="mb-3"
      :rules="[requiredValidator, emailValidator]"
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
      :disabled="formAction.formProcess"
      :loading="formAction.formProcess"
    >
      Register
    </v-btn>

    <!-- Divider -->
    <v-divider class="my-5"></v-divider>

    <!-- Login Link -->
    <p class="text-center">
      Already have an account?
      <RouterLink class="text-deep-orange font-weight-bold" to="/"> Log in </RouterLink>
    </p>
  </v-form>
</template>

<style scoped>
.register-form {
  max-width: 520px; /* Increased max-width */
  width: 100%;
  padding: 30px;
  border-radius: 12px;
  background: white;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
}
</style>
