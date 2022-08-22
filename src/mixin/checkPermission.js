import store from "@/store"

export default {
  methods: {
    checkPermission(key) {
      const { roles } = store.state.user.userInfo
      const points = roles.points
      if (points && points.length > 0) {
        return points.some(item => item === key)
      }
      return false
    }
  }
}


