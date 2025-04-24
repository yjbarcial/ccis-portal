import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import DashboardView from '@/views/system/DashboardView.vue'
import SyllabiView from '@/views/system/SyllabiView.vue'
import UploadSyllabusView from '@/views/system/UploadSyllabusView.vue'
import ThesisView from '@/views/system/ThesesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/theses',
      name: 'theses',
      component: ThesesView,
    },
    {
      path: '/syllabi',
      name: 'syllabi',
      component: SyllabiView,
    },
    {
      path: '/upload-syllabus',
      name: 'upload-syllabus',
      component: UploadSyllabusView,
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
  ],
})

export default router
