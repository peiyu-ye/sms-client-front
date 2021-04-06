const Layout = () => import("@/views/Home.vue");

const messageOne = {
  path: "/businessStatistics",
  name: "businessStatistics",
  hidden: false,
  meta: {
    icon: "ant-design:bar-chart-outlined",
    title: "业务统计",
    roles: ["YWTJ"],
    // isLogin:true    // 添加该字段，表示进入这个路由是需要登录的
  },
  component: Layout,
  redirect: "/sendstatistical",
  children: [
    {
      path: "/sendstatistical",
      name: "sendStatistical",
      hidden: false,
      meta: {
        title: "发送量统计",
        roles: ["GRFSLTJ"]
      },
      component: () => import("@/views/businessStatistics/sendStatistical.vue"),
    },
    { // 测试
      path: "/dashboard",
      name: "dashboard",
      hidden: false,
      meta: {
        title: "fffff",
      },
      component: () => import("@/views/dashboard/index.vue"),
    }
  ]
};

export default messageOne;
