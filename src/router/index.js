import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('../views/LandingView.vue') },
    { path: '/shop', component: () => import('../views/CatalogView.vue') },
    { path: '/product/:id', component: () => import('../views/ProductView.vue') },
    { path: '/cart', component: () => import('../views/CartView.vue') },
    { path: '/favorites', component: () => import('../views/FavoritesView.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

export default router
