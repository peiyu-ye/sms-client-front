const Layout = () => import("@/views/Home.vue");

const userCenter = {
  path: "/userCenter",
  name: "usercenter",
  hidden: false,
  meta: {
    icon: "ant-design:user-outlined",
    title: "用户中心",
    roles: ["YHZX"],
    isLogin:true    // 添加该字段，表示进入这个路由是需要登录的
  },
  component: Layout,
  redirect:  { name: 'PersonalPage' },
  children: [
    {
      path: "/personal",
      name: "PersonalPage",
      hidden: false,
      meta: {
        title: "个人信息",
        roles: ["GRZL"]
      },
      component: () => import("@/views/user/userCenter.vue"),
    },
    {
      path: "/payrank",
      name: "payRankPage",
      hidden: false,
      meta: {
        title: "充值记录",
        roles: ["CZJL"]
      },
      component: () => import("@/views/user/payRank.vue"),
    },
    {
      path: "/changepassword",
      name: "changePasswordPage",
      hidden: true,
      meta: {
        title: "修改密码"
      },
      component: () => import("@/views/user/changePassword.vue"),
    },
    {
      path: "/account",
      name: "accountPage",
      hidden: true,
      meta: {
        title: "账户管理"
      },
      component: () => import("@/views/user/account.vue"),
    }
  ],

};

export default userCenter;
