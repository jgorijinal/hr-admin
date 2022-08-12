// import router from './router'
// import store from './store'
// import { Message } from 'element-ui'
// import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'

// NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = ['/login'] // no redirect whitelist

// router.beforeEach(async(to, from, next) => {
//   // start progress bar
//   NProgress.start()

//   // set page title
//   document.title = getPageTitle(to.meta.title)

//   // determine whether the user has logged in
//   const hasToken = getToken()

//   if (hasToken) {
//     if (to.path === '/login') {
//       // if is logged in, redirect to the home page
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       const hasGetUserInfo = store.getters.name
//       if (hasGetUserInfo) {
//         next()
//       } else {
//         try {
//           // get user info
//           await store.dispatch('user/getInfo')

//           next()
//         } catch (error) {
//           // remove token and go to login page to re-login
//           await store.dispatch('user/resetToken')
//           Message.error(error || 'Has Error')
//           next(`/login?redirect=${to.path}`)
//           NProgress.done()
//         }
//       }
//     }
//   } else {
//     /* has no token*/

//     if (whiteList.indexOf(to.path) !== -1) {
//       // in the free login whitelist, go directly
//       next()
//     } else {
//       // other pages that do not have permission to access are redirected to the login page.
//       next(`/login?redirect=${to.path}`)
//       NProgress.done()
//     }
//   }
// })

// router.afterEach(() => {
//   // finish progress bar
//   NProgress.done()
// })

// 路由守卫 前置守卫 后置守卫
// next()   直接放行
// next(false)  禁止跳转
// next(地址)  跳转到某个地址
import router from "@/router" // 引入 router 实例
import store from "@/store"  // 引入 vuex store实例 , 相当于 this.$store

import nProgress from 'nprogress'  // 引入进度条
import 'nprogress/nprogress.css'   // 引入进度条样式

const whiteList = ["/login", "/404"]

router.beforeEach((to, from, next) => {    // 前置守卫
  nProgress.start()                        // 开启进度条
  if (store.getters.token) {               // 如果有 token
    if (to.path === "/login") {            // 如果去登录页 , 就直接跳到主页
      next("/")
    } else {
      next()                                // 否则直接放行
    }
  } else {
    // 没有 token                             // 如果没有 token
    if (whiteList.indexOf(to.path) > -1) {    // 如果去白名单里
      next()                                  // 直接放行
    } else {
      next("/login")                        // 不是其白名单 , 就直接跳到登录页
    }
  }
  nProgress.done()                // 手动强制关闭一次  为了解决 手动切换地址时  进度条的不关闭的问题
})

router.afterEach(() => {         // 后置守卫
  nProgress.done()               // 关闭进度条
})
