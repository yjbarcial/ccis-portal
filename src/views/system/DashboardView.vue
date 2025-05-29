<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import AppHeader from '@/components/layout/AppHeader.vue'
import { useSyllabiStore } from '@/stores/syllabi'
import { useThesesStore } from '@/stores/theses'

const router = useRouter()
const syllabiStore = useSyllabiStore()
const thesesStore = useThesesStore()

// Get theme from Vuetify
const theme = useTheme()
const isDark = ref(false)

// Load theme preference on mount
onMounted(async () => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
  }

  await Promise.all([syllabiStore.getSyllabi(), thesesStore.getTheses()])
})

// Watch for theme changes
watch(
  () => theme.global.name.value,
  (newTheme) => {
    isDark.value = newTheme === 'dark'
  },
)

const goTo = (route) => router.push({ name: route })

const handleLogout = () => {
  // Implement logout logic here
  console.log('Logging out...')
  // After logout, redirect to login page
  // router.push({ name: 'login' })
}

const search = ref('')
const selectedYear = ref(null)
const selectedDepartment = ref(null)
const yearOptions = ['2024-2025', '2023-2024']
const departmentOptions = ['Information System', 'Information Technology', 'Computer Science']

const totalSyllabi = computed(() => syllabiStore.syllabi.length)
const totalTheses = computed(() => thesesStore.theses.length)

const recentSyllabi = computed(() => syllabiStore.syllabi.slice(0, 2))
const recentTheses = computed(() => thesesStore.theses.slice(0, 2))

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
      (!selectedDepartment.value || t.department === selectedDepartment.value)
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
            <h1 class="text-h4 font-weight-bold mb-1" :class="{ 'text-white': isDark }">
              Welcome, Instructor!
            </h1>
          </v-col>
        </v-row>

        <hr class="dashed-hr" :class="{ 'dark-dashed-hr': isDark }" />

        <!-- Statistics -->
        <v-row class="mb-6 mt-5" dense justify="center">
          <v-col cols="12" md="6" lg="3" class="d-flex justify-center">
            <v-card
              class="styled-stat-card mb-4 me-md-8"
              :class="{ 'dark-card': isDark }"
              style="max-width: 400px; width: 100%"
            >
              <v-img src="/images/syllabus.jpg" height="80" cover class="card-img"></v-img>
              <v-card-text class="text-center">
                <v-icon size="30" class="mb-2" :color="isDark ? 'white' : 'black'"
                  >mdi-file-document</v-icon
                >
                <div class="text-h6" :class="{ 'text-white': isDark }">Total Syllabi</div>
                <div class="text-h4 font-weight-bold" :class="{ 'text-white': isDark }">
                  {{ totalSyllabi }}
                </div>
              </v-card-text>
              <div class="yellow-underline"></div>
            </v-card>
          </v-col>

          <v-col cols="12" md="6" lg="3" class="d-flex justify-center">
            <v-card
              class="styled-stat-card mb-4 ms-md-8"
              :class="{ 'dark-card': isDark }"
              style="max-width: 400px; width: 100%"
            >
              <v-img src="/images/thesis.jpg" height="80" cover class="card-img"></v-img>
              <v-card-text class="text-center">
                <v-icon size="30" class="mb-2" :color="isDark ? 'white' : 'black'"
                  >mdi-book-education</v-icon
                >
                <div class="text-h6" :class="{ 'text-white': isDark }">Total Theses</div>
                <div class="text-h4 font-weight-bold" :class="{ 'text-white': isDark }">
                  {{ totalTheses }}
                </div>
              </v-card-text>
              <div class="yellow-underline"></div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Latest Uploads -->
        <v-row dense justify="center">
          <v-col cols="12" md="5">
            <v-card class="mb-6" :class="{ 'dark-card': isDark }">
              <v-card-title class="font-weight-bold" :class="{ 'text-white': isDark }"
                >Latest Syllabi</v-card-title
              >
              <v-divider :class="{ 'dark-divider': isDark }" />
              <v-list density="compact" :class="{ 'dark-list': isDark }">
                <v-list-item
                  v-for="(item, index) in filteredSyllabi"
                  :key="index"
                  :title="item.descriptive_title"
                  :subtitle="`${item.course_code} • ${item.acad_year}`"
                  :class="{ 'dark-list-item': isDark }"
                >
                  <template #append>
                    <v-btn
                      icon
                      :href="item.file_url"
                      target="_blank"
                      variant="text"
                      :color="isDark ? 'orange-lighten-1' : 'orange-darken-2'"
                    >
                      <v-icon>mdi-open-in-new</v-icon>
                    </v-btn>
                  </template>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>

          <v-col cols="12" md="5">
            <v-card class="mb-6" :class="{ 'dark-card': isDark }">
              <v-card-title class="font-weight-bold" :class="{ 'text-white': isDark }"
                >Latest Theses</v-card-title
              >
              <v-divider :class="{ 'dark-divider': isDark }" />
              <v-list density="compact" :class="{ 'dark-list': isDark }">
                <v-list-item
                  v-for="(item, index) in filteredTheses"
                  :key="index"
                  :title="item.title"
                  :subtitle="`${item.acad_year} • ${item.department}`"
                  :class="{ 'dark-list-item': isDark }"
                >
                  <template #append>
                    <v-btn
                      icon
                      :href="item.file_url_front_page"
                      target="_blank"
                      variant="text"
                      :color="isDark ? 'orange-lighten-1' : 'orange-darken-2'"
                      class="me-2"
                    >
                      <v-icon>mdi-file-document</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      :href="item.file_url_abstract"
                      target="_blank"
                      variant="text"
                      :color="isDark ? 'orange-lighten-1' : 'orange-darken-2'"
                    >
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

<style>
.styled-stat-card {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
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

/* Dark mode styles */
.dark-card {
  background-color: #1e1e1e !important;
}

.dark-list {
  background-color: #1e1e1e !important;
  color: white !important;
}

.dark-list-item {
  color: white !important;
}

.dark-divider {
  border-color: rgba(255, 255, 255, 0.12) !important;
}

.dark-dashed-hr {
  border-top: 1px dashed #aaa;
}
</style>
