import { createRouter, createWebHistory } from "vue-router";
import userCenter from "./modules/userCenter";
import messageOne from "./modules/messageOne";
import businessStatistics from "./modules/businessStatistics";
const Layout = () => import("@/views/Home.vue");

function resetPermission(routes: any[], parents:any) {
  routes.forEach(route => {
    if (route.children && route.children.length) {
      resetPermission(route.children, route);
    }
  });
  if (
    routes.every(item => item.meta && item.meta.roles && item.meta.roles.length)
  ) {
    if (!parents.meta) parents.meta = {};
    parents.meta.roles = [].concat(...routes.map(item => item.meta.roles));
  }
  return;
}
export const constantRouterMap: Array<any> = [
  {
    path: "/login",
    name: "Login",
    hidden: true,
    component: () => import("@/views/login/Login.vue"),
  }
];

export const asyncRouterMap: Array<any> = [
  userCenter,
  messageOne,
  businessStatistics,
  {
    path: "/",
    redirect: "",
    hidden: true
  },
  {
    path: "/:path(.*)*",
    name: "ErrPage",
    hidden: true,
    component: () => import("@/views/errPages/404.vue"),
  }
];
asyncRouterMap.forEach(item => {
  if (item.children && item.children.length) {
    resetPermission(item.children, item);
  }
});

const routes: Array<any> = [
  {
    path: "/login",
    name: "Login",
    hidden: true,
    component: () => import("@/views/login/Login.vue"),
  },
  userCenter,
  messageOne,
  businessStatistics
];
const router = createRouter({
  history: createWebHistory(),
  // routes
  routes: constantRouterMap
});

export default router;