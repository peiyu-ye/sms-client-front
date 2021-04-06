import router from "./router";
import store from "./store";
import { message } from "ant-design-vue";
import { RouteRecordRaw } from 'vue-router';

const whiteList = ["/login"]
router.beforeEach(async (to, from, next) => {
  // console.log("****s:  ",to,from);
  const token:any = sessionStorage.getItem('token')
  if (token) {
    if (to.path === "/login") {
      // 如果已登录，则重定向到主页
      next({ path: "/sendStatistical"});
    } else {
      // 确认用户是否通过getInfo获得了他的权限角色
      const hasRoles = store.getters.roles && store.getters.roles.length > 0;
      if (hasRoles) {
        if (to.matched.length === 0) {
          next({ path: from.path });
          message.error({
            content: "对不起，您无权限访问页面！"
          });
        } else {
          next();
        }
      } else {
        try {
          // get user info
          // note: 角色必须是一个对象数组!例如:['admin']或['developer'，'editor']
          const menus = await store.dispatch("user/getInfo");
          // 生成可访问的路线图基于菜单
          const accessRoutes:any = await store.dispatch("permission/generateRoutes",menus);
          // 动态添加可访问路由; Vue 3.0 中，需要使用 router.addRoute() 单个添加记录
          await accessRoutes.map((e:any) => {
            if(e.children&&e.children.length>0){
              router.addRoute({
                path: e.path,
                name: e.name,
                component: e.component,
                children: e.children,
                meta: e.meta
              })
            }else{
              router.addRoute({
                path: e.path,
                name: e.name,
                component: e.component,
                meta: e.meta
              })
            }
          });
          next({ ...to, replace: true });
        } catch (error) {
          console.log("error: ", error)
          message.error({
            content: "访问错误！"
          });
          // setTimeout(() => {
          //   store.dispatch("user/toLogin");
          // }, 1000);
        }
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      // in the free login whitelist, go directly
      next();
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login`);
    }
  }
});
router.afterEach((to, from) => {})