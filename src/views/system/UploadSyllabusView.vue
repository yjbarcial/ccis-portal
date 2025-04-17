<template>
  <v-app>
    <!-- Top App Bar -->
    <v-app-bar color="orange-darken-4" dark flat app>
      <v-container fluid class="d-flex align-center justify-space-between">
        <v-toolbar-title class="text-h6">CCIS Portal</v-toolbar-title>
        <div class="d-flex align-center gap-4">
          <v-btn variant="text" @click="goTo('dashboard')" class="text-white">Dashboard</v-btn>
          <v-btn variant="text" @click="goTo('syllabi')" class="text-white">Syllabi</v-btn>
          <v-btn variant="text" @click="goTo('thesis')" class="text-white">Thesis</v-btn>
          <v-btn variant="text" @click="goTo('upload-syllabus')" class="text-white">Upload Syllabus</v-btn>
        </div>
      </v-container>
    </v-app-bar>

    <v-main>
      <v-container class="py-10">
        <h1 class="text-h5 font-weight-bold mb-4">Upload New Syllabus</h1>
        <v-form @submit.prevent="submit">
          <v-text-field v-model="form.descriptive_title" label="Descriptive Title" required />
          <v-text-field v-model="form.course_code" label="Course Code" required />
          <v-select v-model="form.acad_year" :items="yearOptions" label="Academic Year" required />
          <v-select v-model="form.semester" :items="semesterOptions" label="Semester" required />
          <v-file-input v-model="form.file" label="Syllabus File" required accept=".pdf" />
          <v-btn type="submit" color="orange-darken-3" class="mt-4" dark>Upload</v-btn>
        </v-form>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const goTo = (route) => router.push({ name: route })

const form = ref({
  descriptive_title: '',
  course_code: '',
  acad_year: '',
  semester: '',
  file: null,
})

const yearOptions = ['2024-2025', '2023-2024']
const semesterOptions = ['1st Semester', '2nd Semester']

const submit = () => {
  console.log('Uploading:', form.value)
  // Add actual upload logic here
}
</script>
