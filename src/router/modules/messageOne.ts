const Layout = () => import("@/views/Home.vue");

const messageOne = {
  path: "/messageOne",
  name: "messageOne",
  hidden: false,
  meta: {
    icon: "ant-design:cloud-upload-outlined",
    title: "短信发送",
    roles: ["DXFS"],
    isLogin:true    // 添加该字段，表示进入这个路由是需要登录的
  },
  component: Layout,
  redirect:  { name: 'onlineSend' },
  children: [
    {
      path: "/onlineSend",
      name: "onlineSend",
      hidden: false,
      meta: {
        title: "在线发送",
        roles: ["ZXFDX"]
      },
      component: () => import("@/views/messageOne/onlineSend.vue"),
    },
    {
      path: "/onlineSendNew",
      name: "onlineSendNew",
      hidden: false,
      meta: {
        title: "新在线发送",
        roles: ["ZXFDX"]
      },
      component: () => import("@/views/messageOne/onlineSendNew.vue"),
    },
    {
      path: "/sendQuery",
      name: "sendQuery",
      hidden: false,
      meta: {
        title: "发送查询",
        roles: ["DXFSCX"]
      },
      component: () => import("@/views/messageOne/sendQuery.vue"),
    },
    {
      path: "/suplinkQuery",
      name: "uplinkQuery",
      hidden: false,
      meta: {
        title: "上行查询",
        roles: ["SHSXDX"]
      },
      component: () => import("@/views/messageOne/uplinkQuery.vue"),
    }
  ],

};

export default messageOne;
