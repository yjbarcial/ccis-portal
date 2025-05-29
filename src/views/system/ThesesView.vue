<script setup>
import { ref, computed, onMounted } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import ThesesList from '@/components/system/ThesesList.vue'
import { useThesesStore } from '@/stores/theses'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { ADMIN_EMAILS } from '@/utils/constants'
import { supabase } from '@/utils/supabase'

const thesesStore = useThesesStore()
const authStore = useAuthStore()
const router = useRouter()

const search = ref('')
const selectedYear = ref(null)
const selectedDepartment = ref(null)
const loading = ref(false)
const error = ref(null)
const isAdmin = ref(false)

const yearOptions = ['2020', '2021', '2022', '2023', '2024']
const departmentOptions = ['Information System', 'Information Technology', 'Computer Science']

// Watch for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    isAdmin.value = ADMIN_EMAILS.includes(session.user?.email)
  } else if (event === 'SIGNED_OUT') {
    isAdmin.value = false
  }
})

onMounted(async () => {
  // Ensure user data is loaded
  if (!authStore.user) {
    await authStore.fetchUser()
  }

  // Check if user is admin
  isAdmin.value = authStore.user?.email && ADMIN_EMAILS.includes(authStore.user.email)
  console.log('User admin status:', { email: authStore.user?.email, isAdmin: isAdmin.value })

  loading.value = true
  error.value = null

  try {
    console.log('Fetching theses...')
    await thesesStore.getTheses()
    console.log('Theses fetched successfully')
  } catch (err) {
    console.error('Error fetching theses:', err)
    error.value = 'Failed to load theses. Please try again.'
  } finally {
    loading.value = false
  }
})

const fetchData = async () => {
  loading.value = true
  try {
    await thesesStore.getTheses()
  } catch (err) {
    console.error('Error fetching theses:', err)
    error.value = 'Failed to load theses. Please try again.'
  } finally {
    loading.value = false
  }
}

const filteredTheses = computed(() => {
  let filtered = thesesStore.theses

  if (search.value) {
    const searchLower = search.value.toLowerCase()
    filtered = filtered.filter((thesis) => thesis.title.toLowerCase().includes(searchLower))
  }

  if (selectedYear.value) {
    filtered = filtered.filter((thesis) => thesis.acad_year === selectedYear.value)
  }

  if (selectedDepartment.value) {
    filtered = filtered.filter((thesis) => thesis.department === selectedDepartment.value)
  }

  return filtered
})

const goTo = (route) => router.push({ name: route })
</script>

<template>
  <v-app>
    <app-header title="CCIS Portal" />
    <v-main>
      <v-container fluid class="py-6">
        <!-- Title and Upload Button -->
        <v-row class="mb-4" align="center">
          <v-col cols="auto">
            <h1 class="text-h5 font-weight-bold">Theses Repository</h1>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="auto" class="me-5">
            <v-btn
              v-if="isAdmin"
              variant="outlined"
              color="orange-darken-3"
              size="small"
              @click="goTo('upload-thesis')"
              class="text-capitalize me-3"
            >
              <v-icon start>mdi-plus</v-icon>
              Upload Thesis
            </v-btn>
            <v-btn
              variant="flat"
              density="comfortable"
              color="orange-darken-3"
              size="small"
              @click="fetchData"
              icon="mdi-refresh"
              :loading="loading"
            >
            </v-btn>
          </v-col>
        </v-row>

        <!-- Error Alert -->
        <v-alert v-if="error" type="error" class="mb-4">
          {{ error }}
        </v-alert>

        <!-- Loading State -->
        <v-progress-circular
          v-if="loading"
          indeterminate
          color="orange-darken-3"
          class="d-flex mx-auto my-4"
        ></v-progress-circular>

        <!-- Filters -->
        <v-row v-if="!loading" class="mb-4" dense>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="search"
              label="Search Theses..."
              prepend-inner-icon="mdi-magnify"
              clearable
            />
          </v-col>
          <v-col cols="6" md="4">
            <v-select v-model="selectedYear" :items="yearOptions" label="Academic Year" clearable />
          </v-col>
          <v-col cols="6" md="4">
            <v-select
              v-model="selectedDepartment"
              :items="departmentOptions"
              label="Department"
              clearable
            />
          </v-col>
        </v-row>

        <!-- Theses List -->
        <ThesesList v-if="!loading" :theses="filteredTheses" />
      </v-container>
    </v-main>
  </v-app>
</template>
