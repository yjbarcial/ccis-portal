import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import App from './App.vue'
import router from './router'

// Stores
import { useAuthStore } from '@/stores/auth'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)

const vuetify = createVuetify({
  components,
  icons: {
    defaultSet: 'mdi',
  },
  directives,
})

app.use(router)
app.use(vuetify)

const authStore = useAuthStore()

// Wait for user data to be fetched before mounting
;(async () => {
  await authStore.fetchUser()
  console.log('User on app load:', authStore.user)

  app.mount('#app')
})()
