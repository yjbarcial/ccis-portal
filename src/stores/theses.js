import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/utils/supabase'

export const useThesesStore = defineStore('theses', () => {
  const theses = ref([])
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
      console.log('Making Supabase query...')
      const { data, error } = await supabase
        .from('theses')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase query error:', error)
        throw error
      }

      console.log('Raw Supabase response:', {
        data,
        count: data?.length,
        firstItem: data?.[0],
        query: `SELECT * FROM theses ORDER BY created_at DESC`,
      })

      if (!data || data.length === 0) {
        console.log('No data returned from Supabase')
      }

      theses.value = data || []
      console.log('Updated theses store:', {
        value: theses.value,
        length: theses.value.length,
        firstItem: theses.value[0],
      })
    } catch (err) {
      console.error('Error in getTheses:', err)
      theses.value = []
    }
  }

  return { theses, $reset, getTheses, loading, error }
})
