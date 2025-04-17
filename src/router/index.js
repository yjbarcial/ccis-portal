import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import DashboardView from '@/views/system/DashboardView.vue'
import ThesisView from '@/views/system/ThesisView.vue'
import SyllabiView from '@/views/system/SyllabiView.vue'
import UploadSyllabusView from '@/views/system/UploadSyllabusView.vue'
import ProfileView from '@/views/system/ProfileView.vue'

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
      path: '/thesis',
      name: 'thesis',
      component: ThesisView,
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
  ],
})

export default router
