const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  name: state => state.user.userInfo.username,  // 建立用户名称给的映射
  userId: state => state.user.userInfo.userId,
  staffPhoto : state => state.user.userInfo.staffPhoto // 用户头像的映射
}
export default getters
