<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const router = useRouter()
const goTo = (route) => router.push({ name: route })

const search = ref('')
const selectedYear = ref(null)
const selectedSemester = ref(null)
const yearOptions = ['2024-2025', '2023-2024']
const semesterOptions = ['1st Semester', '2nd Semester']

const syllabi = ref([
  {
    descriptive_title: 'OOP',
    course_code: 'CS203',
    acad_year: '2024-2025',
    semester: '1st Semester',
    file_url: '/syllabus/oop.pdf',
  },
  {
    descriptive_title: 'Data Structures',
    course_code: 'CS202',
    acad_year: '2023-2024',
    semester: '2nd Semester',
    file_url: '/syllabus/ds.pdf',
  },
])

const filteredSyllabi = computed(() => {
  return syllabi.value.filter((s) => {
    return (
      (!search.value || s.descriptive_title.toLowerCase().includes(search.value.toLowerCase())) &&
      (!selectedYear.value || s.acad_year === selectedYear.value) &&
      (!selectedSemester.value || s.semester === selectedSemester.value)
    )
  })
})
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
          <v-col cols="auto">
            <v-btn
              variant="outlined"
              color="orange-darken-3"
              size="small"
              @click="goTo('upload-syllabus')"
              class="text-capitalize"
            >
              <v-icon start>mdi-plus</v-icon>
              Upload Syllabus
            </v-btn>
          </v-col>
        </v-row>

        <!-- Filters (search, year, semester) -->
        <v-row class="mb-4" dense>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="search"
              label="Search Syllabi..."
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

        <!-- Syllabi List -->
        <v-row>
          <v-col>
            <v-card v-for="(item, index) in filteredSyllabi" :key="index" class="mb-4">
              <v-card-title class="font-weight-medium">
                {{ item.descriptive_title }} ({{ item.course_code }})
              </v-card-title>
              <v-card-subtitle> {{ item.acad_year }} • {{ item.semester }} </v-card-subtitle>
              <v-card-actions>
                <v-btn icon :href="item.file_url" target="_blank" variant="text">
                  <v-icon>mdi-open-in-new</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <!-- Footer -->
        <div class="my-1 text-black">
          <AppFooter />
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>
