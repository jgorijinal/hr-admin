// import { login, logout, getInfo } from '@/api/user'
// import { getToken, setToken, removeToken } from '@/utils/auth'
// import { resetRouter } from '@/router'

// const getDefaultState = () => {
//   return {
//     token: getToken(),
//     name: '',
//     avatar: ''
//   }
// }

// const state = getDefaultState()

// const mutations = {
//   RESET_STATE: (state) => {
//     Object.assign(state, getDefaultState())
//   },
//   SET_TOKEN: (state, token) => {
//     state.token = token
//   },
//   SET_NAME: (state, name) => {
//     state.name = name
//   },
//   SET_AVATAR: (state, avatar) => {
//     state.avatar = avatar
//   }
// }

// const actions = {
//   // user login
//   login({ commit }, userInfo) {
//     const { username, password } = userInfo
//     return new Promise((resolve, reject) => {
//       login({ username: username.trim(), password: password }).then(response => {
//         const { data } = response
//         commit('SET_TOKEN', data.token)
//         setToken(data.token)
//         resolve()
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // get user info
//   getInfo({ commit, state }) {
//     return new Promise((resolve, reject) => {
//       getInfo(state.token).then(response => {
//         const { data } = response

//         if (!data) {
//           return reject('Verification failed, please Login again.')
//         }

//         const { name, avatar } = data

//         commit('SET_NAME', name)
//         commit('SET_AVATAR', avatar)
//         resolve(data)
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // user logout
//   logout({ commit, state }) {
//     return new Promise((resolve, reject) => {
//       logout(state.token).then(() => {
//         removeToken() // must remove  token  first
//         resetRouter()
//         commit('RESET_STATE')
//         resolve()
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // remove token
//   resetToken({ commit }) {
//     return new Promise(resolve => {
//       removeToken() // must remove  token  first
//       commit('RESET_STATE')
//       resolve()
//     })
//   }
// }

import { login , getUserInfo , getUserDetailById} from "@/api/user";
import { getToken, removeToken, setToken ,setTimestamp} from "@/utils/auth";
// 状态
// 初始化的时候从缓存中读取状态 并赋值到初始化的状态上
// Vuex 的持久化 如何实现 ？ Vuex 和前端缓存相结合
const state = {
  token: getToken(), // 设置token为贡献该状态 ,初始化 Vuex 的时候, 先从缓存中获取
  userInfo:{}   // 定义一个空的对象 不是 null 因为开发 userInfo 的属性给别人用  userInfo.name
};

const mutations = {
  changeToken(state, token) {
    // 改变 state中的 token
    state.token = token;
    // 再同步给缓存
    setToken(token);
  },
  removeToken(state) {
    // 置空 state 中的 token
    state.token = null;
    // 再同步删除缓存
    removeToken();
  },
  // 设置用户信息
  changeUserInfo(state, userInfo) {
    state.userInfo = userInfo
  },
  //删除用户信息
  removeUserInfo(state) {
    state.userInfo = {};
  }
};

const actions = {
  async loginAction(context, data) {
    const result = await login(data);
    context.commit("changeToken", result);

    // 写入时间戳
    setTimestamp() // 将当前的最新时间写入缓存
  },

  async getUserInfoAction(context) {
    const result = await getUserInfo()       // 用户的基本交资料
    const userDetail = await getUserDetailById(result.userId) // 用户详情资料(为了获取头像)
    const baseResult = {...result , ...userDetail}   // 将两个接口结果合并
    context.commit("changeUserInfo", baseResult)   // 提交 mutation 更改 state 数据

    return result         // 这里为什么艺return ??  这里后期做权限的时候埋下伏笔
  },

  logoutAction(context) {
    context.commit("removeToken")     // 删除 token
    context.commit("removeUserInfo")  // 删除 用户资料
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
