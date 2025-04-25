import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
  }),

  actions: {
    async logout() {
      // Clear user data
      this.user = null
      this.token = null

      // Remove token from localStorage
      localStorage.removeItem('token')
    },
  },
})
