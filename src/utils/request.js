import axios from 'axios'
import { Message } from 'element-ui';
import store from "@/store"
import { getTimestamp } from './auth';
const Timeout = 3600 // 定义超时时间
import router from '@/router'

const service = axios.create({
  // 当执行 npm run dev  => .env.development => /api 跨域代理
  baseURL: process.env.VUE_APP_BASE_API,  //  /api
  timeout:5000   // 设置超时时间
})

// 1. 请求拦截器
service.interceptors.request.use((config) => {
  // 在这个位置需要统一的去注入 token
  if (store.getters.token) {
    // 只有在有token的情况下 才有必要去检查时间戳是否超时
    if (checkTimeout()) {
      store.dispatch("user/logoutAction")
      // 如果它为true表示 过期了
      // token没用了 因为超时了
      router.push('/login')   // 跳到主页
      return Promise.reject(new Error('token 超时了'))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`  // 中间有空格
  }
  return config   // 必须要 return
}, (err) => {
  return Promise.reject(err)
})

// 2. 响应拦截器
service.interceptors.response.use((res) => {
  // axios 默认加了一层 data
  const { success, message, data } = res.data
  if (success) {
    return data
  } else {
    // 返回的数据中 success 已经 false了 , 应该进 catch
    Message.error(message) // 提示错误信息
    return Promise.reject(new Error(message))
  }
}, (err) => {
   // error 信息 里面 response的对象
  if (err.response && err.response.data && err.response.data.code === 10002) {
    // 当等于10002的时候 表示 后端告诉我token超时了
    store.dispatch('user/logoutAction') // 登出 action 删除 token
    router.push('/login')
  } else {
    Message.error(err.message)  // 提示错误信息
  }
  return Promise.reject(err) // 返回执行错误 让当前的执行链跳出成功 直接进入 catch
})

// 是否超时
// 超时逻辑  (当前时间  - 缓存中的时间) 是否大于 定义好的时间差
function checkTimeout() {
  const currentTime = Date.now()
  const timestamp = getTimestamp()
  return (currentTime - timestamp) / 1000 > Timeout
}

export default service


