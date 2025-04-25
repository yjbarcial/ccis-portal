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
      meta:{requiresAuth: false}
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta:{requiresAuth: false}
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta:{requiresAuth: true}
    },
    {
      path: '/theses',
      name: 'theses',
      component: ThesesView,
      meta:{requiresAuth: true}
    },
    {
      path: '/syllabi',
      name: 'syllabi',
      component: SyllabiView,
      meta:{requiresAuth: true}
    },
    {
      path: '/upload-syllabus',
      name: 'upload-syllabus',
      component: UploadSyllabusView,
      meta:{requiresAuth: true}
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
      
    } 
  ],
})

router.beforeEach(async(to)=>{
  const isLoggedIn = await isAuthenticated()

  //Redirect to appropriate page if accessing home route
  if (to.name ==='home'){
    return isLoggedIn ? {name:'dashboard'} : {name: 'login'}
  }

  //if logged in, prevent access to login or register pages
  if(isLoggedIn && to.meta.requiresAuth == false) {
    // redirect the user to the dashboard page
    return {name: 'dashboard'}
  }

  //Check  if the user is logged in
  if(isLoggedIn && (to.name === 'login' || to.name === 'register')) {
    // redirect the user to the dashboard page
    return {name: 'dashboard'}
  }

  //if not logged in and going to the system pages
  if (!isLoggedIn && to.meta.requiresAuth){
    //redirect the user to the login page
    return {name:'login'}
  }


  
})

export default router
