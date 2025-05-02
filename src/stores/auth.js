import { ref } from 'vue'
import { supabase } from '@/utils/supabase'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
  }),

  actions: {
    async fetchUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      this.user = user
    },
    async logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
    },
  },
})
