import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/utils/supabase'
import { useAuthStore } from './auth'

export const useSyllabiStore = defineStore('syllabi', () => {
  const syllabi = ref([])
  const authStore = useAuthStore()
  const loading = ref(false)
  const error = ref(null)

  // Reset states
  function $reset() {
    syllabi.value = []
  }

  // Retrieve from Supabase
  async function getSyllabi() {
    console.log('Fetching all syllabi...')

    try {
      const { data, error } = await supabase
        .from('syllabi')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase query error:', error)
        throw error
      }

      console.log('Supabase response:', {
        data,
        count: data?.length,
        firstItem: data?.[0],
      })

      syllabi.value = data || []
      console.log('Updated syllabi store:', {
        value: syllabi.value,
        length: syllabi.value.length,
      })
    } catch (err) {
      console.error('Error in getSyllabi:', err)
      syllabi.value = []
    }
  }

  // Insert syllabus
  async function insertSyllabus(syllabusData) {
    if (!authStore.user || !authStore.user.id) {
      console.error('User is not authenticated')
      return
    }

    const fullData = {
      ...syllabusData,
      user_id: authStore.user.id, // Still associate with the uploading user
    }

    const { error } = await supabase.from('syllabi').insert(fullData)

    if (error) {
      console.error('Insert failed:', error)
    } else {
      console.log('Syllabus inserted successfully')
      await getSyllabi() // <- fetch latest data
    }
  }

  return { syllabi, $reset, getSyllabi, insertSyllabus, loading, error }
})
