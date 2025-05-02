import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import DashboardView from '@/views/system/DashboardView.vue'
import SyllabiView from '@/views/system/SyllabiView.vue'
import UploadSyllabusView from '@/views/system/UploadSyllabusView.vue'
import ThesesView from '@/views/system/ThesesView.vue'
import { isAuthenticated } from '@/utils/supabase'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { requiresAuth: false },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true },
    },
    {
      path: '/theses',
      name: 'theses',
      component: () => import('@/views/system/ThesesView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/theses/upload',
      name: 'upload-thesis',
      component: () => import('@/views/system/UploadThesisView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/syllabi',
      name: 'syllabi',
      component: SyllabiView,
      meta: { requiresAuth: true },
    },
    {
      path: '/upload-syllabus',
      name: 'upload-syllabus',
      component: UploadSyllabusView,
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/system/ProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/system/SettingsView.vue'),
      meta: { requiresAuth: true },
    },
    // Catch-all 404 route
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/errors/NotFoundView.vue'),
      meta: { requiresAuth: true }, // Set to false if you want guests to see 404 too
    },
  ],
})

router.beforeEach(async (to) => {
  const isLoggedIn = await isAuthenticated()

  if (to.name === 'home') {
    return isLoggedIn ? { name: 'dashboard' } : { name: 'login' }
  }

  if (isLoggedIn && to.meta.requiresAuth === false) {
    return { name: 'dashboard' }
  }

  if (isLoggedIn && (to.name === 'login' || to.name === 'register')) {
    return { name: 'dashboard' }
  }

  if (!isLoggedIn && to.meta.requiresAuth) {
    return { name: 'login' }
  }
})

export default router
