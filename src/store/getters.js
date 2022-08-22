const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  name: state => state.user.userInfo.username,  // 建立用户名称给的映射
  userId: state => state.user.userInfo.userId,
  staffPhoto: state => state.user.userInfo.staffPhoto, // 用户头像的映射
  companyId: state => state.user.userInfo.companyId,
  routes: state => state.permission.routes // 导出当前的路由
}

export default getters
