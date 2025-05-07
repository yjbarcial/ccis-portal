<script setup>
import { ref, computed, onMounted } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import ThesesList from '@/components/system/ThesesList.vue'
import { useThesesStore } from '@/stores/theses'

const thesesStore = useThesesStore()

const search = ref('')
const selectedYear = ref(null)
const selectedSemester = ref(null)
const loading = ref(false)
const error = ref(null)

const yearOptions = ['2024-2025', '2023-2024']
const semesterOptions = ['1st Semester', '2nd Semester']

onMounted(async () => {
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

const filteredTheses = computed(() => {
  console.log('Filtering theses:', thesesStore.theses)
  return thesesStore.theses.filter((t) => {
    return (
      (!search.value || t.abstract.toLowerCase().includes(search.value.toLowerCase())) &&
      (!selectedYear.value || t.acad_year === selectedYear.value) &&
      (!selectedSemester.value || t.semester === selectedSemester.value)
    )
  })
})

const onRetrieveFromApi = async () => {
  loading.value = true
  error.value = null

  try {
    await thesesStore.getTheses()
  } catch (err) {
    console.error('Error refreshing theses:', err)
    error.value = 'Failed to refresh theses. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <v-app>
    <app-header title="CCIS Portal" />
    <v-main>
      <v-container fluid class="py-6">
        <!-- Title and Refresh Button -->
        <v-row class="mb-4" align="center">
          <v-col cols="auto">
            <h1 class="text-h5 font-weight-bold">Theses Repository</h1>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="auto">
            <v-btn
              variant="flat"
              density="comfortable"
              color="orange-darken-3"
              size="small"
              @click="onRetrieveFromApi"
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
              v-model="selectedSemester"
              :items="semesterOptions"
              label="Semester"
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
