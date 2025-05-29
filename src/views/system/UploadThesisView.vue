<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase'
import { useThesesStore } from '@/stores/theses'
import { requiredValidator } from '@/utils/validators'
import AppHeader from '@/components/layout/AppHeader.vue'
import { useAuthStore } from '@/stores/auth'

const thesesStore = useThesesStore()
const router = useRouter()
const authStore = useAuthStore()

// Form fields
const title = ref('')
const abstract = ref('')
const abstractImage = ref(null)
const objectivesImage = ref(null)
const frontPageImage = ref(null)
const acadYear = ref(null)
const department = ref(null)

// Options
const yearOptions = ['2020', '2021', '2022', '2023', '2024']
const departmentOptions = ['Information System', 'Information Technology', 'Computer Science']

// Validation rules
const rules = {
  required: [requiredValidator],
}

const form = ref(null)
const loading = ref(false)
const error = ref('')
const uploadProgress = ref(0)
const abstractExpanded = ref(false)

const canUpload = computed(() => {
  const adminEmails = [
    'yssahjulianah.barcial@carsu.edu.ph',
    'lovellhudson.clavel@carsu.edu.ph',
    'altheaguila.gorres@carsu.edu.ph',
    'magnoliajamkee.masong@carsu.edu.ph',
    'jesilou.felisco@carsu.edu.ph',
    'ersiajara.libiano@carsu.edu.ph',
    'augustencarl.delvo@carsu.edu.ph',
    'shanraquelmae.paqueo@carsu.edu.ph',
    'darlpatrick.magatao@carsu.edu.ph',
    'yvonne.piencenaves@carsu.edu.ph',
  ]
  return authStore.user?.email && adminEmails.includes(authStore.user.email)
})

// Add navigation guard
onMounted(() => {
  if (!canUpload.value) {
    router.push({ name: 'theses' })
  }
})

const handleImageChange = (event, type) => {
  const selectedFile = event.target.files[0]
  if (selectedFile && (selectedFile.type === 'image/jpeg' || selectedFile.type === 'image/png')) {
    if (type === 'abstract') {
      abstractImage.value = selectedFile
    } else if (type === 'objectives') {
      objectivesImage.value = selectedFile
    } else if (type === 'frontPage') {
      frontPageImage.value = selectedFile
    }
  } else {
    error.value = 'Please select a valid image file (JPEG or PNG)'
    if (type === 'abstract') {
      abstractImage.value = null
    } else if (type === 'objectives') {
      objectivesImage.value = null
    } else if (type === 'frontPage') {
      frontPageImage.value = null
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

  if (!abstractImage.value || !objectivesImage.value || !frontPageImage.value) {
    error.value = 'Please upload all required images (abstract, objectives, and front page)'
    return
  }

  loading.value = true
  uploadProgress.value = 0

  try {
    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError) throw userError
    if (!user) throw new Error('User not authenticated')

    // Generate unique filenames with user ID
    const abstractFileName = `abstracts/${user.id}/${Date.now()}.${abstractImage.value.name.split('.').pop()}`
    const objectivesFileName = `objectives/${user.id}/${Date.now()}.${objectivesImage.value.name.split('.').pop()}`
    const frontPageFileName = `front_pages/${user.id}/${Date.now()}.${frontPageImage.value.name.split('.').pop()}`

    // Upload abstract image
    const { error: abstractUploadError } = await supabase.storage
      .from('theses')
      .upload(abstractFileName, abstractImage.value, {
        cacheControl: '3600',
        upsert: false,
      })

    if (abstractUploadError) throw abstractUploadError

    // Upload objectives image
    const { error: objectivesUploadError } = await supabase.storage
      .from('theses')
      .upload(objectivesFileName, objectivesImage.value, {
        cacheControl: '3600',
        upsert: false,
      })

    if (objectivesUploadError) throw objectivesUploadError

    // Upload front page image
    const { error: frontPageUploadError } = await supabase.storage
      .from('theses')
      .upload(frontPageFileName, frontPageImage.value, {
        cacheControl: '3600',
        upsert: false,
      })

    if (frontPageUploadError) throw frontPageUploadError

    // Get public URLs
    const {
      data: { publicUrl: abstractUrl },
    } = supabase.storage.from('theses').getPublicUrl(abstractFileName)

    const {
      data: { publicUrl: objectivesUrl },
    } = supabase.storage.from('theses').getPublicUrl(objectivesFileName)

    const {
      data: { publicUrl: frontPageUrl },
    } = supabase.storage.from('theses').getPublicUrl(frontPageFileName)

    // Insert thesis record using the store
    await thesesStore.insertThesis({
      title: title.value,
      abstract: abstract.value,
      file_url_abstract: abstractUrl,
      file_url_objectives: objectivesUrl,
      file_url_front_page: frontPageUrl,
      acad_year: acadYear.value,
      department: department.value,
    })

    // Navigate back to theses view
    router.push({ name: 'theses' })
  } catch (err) {
    console.error('Error uploading thesis:', err)
    error.value = `Failed to upload thesis: ${err.message}`
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
          <v-col cols="auto" class="me-5">
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

        <v-alert v-if="!canUpload" type="warning" class="mb-4">
          You don't have permission to upload theses. Please contact an administrator.
        </v-alert>

        <v-card v-else class="mx-auto" max-width="800" elevation="2">
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
                <v-col cols="12" md="4">
                  <v-file-input
                    v-model="frontPageImage"
                    label="Front Page Image"
                    accept="image/jpeg,image/png"
                    :rules="rules.required"
                    @change="(e) => handleImageChange(e, 'frontPage')"
                    prepend-icon="mdi-file-document"
                    :loading="loading"
                    class="mb-4"
                  />
                </v-col>
                <v-col cols="12" md="4">
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
                <v-col cols="12" md="4">
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
                    v-model="department"
                    :items="departmentOptions"
                    label="Department"
                    :rules="rules.required"
                    class="mb-4"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="acadYear"
                    :items="yearOptions"
                    label="Academic Year"
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
      </v-container>
    </v-main>
  </v-app>
</template>
