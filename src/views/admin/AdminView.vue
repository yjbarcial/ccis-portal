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
  pendingUploads: 0,
  recentUploads: [],
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

// Fetch statistics and user data
onMounted(async () => {
  try {
    // Fetch total users
    const { count: userCount } = await supabase
      .from('auth.users')
      .select('*', { count: 'exact', head: true })
    statistics.value.totalUsers = userCount || 0

    // Fetch active users (logged in within last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const { count: activeUserCount } = await supabase
      .from('auth.users')
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
        user:user_id (
          email,
          user_metadata
        )
      `,
      )
      .order('created_at', { ascending: false })
      .limit(5)
    statistics.value.recentUploads = recentUploads || []

    // Fetch users
    const { data: usersData } = await supabase
      .from('auth.users')
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
        user.user_metadata?.full_name?.toLowerCase().includes(search.value.toLowerCase())

      const matchesStatus =
        statusFilter.value === 'all' ||
        (statusFilter.value === 'active' && user.status === 'active') ||
        (statusFilter.value === 'inactive' && user.status !== 'active')

      const matchesDepartment =
        departmentFilter.value === 'all' ||
        user.user_metadata?.department === departmentFilter.value

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
        return (a.user_metadata?.full_name || '').localeCompare(b.user_metadata?.full_name || '')
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
      .from('auth.users')
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

    // Fetch recent uploads
    const { data: recentUploads } = await supabase
      .from('theses')
      .select(
        `
        *,
        user:user_id (
          email,
          user_metadata
        )
      `,
      )
      .order('created_at', { ascending: false })
      .limit(5)
    statistics.value.recentUploads = recentUploads || []
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

        <!-- Stats Cards -->
        <v-row>
          <v-col cols="12" sm="6" md="3">
            <v-card class="pa-4" color="primary" dark>
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
            <v-card class="pa-4" color="success" dark>
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
            <v-card class="pa-4" color="info" dark>
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
            <v-card class="pa-4" color="warning" dark>
              <div class="d-flex align-center">
                <v-icon size="36" class="mr-3">mdi-clock-outline</v-icon>
                <div>
                  <div class="text-h4 mb-2">{{ statistics.pendingUploads }}</div>
                  <div class="text-subtitle-1">Recent Uploads</div>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Admin Thesis Upload -->
        <v-row class="mt-6">
          <v-col cols="12">
            <v-card>
              <v-card-title class="d-flex align-center">
                <span>Upload Thesis</span>
              </v-card-title>
              <v-card-text>
                <v-form @submit.prevent="handleThesisUpload">
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="thesisForm.title"
                        label="Thesis Title"
                        variant="outlined"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-textarea
                        v-model="thesisForm.abstract"
                        label="Abstract"
                        variant="outlined"
                        required
                        rows="3"
                      ></v-textarea>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12" md="6">
                      <v-file-input
                        label="Abstract Image"
                        variant="outlined"
                        accept="image/jpeg,image/png"
                        @change="(e) => handleImageChange(e, 'abstract')"
                        prepend-icon="mdi-image"
                      ></v-file-input>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-file-input
                        label="Objectives Image"
                        variant="outlined"
                        accept="image/jpeg,image/png"
                        @change="(e) => handleImageChange(e, 'objectives')"
                        prepend-icon="mdi-image"
                      ></v-file-input>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="thesisForm.acadYear"
                        label="Academic Year"
                        :items="['2024-2025', '2023-2024']"
                        variant="outlined"
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="thesisForm.semester"
                        label="Semester"
                        :items="['1st Semester', '2nd Semester']"
                        variant="outlined"
                        required
                      ></v-select>
                    </v-col>
                  </v-row>

                  <v-alert v-if="uploadError" type="error" class="mb-4">
                    {{ uploadError }}
                  </v-alert>

                  <v-btn
                    color="primary"
                    type="submit"
                    :loading="isUploading"
                    :disabled="isUploading"
                  >
                    Upload Thesis
                  </v-btn>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- User Management -->
        <v-row class="mt-6">
          <v-col cols="12">
            <v-card>
              <v-card-title class="d-flex align-center">
                <span>User Management</span>
              </v-card-title>
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
                      :items="[
                        { title: 'All', value: 'all' },
                        { title: 'Active', value: 'active' },
                        { title: 'Inactive', value: 'inactive' },
                      ]"
                      variant="outlined"
                      density="comfortable"
                      hide-details
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-select
                      v-model="departmentFilter"
                      label="Department"
                      :items="[
                        { title: 'All Departments', value: 'all' },
                        ...departments.map((dept) => ({ title: dept, value: dept })),
                      ]"
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
                        { title: 'Name', value: 'user_metadata' },
                        { title: 'Email', value: 'email' },
                        { title: 'Created', value: 'created_at' },
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
                      <th>Created</th>
                      <th>Last Login</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="user in filteredUsers" :key="user.id">
                      <td>{{ user.user_metadata?.full_name || 'N/A' }}</td>
                      <td>{{ user.email }}</td>
                      <td>{{ user.user_metadata?.department || 'N/A' }}</td>
                      <td>
                        <v-chip
                          :color="user.status === 'active' ? 'success' : 'error'"
                          size="small"
                        >
                          {{ user.status || 'inactive' }}
                        </v-chip>
                      </td>
                      <td>{{ formatDate(user.created_at) }}</td>
                      <td>
                        {{ user.last_sign_in_at ? formatDate(user.last_sign_in_at) : 'Never' }}
                      </td>
                      <td>
                        <v-btn
                          size="small"
                          color="primary"
                          variant="text"
                          @click="viewUserDetails(user.id)"
                          prepend-icon="mdi-eye"
                        >
                          View
                        </v-btn>
                        <v-btn
                          size="small"
                          :color="user.status === 'active' ? 'error' : 'success'"
                          variant="text"
                          @click="
                            updateUserStatus(
                              user.id,
                              user.status === 'active' ? 'inactive' : 'active',
                            )
                          "
                          :prepend-icon="
                            user.status === 'active' ? 'mdi-account-off' : 'mdi-account-check'
                          "
                        >
                          {{ user.status === 'active' ? 'Deactivate' : 'Activate' }}
                        </v-btn>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-card-text>
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
  overflow: hidden;
}

.v-chip {
  font-weight: 500;
}
</style>
