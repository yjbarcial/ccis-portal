<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSyllabiStore } from '@/stores/syllabi'
import { useAuthStore } from '@/stores/auth'
import { requiredValidator } from '@/utils/validators'
import { supabase } from '@/utils/supabase'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const syllabiStore = useSyllabiStore()
const authStore = useAuthStore()
const router = useRouter()

// Form fields
const descriptiveTitle = ref('')
const courseCode = ref('')
const file = ref(null)
const acadYear = ref(null)
const semester = ref(null)

// Options
const yearOptions = ['2024-2025', '2023-2024']
const semesterOptions = ['1st Semester', '2nd Semester']

// Validation rules
const rules = {
  required: [requiredValidator],
}

const form = ref(null)
const loading = ref(false)
const error = ref('')
const uploadProgress = ref(0)

const handleFileChange = (event) => {
  const selectedFile = event.target.files[0]
  if (selectedFile && selectedFile.type === 'application/pdf') {
    file.value = selectedFile
  } else {
    error.value = 'Please select a PDF file'
    file.value = null
  }
}

const handleSubmit = async () => {
  error.value = ''
  const isValid = await form.value.validate()

  if (!isValid.valid) {
    error.value = 'Please fix the errors in the form.'
    return
  }

  if (!file.value) {
    error.value = 'Please select a PDF file to upload'
    return
  }

  loading.value = true
  uploadProgress.value = 0

  try {
    // Generate a unique filename
    const fileExt = file.value.name.split('.').pop()
    const fileName = `${authStore.user.id}/${Date.now()}.${fileExt}`

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('syllabi')
      .upload(fileName, file.value, {
        cacheControl: '3600',
        upsert: false,
        onUploadProgress: (progress) => {
          uploadProgress.value = (progress.loaded / progress.total) * 100
        },
      })

    if (uploadError) throw uploadError

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('syllabi').getPublicUrl(fileName)

    // Insert syllabus record
    await syllabiStore.insertSyllabus({
      descriptive_title: descriptiveTitle.value,
      course_code: courseCode.value,
      file_url: publicUrl,
      acad_year: acadYear.value,
      semester: semester.value,
    })

    router.push({ name: 'syllabi' })
  } catch (err) {
    console.error('Upload error:', err)
    error.value = 'Upload failed. Please try again.'
  } finally {
    loading.value = false
    uploadProgress.value = 0
  }
}
</script>

<template>
  <v-app>
    <app-header title="CCIS Portal" />
    <v-main>
      <v-container fluid class="py-6">
        <!-- Title Section -->
        <v-row class="mb-4" align="center">
          <v-col cols="auto">
            <h1 class="text-h5 font-weight-bold">Upload Syllabus</h1>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="auto">
            <v-btn
              variant="flat"
              density="comfortable"
              color="orange-darken-3"
              size="small"
              @click="router.push({ name: 'syllabi' })"
              icon="mdi-arrow-left"
            >
            </v-btn>
          </v-col>
        </v-row>

        <v-card class="mx-auto" max-width="800" elevation="2">
          <v-card-text>
            <v-form ref="form" @submit.prevent="handleSubmit">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="descriptiveTitle"
                    label="Descriptive Title"
                    :rules="rules.required"
                    class="mb-4"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="courseCode"
                    label="Course Code"
                    :rules="rules.required"
                    class="mb-4"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="6">
                  <v-file-input
                    v-model="file"
                    label="Syllabus PDF"
                    accept=".pdf"
                    :rules="rules.required"
                    @change="handleFileChange"
                    prepend-icon="mdi-file-pdf-box"
                    :loading="loading"
                    class="mb-4"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="acadYear"
                    :items="yearOptions"
                    label="Academic Year"
                    :rules="rules.required"
                    class="mb-4"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="semester"
                    :items="semesterOptions"
                    label="Semester"
                    :rules="rules.required"
                    class="mb-4"
                  />
                </v-col>
              </v-row>

              <v-progress-linear
                v-if="loading"
                v-model="uploadProgress"
                color="orange-darken-3"
                height="25"
                class="mb-4"
              >
                <template v-slot:default="{ value }">
                  <strong>{{ Math.ceil(value) }}%</strong>
                </template>
              </v-progress-linear>

              <v-alert v-if="error" type="error" class="mb-4">
                {{ error }}
              </v-alert>

              <div class="d-flex justify-end">
                <v-btn
                  type="submit"
                  color="orange-darken-3"
                  size="large"
                  :loading="loading"
                  class="px-6"
                >
                  Upload Syllabus
                </v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>

        <!-- Footer -->
        <div class="my-1 text-black">
          <AppFooter />
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>
