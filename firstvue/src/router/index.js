import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  // @ 是系统给封装好的别名，代表src目录的"绝对路径名"信息
  // @：E:\Vue86-87\86\86everyday\02daypro\topline\src\
  { path: '/login', name: 'login', component: () => import('@/views/Login') },
  { path: '/home', name: 'home', component: () => import('@/views/Home') },
  // { path: '/', name: 'home', component: () => import('@/views/Login') }
]

const router = new VueRouter({
  routes
})

export default router
