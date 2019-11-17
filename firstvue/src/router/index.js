import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  // @ 是系统给封装好的别名，代表src目录的"绝对路径名"信息
  // @：E:\Vue86-87\86\86everyday\02daypro\topline\src\
  { path: '/login', name: 'login', component: () => import('@/views/Login') },
  { path: '/home',
    name: 'home',
    component: () => import('@/views/Home'),
    redirect: '/welcome',
    children:
   [ { path: '/welcome', name: 'welcome', component: () => import('@/views/Home_son/welcome.vue') },
     { path: '/article', name: 'article_list', component: () => import('@/views/Home_son/article.vue') },
     { path: '/addarticle', name: 'ArticleAdd', component: () => import('@/views/Home_son/addarticle.vue') },
     { path: '/articleedit/:aid', name: 'ArticleEdit', component: () => import('@/views/Home_son/articleedit.vue') },
     { path: '/account', name: 'Account', component: () => import('@/views/Home_son/account.vue') },
     { path: '/material', name: 'Material', component: () => import('@/views/Home_son/material.vue') },
     { path: '/discuss', name: 'Discuss', component: () => import('@/views/Home_son/discuss.vue') }
   ] }
  // { path: '/', name: 'home', component: () => import('@/views/Login') }
]
const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  // 用户如果是"非登录"状态，并且其还要访问 非登录 页面，那么就强制登录去
  var userinfo = window.sessionStorage.getItem('userinfo')
  if (!userinfo && to.path !== '/login') {
    // 路由导航到登录页面
    return next('/login') // ok
  }
  next()
})

export default router
