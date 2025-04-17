<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Dummy profile data for the instructor
const profile = ref({
  name: 'John Doe',
  email: 'john.doe@example.com',
  department: 'Computer Science',
  position: 'Associate Professor',
})

const goTo = (route) => router.push({ name: route })
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <h1 class="text-h5 font-weight-bold mb-4">Instructor Profile</h1>
        <v-card>
          <v-card-title class="font-weight-bold">Personal Information</v-card-title>
          <v-divider />
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="profile.name" label="Full Name" disabled />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="profile.email" label="Email" disabled />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="profile.department" label="Department" disabled />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="profile.position" label="Position" disabled />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-btn color="orange-darken-3" class="mt-4" @click="goTo('settings')" dark
          >Update Profile</v-btn
        >
      </v-col>
    </v-row>
  </v-container>
</template>
