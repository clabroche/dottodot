import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home.vue'

Vue.use(Router)

export default new Router({
  mode: process.env.CORDOVA_PLATFORM ? 'hash' : 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    }, {
      path: '/draws/:id',
      name: 'draw',
      component: () => import(/* webpackChunkName: "about" */ '@/components/Draw.vue')
    }, {
      path: '/draws/:id/edit',
      name: 'draw-edit',
      props: {edit: true},
      component: () => import(/* webpackChunkName: "about" */ '@/components/Draw.vue')
    }
  ]
})
