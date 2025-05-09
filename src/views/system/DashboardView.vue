<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import { useSyllabiStore } from '@/stores/syllabi'
import { useThesesStore } from '@/stores/theses'

const router = useRouter()
const syllabiStore = useSyllabiStore()
const thesesStore = useThesesStore()

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

const totalSyllabi = computed(() => syllabiStore.syllabi.length)
const totalTheses = computed(() => thesesStore.theses.length)

const recentSyllabi = computed(() => syllabiStore.syllabi.slice(0, 2))
const recentTheses = computed(() => thesesStore.theses.slice(0, 2))

onMounted(async () => {
  await Promise.all([syllabiStore.getSyllabi(), thesesStore.getTheses()])
})

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
        <v-row class="mb-6 mt-5" dense justify="center">
          <v-col cols="12" md="6" lg="3" class="d-flex justify-center">
            <v-card class="styled-stat-card mb-4 me-md-8" style="max-width: 400px; width: 100%">
              <v-img src="/images/syllabus.jpg" height="80" cover class="card-img"></v-img>
              <v-card-text class="text-center">
                <v-icon size="30" class="mb-2">mdi-file-document</v-icon>
                <div class="text-h6">Total Syllabi</div>
                <div class="text-h4 font-weight-bold">{{ totalSyllabi }}</div>
              </v-card-text>
              <div class="yellow-underline"></div>
            </v-card>
          </v-col>

          <v-col cols="12" md="6" lg="3" class="d-flex justify-center">
            <v-card class="styled-stat-card mb-4 ms-md-8" style="max-width: 400px; width: 100%">
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

        <!-- Footer -->
        <div class="my-1 text-black">
          <AppFooter />
        </div>
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
