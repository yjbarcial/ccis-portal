import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import DashboardView from '@/views/system/DashboardView.vue'
import SyllabiView from '@/views/system/SyllabiView.vue'
import UploadSyllabusView from '@/views/system/UploadSyllabusView.vue'
import ThesesView from '@/views/system/ThesesView.vue'
import { isAuthenticated } from '@/utils/supabase'
import AdminView from '@/views/admin/AdminView.vue'
import { supabase } from '@/utils/supabase'
import ForgotPasswordView from '@/views/auth/ForgotPasswordView.vue'
import ResetPasswordView from '@/views/auth/ResetPasswordView.vue'
import { ADMIN_EMAILS } from '@/utils/constants'

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
      path: '/admin',
      name: 'admin',
      component: AdminView,
      meta: {
        requiresAuth: true,
        requiresAdmin: true,
      },
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
      meta: {
        requiresAuth: true,
        requiresAdmin: true,
      },
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
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPasswordView,
      meta: { requiresAuth: false },
    },
    {
      path: '/Reset-password',
      name: 'Reset-password',
      component: ResetPasswordView,
      meta: { requiresAuth: false },
    },
    // Catch-all 404 route
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/errors/NotFoundView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin)

  if (requiresAuth) {
    const isLoggedIn = await isAuthenticated()
    if (!isLoggedIn) {
      next({ name: 'login' })
      return
    }

    if (requiresAdmin) {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user || !ADMIN_EMAILS.includes(user.email)) {
        next({ name: 'theses' })
        return
      }
    }
  }

  next()
})

export default router
