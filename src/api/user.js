// import request from '@/utils/request'

// export function login(data) {
//   return request({
//     url: '/vue-admin-template/user/login',
//     method: 'post',
//     data
//   })
// }

// export function getInfo(token) {
//   return request({
//     url: '/vue-admin-template/user/info',
//     method: 'get',
//     params: { token }
//   })
// }

// export function logout() {
//   return request({
//     url: '/vue-admin-template/user/logout',
//     method: 'post'
//   })
// }

import request from "@/utils/request"

// 登录接口
export function login(data) {
  // 返回 Promise 对象
  return request({
    url: "/sys/login",
    method: "post",
    data:data
  })
}

// 获取用户基本资料接口
export function getUserInfo(){
  return request({
    url: "/sys/profile",
    method:"post"
  })
}

// 获取用户详情资料( 为了获取头像 )接口
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`
    // method 默认为 get , 所以不用写
  })
}





