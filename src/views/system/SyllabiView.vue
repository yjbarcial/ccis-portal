<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import SyllabiList from '@/components/system/SyllabiList.vue'
import { useSyllabiStore } from '@/stores/syllabi'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const syllabiStore = useSyllabiStore()
const router = useRouter()

const search = ref('')
const selectedYear = ref(null)
const selectedSemester = ref(null)
const loading = ref(false)
const error = ref(null)
const isAdmin = ref(false)
const sortBy = ref('latest')

const yearOptions = ['2020', '2021', '2022', '2023', '2024']
const semesterOptions = ['1st Semester', '2nd Semester', 'Summer']
const sortOptions = [
  { title: 'Latest Year First', value: 'latest' },
  { title: 'Oldest Year First', value: 'oldest' },
  { title: 'Title (A-Z)', value: 'title-asc' },
  { title: 'Title (Z-A)', value: 'title-desc' },
]

onMounted(async () => {
  loading.value = true
  error.value = null

  try {
    console.log('Fetching syllabi...')
    await syllabiStore.getSyllabi()
    console.log('Syllabi fetched successfully')
  } catch (err) {
    console.error('Error fetching syllabi:', err)
    error.value = 'Failed to load syllabi. Please try again.'
  } finally {
    loading.value = false
  }
})

const goTo = (route) => router.push({ name: route })

const filteredSyllabi = computed(() => {
  let filtered = syllabiStore.syllabi

  if (search.value) {
    const searchLower = search.value.toLowerCase()
    filtered = filtered.filter(
      (syllabus) =>
        syllabus.descriptive_title.toLowerCase().includes(searchLower) ||
        syllabus.course_code.toLowerCase().includes(searchLower),
    )
  }

  if (selectedYear.value) {
    filtered = filtered.filter((syllabus) => syllabus.acad_year === selectedYear.value)
  }

  if (selectedSemester.value) {
    filtered = filtered.filter((syllabus) => syllabus.semester === selectedSemester.value)
  }

  // Apply sorting
  filtered = [...filtered].sort((a, b) => {
    switch (sortBy.value) {
      case 'latest':
        return b.acad_year.localeCompare(a.acad_year)
      case 'oldest':
        return a.acad_year.localeCompare(b.acad_year)
      case 'title-asc':
        return a.descriptive_title.localeCompare(b.descriptive_title)
      case 'title-desc':
        return b.descriptive_title.localeCompare(a.descriptive_title)
      default:
        return 0
    }
  })

  return filtered
})

const onRetrieveFromApi = async () => {
  loading.value = true
  error.value = null

  try {
    await syllabiStore.getSyllabi()
  } catch (err) {
    console.error('Error refreshing syllabi:', err)
    error.value = 'Failed to refresh syllabi. Please try again.'
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
        <!-- Title and Upload Button -->
        <v-row class="mb-4" align="center">
          <v-col cols="auto">
            <h1 class="text-h5 font-weight-bold">Syllabi Repository</h1>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="auto" class="me-5">
            <v-btn
              variant="outlined"
              color="orange-darken-3"
              size="small"
              @click="goTo('upload-syllabus')"
              class="text-capitalize me-3"
            >
              <v-icon start>mdi-plus</v-icon>
              Upload Syllabus
            </v-btn>
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
          <v-col cols="12" md="3">
            <v-text-field
              v-model="search"
              label="Search Syllabi..."
              prepend-inner-icon="mdi-magnify"
              clearable
            />
          </v-col>
          <v-col cols="6" md="3">
            <v-select v-model="selectedYear" :items="yearOptions" label="Academic Year" clearable />
          </v-col>
          <v-col cols="6" md="3">
            <v-select
              v-model="selectedSemester"
              :items="semesterOptions"
              label="Semester"
              clearable
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="sortBy"
              :items="sortOptions"
              label="Sort By"
              prepend-inner-icon="mdi-sort"
            />
          </v-col>
        </v-row>

        <!-- Syllabi List -->
        <SyllabiList v-if="!loading" :syllabi="filteredSyllabi" />
      </v-container>
    </v-main>
  </v-app>
</template>
