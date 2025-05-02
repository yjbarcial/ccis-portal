<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase'
import { useThesesStore } from '@/stores/theses'
import { requiredValidator } from '@/utils/validators'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const thesesStore = useThesesStore()
const router = useRouter()

// Form fields
const title = ref('')
const abstract = ref('')
const abstractImage = ref(null)
const objectivesImage = ref(null)
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
const abstractExpanded = ref(false)

const handleImageChange = (event, type) => {
  const selectedFile = event.target.files[0]
  if (selectedFile && (selectedFile.type === 'image/jpeg' || selectedFile.type === 'image/png')) {
    if (type === 'abstract') {
      abstractImage.value = selectedFile
    } else {
      objectivesImage.value = selectedFile
    }
  } else {
    error.value = 'Please select a valid image file (JPEG or PNG)'
    if (type === 'abstract') {
      abstractImage.value = null
    } else {
      objectivesImage.value = null
    }
  }
}

const handleSubmit = async () => {
  error.value = ''
  const isValid = await form.value.validate()

  if (!isValid.valid) {
    error.value = 'Please fix the errors in the form.'
    return
  }

  if (!abstractImage.value || !objectivesImage.value) {
    error.value = 'Please upload both abstract and objectives images'
    return
  }

  loading.value = true
  uploadProgress.value = 0

  try {
    // Generate unique filenames
    const abstractFileName = `abstract_${Date.now()}.${abstractImage.value.name.split('.').pop()}`
    const objectivesFileName = `objectives_${Date.now()}.${objectivesImage.value.name.split('.').pop()}`

    // Upload abstract image
    const { data: abstractUploadData, error: abstractUploadError } = await supabase.storage
      .from('theses')
      .upload(abstractFileName, abstractImage.value, {
        cacheControl: '3600',
        upsert: false,
      })

    if (abstractUploadError) throw abstractUploadError

    // Upload objectives image
    const { data: objectivesUploadData, error: objectivesUploadError } = await supabase.storage
      .from('theses')
      .upload(objectivesFileName, objectivesImage.value, {
        cacheControl: '3600',
        upsert: false,
      })

    if (objectivesUploadError) throw objectivesUploadError

    // Get public URLs
    const {
      data: { publicUrl: abstractUrl },
    } = supabase.storage.from('theses').getPublicUrl(abstractFileName)

    const {
      data: { publicUrl: objectivesUrl },
    } = supabase.storage.from('theses').getPublicUrl(objectivesFileName)

    // Insert thesis record
    const { error: insertError } = await supabase.from('theses').insert({
      title: title.value,
      abstract: abstract.value,
      file_url_abstract: abstractUrl,
      file_url_objectives: objectivesUrl,
      acad_year: acadYear.value,
      semester: semester.value,
    })

    if (insertError) throw insertError

    // Refresh theses list
    await thesesStore.getTheses()
    router.push({ name: 'theses' })
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
            <h1 class="text-h5 font-weight-bold">Upload Thesis</h1>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="auto">
            <v-btn
              variant="flat"
              density="comfortable"
              color="orange-darken-3"
              size="small"
              @click="router.push({ name: 'theses' })"
              icon="mdi-arrow-left"
            >
            </v-btn>
          </v-col>
        </v-row>

        <v-card class="mx-auto" max-width="800" elevation="2">
          <v-card-text>
            <v-form ref="form" @submit.prevent="handleSubmit">
              <v-text-field
                v-model="title"
                label="Thesis Title"
                :rules="rules.required"
                class="mb-4"
              />

              <v-textarea
                v-model="abstract"
                label="Abstract"
                :rules="rules.required"
                rows="3"
                auto-grow
                class="mb-4"
              />

              <v-row>
                <v-col cols="12" md="6">
                  <v-file-input
                    v-model="abstractImage"
                    label="Abstract Image"
                    accept="image/jpeg,image/png"
                    :rules="rules.required"
                    @change="(e) => handleImageChange(e, 'abstract')"
                    prepend-icon="mdi-image"
                    :loading="loading"
                    class="mb-4"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-file-input
                    v-model="objectivesImage"
                    label="Objectives Image"
                    accept="image/jpeg,image/png"
                    :rules="rules.required"
                    @change="(e) => handleImageChange(e, 'objectives')"
                    prepend-icon="mdi-image"
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
                  Upload Thesis
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
