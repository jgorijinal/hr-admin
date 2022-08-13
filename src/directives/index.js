export const imageError = {
  inserted(el , binding) {
    el.error = function () {
      console.log("出错了")
      // 这里的 ele 就是 img 标签
      // 当图片出现异常的时候 会将指令配置的默认图片设置为该图片的内容
      // el可以注册 error事件
      el.src = binding.value
    }
  }
}
