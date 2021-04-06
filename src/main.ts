import { createApp } from "vue";
import App from "./App.vue";
import "./permission";  // 路由权限
import router from "./router";
import store from "./store";
import AntDesignVue from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
// import "default-passive-events"; //消除 vue中警告[Violation] Added non-passive event listener to a scroll-blocking event. 
import api from "./api/api";

import "./style/global.styl";
import "./style/index.styl";

const app = createApp(App);
app.config.globalProperties.$api = api;

app
  .use(store)
  .use(router)
  .use(AntDesignVue)
  .mount("#app");
