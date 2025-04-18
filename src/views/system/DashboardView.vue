<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'

const router = useRouter()
const goTo = (route) => router.push({ name: route })

const handleLogout = () => {
  // Implement logout logic here
  console.log('Logging out...')
  // After logout, redirect to login page
  // router.push({ name: 'login' })
}

const search = ref('')
const selectedYear = ref(null)
const selectedSemester = ref(null)
const yearOptions = ['2024-2025', '2023-2024']
const semesterOptions = ['1st Semester', '2nd Semester']

const totalSyllabi = ref(12)
const totalTheses = ref(9)

const recentSyllabi = ref([
  {
    descriptive_title: 'Object-Oriented Programming',
    course_code: 'CS203',
    acad_year: '2024-2025',
    file_url: '/syllabus/oop.pdf',
  },
  {
    descriptive_title: 'Data Structures',
    course_code: 'CS202',
    acad_year: '2024-2025',
    file_url: '/syllabus/ds.pdf',
  },
])

const recentTheses = ref([
  {
    title: 'Smart Irrigation Using IoT',
    acad_year: '2024-2025',
    semester: '1st Semester',
    file_url_abstract: '/thesis/irrigation-abstract.jpg',
  },
  {
    title: 'AI Facial Recognition Attendance System',
    acad_year: '2024-2025',
    semester: '2nd Semester',
    file_url_abstract: '/thesis/facial-abstract.jpg',
  },
])

const filteredSyllabi = computed(() => {
  return recentSyllabi.value.filter((s) => {
    return (
      (!search.value || s.descriptive_title.toLowerCase().includes(search.value.toLowerCase())) &&
      (!selectedYear.value || s.acad_year === selectedYear.value)
    )
  })
})

const filteredTheses = computed(() => {
  return recentTheses.value.filter((t) => {
    return (
      (!search.value || t.title.toLowerCase().includes(search.value.toLowerCase())) &&
      (!selectedYear.value || t.acad_year === selectedYear.value) &&
      (!selectedSemester.value || t.semester === selectedSemester.value)
    )
  })
})
</script>

<template>
  <v-app class="d-flex flex-column" style="min-height: 100vh">
    <!-- Top App Bar -->
    <app-header title="CCIS Portal" />

    <v-main class="flex-grow-1">
      <v-container fluid>
        <v-row>
          <v-col>
            <h1 class="text-h4 font-weight-bold mb-1">Welcome, Instructor!</h1>
          </v-col>
        </v-row>
        <hr class="dashed-hr" />
        <!-- Statistics -->
        <v-row class="mb-6 mt-2" dense justify="center">
          <v-col cols="12" md="6" lg="3">
            <v-card class="styled-stat-card mb-4">
              <v-img src="/images/syllabus.jpg" height="80" cover class="card-img"></v-img>
              <v-card-text class="text-center">
                <v-icon size="30" class="mb-2">mdi-file-document</v-icon>
                <div class="text-h6">Total Syllabi</div>
                <div class="text-h4 font-weight-bold">{{ totalSyllabi }}</div>
              </v-card-text>
              <div class="yellow-underline"></div>
            </v-card>
          </v-col>

          <v-col cols="12" md="6" lg="3">
            <v-card class="styled-stat-card mb-4">
              <v-img src="/images/thesis.jpg" height="80" cover class="card-img"></v-img>
              <v-card-text class="text-center">
                <v-icon size="30" class="mb-2">mdi-book-education</v-icon>
                <div class="text-h6">Total Theses</div>
                <div class="text-h4 font-weight-bold">{{ totalTheses }}</div>
              </v-card-text>
              <div class="yellow-underline"></div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Filters -->
        <v-row class="mb-4 mt-4">
          <v-col cols="12" md="4">
            <v-text-field
              v-model="search"
              label="Search..."
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

        <!-- Latest Uploads -->
        <v-row dense justify="center">
          <v-col cols="12" md="5">
            <v-card class="mb-6">
              <v-card-title class="font-weight-bold">Latest Syllabi</v-card-title>
              <v-divider />
              <v-list density="compact">
                <v-list-item
                  v-for="(item, index) in filteredSyllabi"
                  :key="index"
                  :title="item.descriptive_title"
                  :subtitle="`${item.course_code} • ${item.acad_year}`"
                >
                  <template #append>
                    <v-btn icon :href="item.file_url" target="_blank" variant="text">
                      <v-icon>mdi-open-in-new</v-icon>
                    </v-btn>
                  </template>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>

          <v-col cols="12" md="5">
            <v-card class="mb-6">
              <v-card-title class="font-weight-bold">Latest Theses</v-card-title>
              <v-divider />
              <v-list density="compact">
                <v-list-item
                  v-for="(item, index) in filteredTheses"
                  :key="index"
                  :title="item.title"
                  :subtitle="`${item.acad_year} • ${item.semester}`"
                >
                  <template #append>
                    <v-btn icon :href="item.file_url_abstract" target="_blank" variant="text">
                      <v-icon>mdi-eye</v-icon>
                    </v-btn>
                  </template>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>

        <hr style="border: 0; height: 1px; background-color: orange" />
      </v-container>
    </v-main>
  </v-app>
</template>

<style>
.styled-stat-card {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  color: black;
}

.v-card-text {
  position: relative;
  z-index: 2;
}

.yellow-underline {
  height: 4px;
  background-color: #ffc107;
  border-radius: 0 0 8px 8px;
  margin: 0 16px 16px;
}

.dashed-hr {
  border: none; /* remove default */
  border-top: 1px dashed #888; /* dashed top border */
  margin: 10px 0; /* vertical spacing */
}
</style>
