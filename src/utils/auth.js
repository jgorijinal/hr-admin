import Cookies from 'js-cookie'

const TokenKey = 'vue-admin-token'   // 设定独一无二的 key

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
