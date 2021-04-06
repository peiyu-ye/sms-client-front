import { createStore } from "vuex";
import app from "./modules/app.js";
import permission from "./modules/permission";
import user from "./modules/user";

export default createStore({

  modules: {
    permission,
    app,
    user
  },
  getters: {
    permission_routes: (state: any) => state.permission.routes,
    roles: (state: any) => state.user.roles,
    worker: (state: any) => state.user.worker,
  }
});
