import Layout from "@/layout";
// 每个子模块 其实 都是外层是layout  组件位于 layout 的二级路由里面
export default {
  path: "/employees",
  name: "employees", // 这个 name 属性后面做权限时候会用到
  component: Layout,
  children: [
    {
      path: "", // 这里当二级路由的path什么都不写的时候 表示该路由为当前二级路由的默认路
      component: () => import("@/views/employees/index.vue"),
      meta: {
        title: "员工管理",
        icon: "people",
        // meta属性的里面的属性 随意定义 但是这里为什么要用title呢? ，
        // 因为左侧导航会读取路由里的 meta 里面的 title 作为显示菜单名称
      },
    },
    {
      path: "detail/:id",
      component: () => import("@/views/employees/detail.vue"),
      hidden: true,
      meta: {
        title: "员工详情",
      },
    },
    {
      path: "print/:id",
      component: () => import("@/views/employees/print.vue"),
      hidden: true,
      meta: {
        title: '打印',  // 标记当前路由规则的中文名称 后续在做左侧菜单时 使用
        icon:'people'
      }
    }
  ],
};

// 当访问地址 是 /employees 的时候 layout组件会显示 此时 你的二级路由的默认组件  也会显示
