import { createRouter, createWebHistory } from 'vue-router'
import { useAuthUserStore } from '@/stores/auth-user-store'

const Login = () => import('@/shared/views/login-view.vue')
const NotFound = () => import('@/shared/views/page-not-found-view.vue')
const Catalog = () => import('@/catalog/views/catalog-view.vue')
const Sale = () => import('@/sale/views/sale-view.vue')
const Quotation = () => import('@/sale/views/quotation-view.vue')
const BusinessEntity = () => import('@/sale/views/business-entity-view.vue')
const Contact = () => import('@/sale/views/contact-view.vue')
const User = () => import('@/profile/views/user-view.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/ventas',
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/catalogo',
    name: 'Catalog',
    component: Catalog,
    meta: { requiresAuth: true },
  },
  {
    path: '/ventas',
    name: 'Sale',
    component: Sale,
    meta: { requiresAuth: true },
  },
  {
    path: '/cotizaciones',
    name: 'Quotation',
    component: Quotation,
    meta: { requiresAuth: true },
  },
  {
    path: '/entidades',
    name: 'BusinessEntity',
    component: BusinessEntity,
    meta: { requiresAuth: true },
  },
  {
    path: '/contactos',
    name: 'Contact',
    component: Contact,
    meta: { requiresAuth: true },
  },
  {
    path: '/usuarios',
    name: 'User',
    component: User,
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const authUserStore = useAuthUserStore()

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!authUserStore.status.loggedIn) {
      next({
        name: 'Login',
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
