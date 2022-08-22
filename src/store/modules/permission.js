// vuex的权限模块
import { constantRoutes , asyncRoutes } from '@/router'
// vuex中的permission模块用来存放当前的 静态路由 + 当前用户的 权限路由
const state = {
  routes:constantRoutes
}
const mutations = {
   // newRoutes 可以认为是 用户登录 通过权限所得到的动态路由的部分
  setRoutes(state, newRoutes) {
    // 下面代码是不对的， 不是语法不对 是业务不对
    //  应该是每次更新 都应该在静态路由的基础上进行追加
    //  state.routes = [...state.routes, ...newRoutes]
    state.routes = [...constantRoutes, ...newRoutes]
  }
}

const actions = {
  // 筛选路由
  filterRoutes(context, menus) {   // 调用时通过 payload 传 userInfo 里面的用户的  menus
    const routes = []
    menus.forEach(menu => {
       // asyncRoutes动态路由 找 有没有对象中的name属性等于 menu字符串的 如果找不到就没权限 如果找到了 要筛选出来
      routes.push(...asyncRoutes.filter(route => route.name === menu))
      // 这里注意!!!: filter 会返回一个新的数组, 这里会得到 空数组 或者 长度为 1 的数组 , 所以 ... 展开
    })
    context.commit("setRoutes", routes)

    return routes // 这里为什么还要return  state数据 是用来 显示左侧菜单用的  return  是给路由addRoutes用的
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
