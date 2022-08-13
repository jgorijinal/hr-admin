import Layout from '@/layout';
// 每个子模块 其实 都是外层是layout  组件位于 layout 的二级路由里面
export default {
  path: "/departments",
  name: 'departments',  // 这个 name 属性后面做权限时候会用到
  component: Layout,
  children: [{
    path: '',  // 这里当二级路由的path什么都不写的时候 表示该路由为当前二级路由的默认路
    component: () => import('@/views/departments/index.vue'),
    meta: {
      title: "组织架构",
      icon:"tree"
      // meta属性的里面的属性 随意定义 但是这里为什么要用title呢? ，
      // 因为左侧导航会读取路由里的 meta 里面的 title 作为显示菜单名称
    }
  }]
}
