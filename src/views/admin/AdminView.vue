<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const router = useRouter()

// State for statistics and users
const statistics = ref({
  totalUsers: 0,
  activeUsers: 0,
  totalTheses: 0,
  totalSyllabi: 0,
  recentUploads: [],
  recentSyllabi: [],
})

// Add new state for thesis upload
const thesisForm = ref({
  title: '',
  abstract: '',
  abstractImage: null,
  objectivesImage: null,
  acadYear: null,
  semester: null,
})

const users = ref([])
const loading = ref(true)
const error = ref(null)
const search = ref('')
const statusFilter = ref('all')
const departmentFilter = ref('all')
const sortBy = ref('created_at')

const uploadProgress = ref(0)
const isUploading = ref(false)
const uploadError = ref(null)

// Departments for filtering
const departments = [
  'Computer Science',
  'Information Technology',
  'Information Systems',
  'Computer Engineering',
]

const activeTab = ref('thesis')

// Fetch statistics and user data
onMounted(async () => {
  try {
    // Fetch total users
    const { count: userCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
    statistics.value.totalUsers = userCount || 0

    // Fetch active users (logged in within last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const { count: activeUserCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('last_sign_in_at', thirtyDaysAgo.toISOString())
    statistics.value.activeUsers = activeUserCount || 0

    // Fetch total theses
    const { count: thesisCount } = await supabase
      .from('theses')
      .select('*', { count: 'exact', head: true })
    statistics.value.totalTheses = thesisCount || 0

    // Fetch total syllabi
    const { count: syllabiCount } = await supabase
      .from('syllabi')
      .select('*', { count: 'exact', head: true })
    statistics.value.totalSyllabi = syllabiCount || 0

    // Fetch recent uploads (last 24 hours)
    const twentyFourHoursAgo = new Date()
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24)
    const { count: pendingCount } = await supabase
      .from('theses')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', twentyFourHoursAgo.toISOString())
    statistics.value.pendingUploads = pendingCount || 0

    // Fetch recent uploads with user information
    const { data: recentUploads } = await supabase
      .from('theses')
      .select(
        `
        *,
        profiles:user_id (
          email,
          full_name,
          department
        )
      `,
      )
      .order('created_at', { ascending: false })
      .limit(5)
    statistics.value.recentUploads = recentUploads || []

    // Fetch recent syllabi uploads
    const { data: recentSyllabi } = await supabase
      .from('syllabi')
      .select(
        `
        *,
        profiles:user_id (
          email,
          full_name,
          department
        )
      `,
      )
      .order('created_at', { ascending: false })
      .limit(5)
    statistics.value.recentSyllabi = recentSyllabi || []

    // Fetch users
    const { data: usersData } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    users.value = usersData || []
  } catch (err) {
    console.error('Error fetching admin data:', err)
    error.value = 'Failed to load dashboard data'
  } finally {
    loading.value = false
  }
})

// Computed properties for filtered users
const filteredUsers = computed(() => {
  return users.value
    .filter((user) => {
      const matchesSearch =
        !search.value ||
        user.email.toLowerCase().includes(search.value.toLowerCase()) ||
        user.full_name?.toLowerCase().includes(search.value.toLowerCase())

      const matchesStatus =
        statusFilter.value === 'all' ||
        (statusFilter.value === 'active' && user.status === 'active') ||
        (statusFilter.value === 'inactive' && user.status !== 'active')

      const matchesDepartment =
        departmentFilter.value === 'all' || user.department === departmentFilter.value

      return matchesSearch && matchesStatus && matchesDepartment
    })
    .sort((a, b) => {
      if (sortBy.value === 'created_at') {
        return new Date(b.created_at) - new Date(a.created_at)
      }
      if (sortBy.value === 'email') {
        return a.email.localeCompare(b.email)
      }
      if (sortBy.value === 'user_metadata') {
        return (a.full_name || '').localeCompare(b.full_name || '')
      }
      return 0
    })
})

// Format date helper
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Update user status
const updateUserStatus = async (userId, newStatus) => {
  try {
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ status: newStatus })
      .eq('id', userId)

    if (updateError) throw updateError

    // Update local state
    const userIndex = users.value.findIndex((u) => u.id === userId)
    if (userIndex !== -1) {
      users.value[userIndex].status = newStatus
    }
  } catch (err) {
    console.error('Error updating user status:', err)
    error.value = 'Failed to update user status'
  }
}

// View user details
const viewUserDetails = (userId) => {
  // Implement user details view
  console.log('Viewing user details:', userId)
}

// Navigation helper
const goTo = (route, params = {}) => {
  router.push({ name: route, params })
}

// Add thesis upload handler
const handleThesisUpload = async () => {
  if (!thesisForm.value.title || !thesisForm.value.abstract) {
    uploadError.value = 'Please fill in all required fields'
    return
  }

  isUploading.value = true
  uploadError.value = null

  try {
    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    // Upload abstract image if provided
    let abstractImageUrl = null
    if (thesisForm.value.abstractImage) {
      const fileExt = thesisForm.value.abstractImage.name.split('.').pop()
      const fileName = `abstracts/${user.id}/${Date.now()}.${fileExt}`
      const { error: uploadError } = await supabase.storage
        .from('theses')
        .upload(fileName, thesisForm.value.abstractImage)
      if (uploadError) throw uploadError
      const {
        data: { publicUrl },
      } = supabase.storage.from('theses').getPublicUrl(fileName)
      abstractImageUrl = publicUrl
    }

    // Upload objectives image if provided
    let objectivesImageUrl = null
    if (thesisForm.value.objectivesImage) {
      const fileExt = thesisForm.value.objectivesImage.name.split('.').pop()
      const fileName = `objectives/${user.id}/${Date.now()}.${fileExt}`
      const { error: uploadError } = await supabase.storage
        .from('theses')
        .upload(fileName, thesisForm.value.objectivesImage)
      if (uploadError) throw uploadError
      const {
        data: { publicUrl },
      } = supabase.storage.from('theses').getPublicUrl(fileName)
      objectivesImageUrl = publicUrl
    }

    // Insert thesis record
    const { error: insertError } = await supabase.from('theses').insert({
      title: thesisForm.value.title,
      abstract: thesisForm.value.abstract,
      abstract_image: abstractImageUrl,
      objectives_image: objectivesImageUrl,
      acad_year: thesisForm.value.acadYear,
      semester: thesisForm.value.semester,
      user_id: user.id,
      status: 'approved', // Auto-approve admin uploads
    })

    if (insertError) throw insertError

    // Reset form
    thesisForm.value = {
      title: '',
      abstract: '',
      abstractImage: null,
      objectivesImage: null,
      acadYear: null,
      semester: null,
    }

    // Refresh statistics
    await fetchStatistics()
  } catch (err) {
    console.error('Error uploading thesis:', err)
    uploadError.value = 'Failed to upload thesis. Please try again.'
  } finally {
    isUploading.value = false
    uploadProgress.value = 0
  }
}

// Add image change handler
const handleImageChange = (event, type) => {
  const file = event.target.files[0]
  if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
    if (type === 'abstract') {
      thesisForm.value.abstractImage = file
    } else {
      thesisForm.value.objectivesImage = file
    }
  } else {
    uploadError.value = 'Please select a valid image file (JPEG or PNG)'
  }
}

// Add fetch statistics function
const fetchStatistics = async () => {
  try {
    // Fetch total theses
    const { count: thesisCount } = await supabase
      .from('theses')
      .select('*', { count: 'exact', head: true })
    statistics.value.totalTheses = thesisCount || 0

    // Fetch total syllabi
    const { count: syllabiCount } = await supabase
      .from('syllabi')
      .select('*', { count: 'exact', head: true })
    statistics.value.totalSyllabi = syllabiCount || 0

    // Fetch recent uploads
    const { data: recentUploads } = await supabase
      .from('theses')
      .select(
        `
        *,
        profiles:user_id (
          email,
          full_name,
          department
        )
      `,
      )
      .order('created_at', { ascending: false })
      .limit(5)
    statistics.value.recentUploads = recentUploads || []

    // Fetch recent syllabi
    const { data: recentSyllabi } = await supabase
      .from('syllabi')
      .select(
        `
        *,
        profiles:user_id (
          email,
          full_name,
          department
        )
      `,
      )
      .order('created_at', { ascending: false })
      .limit(5)
    statistics.value.recentSyllabi = recentSyllabi || []
  } catch (err) {
    console.error('Error fetching statistics:', err)
  }
}
</script>

<template>
  <v-app>
    <AppHeader title="Admin Dashboard" />

    <v-main>
      <v-container class="py-8">
        <!-- Loading State -->
        <v-overlay v-if="loading" class="align-center justify-center">
          <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>

        <!-- Error State -->
        <v-alert v-if="error" type="error" class="mb-4">
          {{ error }}
        </v-alert>

        <!-- Dashboard Overview -->
        <v-row>
          <v-col cols="12">
            <v-card class="mb-6">
              <v-card-title class="text-h5 font-weight-bold">
                <v-icon class="mr-2" color="primary">mdi-view-dashboard</v-icon>
                Dashboard Overview
              </v-card-title>
              <v-card-text>
                <v-row>
                  <!-- Stats Cards -->
                  <v-col cols="12" sm="6" md="3">
                    <v-card class="pa-4" color="primary" dark elevation="4">
                      <div class="d-flex align-center">
                        <v-icon size="36" class="mr-3">mdi-account-group</v-icon>
                        <div>
                          <div class="text-h4 mb-2">{{ statistics.totalUsers }}</div>
                          <div class="text-subtitle-1">Total Users</div>
                        </div>
                      </div>
                    </v-card>
                  </v-col>

                  <v-col cols="12" sm="6" md="3">
                    <v-card class="pa-4" color="success" dark elevation="4">
                      <div class="d-flex align-center">
                        <v-icon size="36" class="mr-3">mdi-account-check</v-icon>
                        <div>
                          <div class="text-h4 mb-2">{{ statistics.activeUsers }}</div>
                          <div class="text-subtitle-1">Active Users</div>
                        </div>
                      </div>
                    </v-card>
                  </v-col>

                  <v-col cols="12" sm="6" md="3">
                    <v-card class="pa-4" color="info" dark elevation="4">
                      <div class="d-flex align-center">
                        <v-icon size="36" class="mr-3">mdi-file-document</v-icon>
                        <div>
                          <div class="text-h4 mb-2">{{ statistics.totalTheses }}</div>
                          <div class="text-subtitle-1">Total Theses</div>
                        </div>
                      </div>
                    </v-card>
                  </v-col>

                  <v-col cols="12" sm="6" md="3">
                    <v-card class="pa-4" color="warning" dark elevation="4">
                      <div class="d-flex align-center">
                        <v-icon size="36" class="mr-3">mdi-book-open-page-variant</v-icon>
                        <div>
                          <div class="text-h4 mb-2">{{ statistics.totalSyllabi }}</div>
                          <div class="text-subtitle-1">Total Syllabi</div>
                        </div>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>

                <!-- Recent Activity -->
                <v-row class="mt-4">
                  <v-col cols="12" md="6">
                    <v-card>
                      <v-card-title class="text-h6">
                        <v-icon class="mr-2" color="primary">mdi-clipboard-text</v-icon>
                        Recent Thesis Uploads
                      </v-card-title>
                      <v-card-text>
                        <v-table>
                          <thead>
                            <tr>
                              <th>Title</th>
                              <th>Uploaded By</th>
                              <th>Date</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="upload in statistics.recentUploads" :key="upload.id">
                              <td>{{ upload.title }}</td>
                              <td>{{ upload.profiles?.email }}</td>
                              <td>{{ formatDate(upload.created_at) }}</td>
                              <td>
                                <v-chip
                                  :color="upload.status === 'approved' ? 'success' : 'warning'"
                                >
                                  {{ upload.status }}
                                </v-chip>
                              </td>
                            </tr>
                          </tbody>
                        </v-table>
                      </v-card-text>
                    </v-card>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-card>
                      <v-card-title class="text-h6">
                        <v-icon class="mr-2" color="primary">mdi-book-open-page-variant</v-icon>
                        Recent Syllabi Uploads
                      </v-card-title>
                      <v-card-text>
                        <v-table>
                          <thead>
                            <tr>
                              <th>Title</th>
                              <th>Uploaded By</th>
                              <th>Date</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="syllabus in statistics.recentSyllabi" :key="syllabus.id">
                              <td>{{ syllabus.title }}</td>
                              <td>{{ syllabus.profiles?.email }}</td>
                              <td>{{ formatDate(syllabus.created_at) }}</td>
                              <td>
                                <v-chip
                                  :color="syllabus.status === 'approved' ? 'success' : 'warning'"
                                >
                                  {{ syllabus.status }}
                                </v-chip>
                              </td>
                            </tr>
                          </tbody>
                        </v-table>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Content Tabs -->
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-tabs v-model="activeTab" color="primary">
                <v-tab value="thesis">Thesis Management</v-tab>
                <v-tab value="users">User Management</v-tab>
              </v-tabs>

              <v-window v-model="activeTab">
                <!-- Thesis Management Tab -->
                <v-window-item value="thesis">
                  <v-card-text>
                    <v-form @submit.prevent="handleThesisUpload">
                      <v-row dense>
                        <v-col cols="12">
                          <v-text-field
                            v-model="thesisForm.title"
                            label="Thesis Title"
                            variant="outlined"
                            required
                            density="comfortable"
                            class="mb-2"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-textarea
                            v-model="thesisForm.abstract"
                            label="Abstract"
                            variant="outlined"
                            required
                            rows="2"
                            density="comfortable"
                            class="mb-2"
                          ></v-textarea>
                        </v-col>
                      </v-row>

                      <v-row dense>
                        <v-col cols="12" md="6">
                          <v-file-input
                            label="Abstract Image"
                            variant="outlined"
                            accept="image/jpeg,image/png"
                            @change="(e) => handleImageChange(e, 'abstract')"
                            prepend-icon="mdi-image"
                            density="comfortable"
                            class="mb-2"
                          ></v-file-input>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-file-input
                            label="Objectives Image"
                            variant="outlined"
                            accept="image/jpeg,image/png"
                            @change="(e) => handleImageChange(e, 'objectives')"
                            prepend-icon="mdi-image"
                            density="comfortable"
                            class="mb-2"
                          ></v-file-input>
                        </v-col>
                      </v-row>

                      <v-row dense>
                        <v-col cols="12" md="6">
                          <v-select
                            v-model="thesisForm.acadYear"
                            label="Academic Year"
                            :items="['2024-2025', '2023-2024']"
                            variant="outlined"
                            required
                            density="comfortable"
                            class="mb-2"
                          ></v-select>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-select
                            v-model="thesisForm.semester"
                            label="Semester"
                            :items="['1st Semester', '2nd Semester']"
                            variant="outlined"
                            required
                            density="comfortable"
                            class="mb-2"
                          ></v-select>
                        </v-col>
                      </v-row>

                      <v-alert v-if="uploadError" type="error" class="mb-4">
                        {{ uploadError }}
                      </v-alert>

                      <v-btn
                        color="orange-darken-4"
                        type="submit"
                        :loading="isUploading"
                        :disabled="isUploading"
                        class="mt-2"
                        size="large"
                        block
                        prepend-icon="mdi-upload"
                      >
                        Upload Thesis
                      </v-btn>
                    </v-form>
                  </v-card-text>
                </v-window-item>

                <!-- User Management Tab -->
                <v-window-item value="users">
                  <v-card-text>
                    <!-- Filters -->
                    <v-row class="mb-4">
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="search"
                          label="Search users"
                          prepend-inner-icon="mdi-magnify"
                          variant="outlined"
                          density="comfortable"
                          hide-details
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="3">
                        <v-select
                          v-model="statusFilter"
                          label="Status"
                          :items="['all', 'active', 'inactive']"
                          variant="outlined"
                          density="comfortable"
                          hide-details
                        ></v-select>
                      </v-col>
                      <v-col cols="12" md="3">
                        <v-select
                          v-model="departmentFilter"
                          label="Department"
                          :items="['all', ...departments]"
                          variant="outlined"
                          density="comfortable"
                          hide-details
                        ></v-select>
                      </v-col>
                      <v-col cols="12" md="2">
                        <v-select
                          v-model="sortBy"
                          label="Sort by"
                          :items="[
                            { title: 'Date', value: 'created_at' },
                            { title: 'Email', value: 'email' },
                            { title: 'Name', value: 'user_metadata' },
                          ]"
                          variant="outlined"
                          density="comfortable"
                          hide-details
                        ></v-select>
                      </v-col>
                    </v-row>

                    <!-- Users Table -->
                    <v-table>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Department</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="user in filteredUsers" :key="user.id">
                          <td>{{ user.full_name || 'N/A' }}</td>
                          <td>{{ user.email }}</td>
                          <td>{{ user.department || 'N/A' }}</td>
                          <td>
                            <v-chip
                              :color="user.status === 'active' ? 'success' : 'error'"
                              @click="
                                updateUserStatus(
                                  user.id,
                                  user.status === 'active' ? 'inactive' : 'active',
                                )
                              "
                            >
                              {{ user.status }}
                            </v-chip>
                          </td>
                          <td>
                            <v-btn
                              icon
                              variant="text"
                              color="primary"
                              @click="viewUserDetails(user.id)"
                            >
                              <v-icon>mdi-eye</v-icon>
                            </v-btn>
                          </td>
                        </tr>
                      </tbody>
                    </v-table>
                  </v-card-text>
                </v-window-item>
              </v-window>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <AppFooter />
  </v-app>
</template>

<style scoped>
.v-card {
  border-radius: 8px;
}

.v-table {
  border-radius: 8px;
}

.v-btn {
  text-transform: none;
  letter-spacing: normal;
}

.v-chip {
  cursor: pointer;
}
</style>
