<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'

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

const users = ref([])
const loading = ref(true)
const error = ref(null)
const search = ref('')
const statusFilter = ref('all')
const departmentFilter = ref('all')
const sortBy = ref('created_at')
const showResetDialog = ref(false)
const resetType = ref('')
const resetLoading = ref(false)

// Departments for filtering
const departments = ['Computer Science', 'Information Technology', 'Information Systems']

const activeTab = ref('thesis')

// Add new state for data management
const dataManagementTab = ref('theses') // 'theses' or 'syllabi'

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

// Add reset data function
const resetData = async (type) => {
  resetType.value = type
  showResetDialog.value = true
}

const confirmReset = async () => {
  resetLoading.value = true
  error.value = null

  try {
    if (resetType.value === 'theses') {
      // First, delete all records from the theses table
      const { error: deleteError } = await supabase.from('theses').delete().neq('id', 0)

      if (deleteError) throw deleteError

      // Then delete all files from storage
      const { data: thesesFiles, error: listError } = await supabase.storage.from('theses').list()

      if (listError) throw listError

      // Delete all files from storage
      if (thesesFiles && thesesFiles.length > 0) {
        const filePaths = thesesFiles.map((file) => file.name)
        const { error: deleteStorageError } = await supabase.storage
          .from('theses')
          .remove(filePaths)

        if (deleteStorageError) throw deleteStorageError
      }
    } else if (resetType.value === 'syllabi') {
      // First, delete all records from the syllabi table
      const { error: deleteError } = await supabase.from('syllabi').delete().neq('id', 0)

      if (deleteError) throw deleteError

      // Then delete all files from storage
      const { data: syllabiFiles, error: listError } = await supabase.storage.from('syllabi').list()

      if (listError) throw listError

      // Delete all files from storage
      if (syllabiFiles && syllabiFiles.length > 0) {
        const filePaths = syllabiFiles.map((file) => file.name)
        const { error: deleteStorageError } = await supabase.storage
          .from('syllabi')
          .remove(filePaths)

        if (deleteStorageError) throw deleteStorageError
      }
    }

    // Refresh statistics after reset
    await fetchStatistics()

    // Show success message
    error.value = null
    const successMessage = `${resetType.value === 'theses' ? 'Theses' : 'Syllabi'} data has been successfully reset.`
    // You might want to add a success alert component to show this message
  } catch (err) {
    console.error('Error resetting data:', err)
    error.value = `Failed to reset ${resetType.value} data: ${err.message}`
  } finally {
    resetLoading.value = false
    showResetDialog.value = false
    resetType.value = ''
  }
}
</script>

<template>
  <v-app>
    <AppHeader title="CCIS Portal" />

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
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="upload in statistics.recentUploads" :key="upload.id">
                              <td>{{ upload.title }}</td>
                              <td>{{ upload.profiles?.email }}</td>
                              <td>{{ formatDate(upload.created_at) }}</td>
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
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="syllabus in statistics.recentSyllabi" :key="syllabus.id">
                              <td>{{ syllabus.title }}</td>
                              <td>{{ syllabus.profiles?.email }}</td>
                              <td>{{ formatDate(syllabus.created_at) }}</td>
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
                <v-tab value="data">Data Management</v-tab>
              </v-tabs>

              <v-window v-model="activeTab">
                <!-- Thesis Management Tab -->
                <v-window-item value="thesis">
                  <v-card class="mb-4">
                    <v-card-title class="text-h6">
                      <v-icon class="mr-2" color="primary">mdi-clipboard-text</v-icon>
                      Thesis Management
                    </v-card-title>
                    <v-card-text>
                      <p class="text-body-1 mb-4">
                        Current total theses: <strong>{{ statistics.totalTheses }}</strong>
                      </p>
                      <v-alert type="warning" class="mb-4">
                        <strong>Warning:</strong> Resetting thesis data will permanently delete all
                        thesis records from the system. This action cannot be undone.
                      </v-alert>
                      <v-btn
                        color="error"
                        variant="outlined"
                        prepend-icon="mdi-delete"
                        @click="resetData('theses')"
                        block
                      >
                        Reset All Thesis Data
                      </v-btn>
                    </v-card-text>
                  </v-card>
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

                <!-- Data Management Tab -->
                <v-window-item value="data">
                  <v-card-text>
                    <v-tabs v-model="dataManagementTab" color="primary" class="mb-4">
                      <v-tab value="theses">Theses Data</v-tab>
                      <v-tab value="syllabi">Syllabi Data</v-tab>
                    </v-tabs>

                    <v-window v-model="dataManagementTab">
                      <!-- Theses Data Management -->
                      <v-window-item value="theses">
                        <v-card class="mb-4">
                          <v-card-title class="text-h6">
                            <v-icon class="mr-2" color="primary">mdi-file-document</v-icon>
                            Theses Data Management
                          </v-card-title>
                          <v-card-text>
                            <p class="text-body-1 mb-4">
                              Current total theses: <strong>{{ statistics.totalTheses }}</strong>
                            </p>
                            <v-alert type="warning" class="mb-4">
                              <strong>Warning:</strong> Resetting theses data will permanently
                              delete all thesis records from the system. This action cannot be
                              undone.
                            </v-alert>
                            <v-btn
                              color="error"
                              variant="outlined"
                              prepend-icon="mdi-delete"
                              @click="resetData('theses')"
                              block
                            >
                              Reset All Theses Data
                            </v-btn>
                          </v-card-text>
                        </v-card>
                      </v-window-item>

                      <!-- Syllabi Data Management -->
                      <v-window-item value="syllabi">
                        <v-card class="mb-4">
                          <v-card-title class="text-h6">
                            <v-icon class="mr-2" color="primary">mdi-book-open-page-variant</v-icon>
                            Syllabi Data Management
                          </v-card-title>
                          <v-card-text>
                            <p class="text-body-1 mb-4">
                              Current total syllabi: <strong>{{ statistics.totalSyllabi }}</strong>
                            </p>
                            <v-alert type="warning" class="mb-4">
                              <strong>Warning:</strong> Resetting syllabi data will permanently
                              delete all syllabi records from the system. This action cannot be
                              undone.
                            </v-alert>
                            <v-btn
                              color="error"
                              variant="outlined"
                              prepend-icon="mdi-delete"
                              @click="resetData('syllabi')"
                              block
                            >
                              Reset All Syllabi Data
                            </v-btn>
                          </v-card-text>
                        </v-card>
                      </v-window-item>
                    </v-window>
                  </v-card-text>
                </v-window-item>
              </v-window>
            </v-card>
          </v-col>
        </v-row>

        <!-- Reset Confirmation Dialog -->
        <v-dialog v-model="showResetDialog" max-width="500">
          <v-card>
            <v-card-title class="text-h5"> Confirm Reset </v-card-title>
            <v-card-text>
              <p class="mb-4">
                Are you sure you want to reset
                {{ resetType === 'theses' ? 'theses' : 'syllabi' }} data? This action cannot be
                undone.
              </p>
              <v-alert type="warning" class="mb-0">
                <strong>Warning:</strong> This will permanently delete all {{ resetType }} data from
                the system.
              </v-alert>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="grey-darken-1"
                variant="text"
                @click="showResetDialog = false"
                :disabled="resetLoading"
              >
                Cancel
              </v-btn>
              <v-btn
                color="error"
                variant="flat"
                @click="confirmReset"
                :loading="resetLoading"
                :disabled="resetLoading"
              >
                Confirm Reset
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>
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
