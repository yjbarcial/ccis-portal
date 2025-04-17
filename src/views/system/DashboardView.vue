<template>
  <v-app>
    <!-- Top App Bar with Navigation Links -->
    <v-app-bar color="orange-darken-4" dark flat app>
      <v-container fluid class="d-flex align-center justify-space-between">
        <v-toolbar-title class="text-h6">Instructor Dashboard</v-toolbar-title>
        <div class="d-flex align-center gap-4">
          <v-btn variant="text" @click="goTo('dashboard')" class="text-white">Dashboard</v-btn>
          <v-btn variant="text" @click="goTo('syllabi')" class="text-white">Syllabi</v-btn>
          <v-btn variant="text" @click="goTo('thesis')" class="text-white">Thesis</v-btn>
          <v-btn variant="text" @click="goTo('upload-syllabus')" class="text-white"
            >Upload Syllabus</v-btn
          >

          <!-- User Menu -->
          <v-menu location="bottom end">
            <template v-slot:activator="{ props }">
              <v-btn icon v-bind="props">
                <v-avatar color="orange-darken-2" size="36">
                  <v-icon>mdi-account</v-icon>
                </v-avatar>
              </v-btn>
            </template>

            <v-list>
              <v-list-item @click="goTo('profile')">
                <template v-slot:prepend>
                  <v-icon>mdi-account-circle</v-icon>
                </template>
                <v-list-item-title>Profile</v-list-item-title>
              </v-list-item>

              <v-list-item @click="goTo('settings')">
                <template v-slot:prepend>
                  <v-icon>mdi-cog</v-icon>
                </template>
                <v-list-item-title>Settings</v-list-item-title>
              </v-list-item>

              <v-divider></v-divider>

              <v-list-item @click="handleLogout" color="error">
                <template v-slot:prepend>
                  <v-icon>mdi-logout</v-icon>
                </template>
                <v-list-item-title>Logout</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </v-container>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <v-row>
          <v-col>
            <h1 class="text-h4 font-weight-bold mb-4">Welcome, Instructor!</h1>
          </v-col>
        </v-row>

        <!-- Statistics -->
        <v-row class="mb-6" dense>
          <v-col cols="12" md="6" lg="3">
            <v-card color="orange-darken-3" class="pa-4" dark elevation="6">
              <v-icon size="36" class="mb-2">mdi-file-document</v-icon>
              <div class="text-h6">Total Syllabi</div>
              <div class="text-h4 font-weight-bold">{{ totalSyllabi }}</div>
            </v-card>
          </v-col>

          <v-col cols="12" md="6" lg="3">
            <v-card color="deep-orange" class="pa-4" dark elevation="6">
              <v-icon size="36" class="mb-2">mdi-book-education</v-icon>
              <div class="text-h6">Total Theses</div>
              <div class="text-h4 font-weight-bold">{{ totalTheses }}</div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Filters -->
        <v-row class="mb-4">
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
        <v-row dense>
          <v-col cols="12" md="6">
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

          <v-col cols="12" md="6">
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
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

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
