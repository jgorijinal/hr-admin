import Cookies from 'js-cookie'

const TokenKey = 'vue-admin-token'   // 设定独一无二的 key
const TimestampKey = 'vue-admin-timestamp'

export function getToken() {
  return Cookies.get(TokenKey)
}
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 设置时间戳
export function setTimestamp() {
  Cookies.set(TimestampKey , Date.now())
}

// 获取时间戳
export function getTimestamp() {
  Cookies.get(TimestampKey)
}
