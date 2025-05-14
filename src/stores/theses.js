import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/utils/supabase'
import { useAuthStore } from './auth'

export const useThesesStore = defineStore('theses', () => {
  const theses = ref([])
  const authStore = useAuthStore()
  const loading = ref(false)
  const error = ref(null)

  // Reset states
  function $reset() {
    theses.value = []
  }

  // Retrieve from Supabase
  async function getTheses() {
    console.log('Fetching all theses...')

    try {
      const { data, error } = await supabase
        .from('theses')
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

      theses.value = data || []
      console.log('Updated theses store:', {
        value: theses.value,
        length: theses.value.length,
      })
    } catch (err) {
      console.error('Error in getTheses:', err)
      theses.value = []
    }
  }

  // Insert thesis
  async function insertThesis(thesisData) {
    if (!authStore.user || !authStore.user.id) {
      console.error('User is not authenticated')
      return
    }

    const fullData = {
      ...thesisData,
      user_id: authStore.user.id,
      created_at: new Date().toISOString(),
    }

    const { error } = await supabase.from('theses').insert(fullData)

    if (error) {
      console.error('Insert failed:', error)
      throw error
    } else {
      console.log('Thesis inserted successfully')
      await getTheses() // <- fetch latest data
    }
  }

  return { theses, $reset, getTheses, insertThesis, loading, error }
})
