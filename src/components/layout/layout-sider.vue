<template>
  <div class="sider">
    <div :class="isCollapse ? 'logo1' : 'logo'">
      <h1 title="短信平台">短信平台</h1>
    </div>
    <a-layout-sider
      :theme="theme"
      :collapsed="isCollapse"
      :trigger="null"
      collapsible
    >
      <template v-for="item in permission_routes">
        <a-menu
          theme="dark"
          mode="inline"
          :key="item.name"
          v-if="!item.hidden"
          :inline-collapsed="isCollapse"
          :inline-indent="20"
          v-model:selectedKeys="selectedKeys"
          :openKeys="openKeys"
          @openChange="onOpenChange"
        >
          <a-menu-item v-if="!item.children" :key="item.name">
            <router-link :to="item.path">
              <span>
                <Icon
                  :icon="item.meta.icon"
                  color="#fff"
                  :size="20"
                  class="icon-class"
                />
              </span>
              <span>{{ item.meta.title }}</span>
            </router-link>
          </a-menu-item>
          <a-sub-menu v-else :key="item.name">
            <template v-slot:title>
              <span>
                <Icon
                  :icon="item.meta.icon"
                  color="#fff"
                  :size="20"
                  class="icon-class"
                />
              </span>
              <span>{{ item.meta.title }}</span>
            </template>
            <template v-for="subItem in item.children">
              <a-menu-item v-if="!subItem.hidden" :key="subItem.name">
                <router-link :to="subItem.path">
                  {{ subItem.meta.title }}
                </router-link>
              </a-menu-item>
            </template>
          </a-sub-menu>
        </a-menu>
      </template>
    </a-layout-sider>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"; // reactive, computed, onMounted, watch
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { mapGetters } from "vuex";
// 封装icon方法
import Icon from "@/components/Icon/index";
export default defineComponent({
  name: "lauout-sider",
  /** 父组件传过来的值 */
  props: {},
  /** 组件 */
  components: { Icon },
  computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters(["permission_routes"]),
    isCollapse() {
      const store = useStore();
      return store.state.app.isCollapse;
    }
  },
  data() {
    return {
      theme: "light",
      rootSubmenuKeys: [] as any[],
      routes: "" as any,
      selectedKeys: [] as any[],
      openKeys: [] as any[]
    };
  },
  watch: {},
  created() {
    // 获取当前的全部路由
    this.routes = this.permission_routes;
    // 获取当前地址栏对应的菜单情况
    const route = useRoute();
    // console.log("route", route);
    // 后面需要些个方法去掉需要隐藏的菜单栏。这里直接在组件判断了（后面需要改） v-if="!item.hidden"；
    this.selectedKeys.push(route.name);
    this.openKeys.push(route.matched[0].name);
    // 判断菜单栏个数(自动折叠侧边栏)
    if (this.routes.length > 0) {
      this.routes.forEach((e: any) => {
        !e.hidden && this.rootSubmenuKeys.push(e.name);
      });
    }
  },
  methods: {
    onOpenChange(openKeys: any) {
      const latestOpenKey = openKeys.find(
        (key: any) => this.openKeys.indexOf(key) === -1
      );
      // console.log(this.rootSubmenuKeys);
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.openKeys = openKeys;
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : [];
      }
    }
  }
  // setup() {
  //   interface DataType {
  //     permissionRoutes: any;
  //     theme: string;
  //     isCollapse: any;
  //     rootSubmenuKeys: any;
  //     routes: any;
  //     selectedKeys: any;
  //     openKeys: any;
  //   }
  //   const store = useStore();
  //   const routers = useRouter();
  //   const route = useRoute();

  //   const data: DataType = reactive({
  //     theme: "light",
  //     isCollapse: store.state.app.isCollapse,
  //     permissionRoutes: store.state.permission.routes,
  //     rootSubmenuKeys: [],
  //     routes: [],
  //     selectedKeys: [],
  //     openKeys: []
  //   });
  //   function onOpenChange(openKeys: any) {
  //     const latestOpenKey = openKeys.find(
  //       (key: any) => data.openKeys.indexOf(key) === -1
  //     );
  //     console.log(data.rootSubmenuKeys);
  //     if (data.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
  //       data.openKeys = openKeys;
  //     } else {
  //       data.openKeys = latestOpenKey ? [latestOpenKey] : [];
  //     }
  //   }
  //   /** 声明周期函数 */
  //   data.isCollapse = computed(() => store.state.app.isCollapse);
  //   onMounted(() => {
  //     // 获取当前的全部路由
  //     // console.log("routers.options", routers.options.routes);
  //     console.log("permissionRoutes: ",permission_routes);
  //     console.log("routers.options: ", routers.options);
  //     // data.routes = routers.options.routes[0].children;
  //     data.routes = routers.options.routes;
  //     // 获取当前地址栏对应的菜单情况
  //     console.log("data.routes: ", data.routes);
  //     console.log(route.name);
  //     // console.log("route", route.matched[0]);
  //     // 后面需要些个方法去掉需要隐藏的菜单栏。这里直接在组件判断了（后面需要改） v-if="!item.hidden"；
  //     data.selectedKeys.push(route.name);
  //     data.openKeys.push(route.matched[0].name);
  //     // 判断菜单栏个数(自动折叠侧边栏)
  //     if (data.routes.length > 0) {
  //       data.routes.forEach((e: any) => {
  //         !e.hidden && data.rootSubmenuKeys.push(e.name);
  //       });
  //     }
  //   });
  //   /** 返回值 */
  //   return {
  //     data,
  //     onOpenChange
  //   };
  // }
});
</script>

<style lang="stylus" scoped>
body {
  margin: 0;
}

.sider {
  background-color: #011529;
}

.logo {
  height: 32px;
  // background: rgba(255, 255, 255, 0.2);
  margin: 16px;

  h1 {
    color: #fff;
    text-align: center;
    font-family: cursive;
  }
}
.logo1 {
  height: 32px;
  margin: 16px;
  h1 {
    color: #fff;
    text-align: center;
    font-family: cursive;
    width: 40px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
  }
}
.icon-class{
  padding-bottom: 3px;
  padding-right: 4px;
}
</style>
