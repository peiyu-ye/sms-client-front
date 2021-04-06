<template>
  <div :class="data.isCollapse ? 'main-wrap-mix' : 'main-wrap'">
    <div class="layout-contenr">
      <a-layout-content>
        <!-- <keep-alive>
          <router-view :key="data.key" />
        </keep-alive> -->
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </a-layout-content>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
export default {
  name: "",
  /** 父组件传过来的值 */
  props: {},
  /** 组件 */
  components: {},
  setup() {
    interface DataType {
      // name: any;
      isCollapse: object;
      // key: any;
    }
    const store = useStore();
    // const route = useRoute();
    const data: DataType = reactive({
      isCollapse: store.state.app.isCollapse
      // key: route.path,
      // name: route.name
    });
    // onMounted(() => {
    //   console.log("key:", data.key);
    //   console.log("name:", data.name);
    // });
    // /** 声明周期函数 */
    data.isCollapse = computed(() => store.state.app.isCollapse);
    // /** 返回值 */
    return {
      data
    };
  }
};
</script>

<style lang="stylus" scoped>
.main-wrap {
  background-color: #fff;
  // padding: 20px;
  position: absolute;
  top: 64px;
  right: 0;
  left: 200px;
  bottom: 0;
  overflow: auto;
}

.main-wrap-mix {
  background-color: #fff;
  // padding: 20px;
  position: absolute;
  top: 64px;
  right: 0;
  left: 80px;
  bottom: 0;
}
.layout-contenr{
  padding: 0 20px;
}
</style>
