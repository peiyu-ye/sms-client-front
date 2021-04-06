import { asyncRouterMap, constantRouterMap } from "@/router";

/**
 * 确定当前用户是否具有权限
 * @param roles
 * @param route
 */
function hasPermission(roles: any[], route: { meta: { roles: string | any[]; }; }) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role));  // 满足一个条件则不在检索返回true,不满足返回false
  } else {
    return true;
  }
}

/**
 * 通过递归过滤异步路由表
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes: any[], roles: string[]) {
  const res: any[] = [];
  routes.forEach(route => {
    const tmp = { ...route };
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles);
      }
      res.push(tmp);
    }
  });
  return res;
}

function resetRedirect(routes: any[], parentPath = "") {
  routes.forEach(route => {
    if (route.children && route.children.length) {
        route.redirect = `${
          route.children.filter((item: any) => !item.hidden)[0].path
        }`;
      resetRedirect(route.children, `${parentPath}${route.path}/`);
    }
  });
  return;
}

const state = {
  routes: []
};

const mutations = {
  SET_ROUTES: (state: { routes: any[]; }, routes: any) => {
    state.routes = constantRouterMap.concat(routes);
  }
};

const actions = {
  generateRoutes({ commit }:any, roles: string[]) {
    return new Promise(resolve => {
      const accessedRoutes = filterAsyncRoutes(asyncRouterMap, roles);
      // 登录重定向
      if (accessedRoutes.length > 3)
        accessedRoutes[accessedRoutes.length - 2].redirect =
          accessedRoutes[2].path;
      else if (accessedRoutes.length > 2)
        accessedRoutes[accessedRoutes.length - 2].redirect =
          accessedRoutes[0].path;
      else {
        sessionStorage.token = "";
        location.reload();
      }
      resetRedirect(accessedRoutes);
      commit("SET_ROUTES", accessedRoutes);
      resolve(accessedRoutes);
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
