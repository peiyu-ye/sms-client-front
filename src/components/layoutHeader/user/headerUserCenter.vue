<template>
  <div class="user-center">
    <a-dropdown :trigger="['hover']">
      <a class="user" @click="e => e.preventDefault()">
        <a-avatar class="user-avatar" src="../assets/logo.png" />
        <span> {{ storage.name }} </span>
      </a>
      <template v-slot:overlay>
        <a-menu class="uer-center-items">
          <a-menu-item>
            <router-link to="/account">
              <FundProjectionScreenOutlined
                :style="{ 'padding-right': '4px' }"
              />
              账户管理
            </router-link>
          </a-menu-item>
          <a-menu-item>
            <router-link to="/personal"
              ><UserOutlined
                :style="{ 'padding-right': '4px' }"
              />个人中心</router-link
            >
          </a-menu-item>
          <a-menu-item>
            <router-link to="/changePassword"
              ><KeyOutlined
                :style="{ 'padding-right': '4px' }"
              />修改密码</router-link
            >
          </a-menu-item>
          <a-menu-item>
            <a @click="logout"
              ><PoweroffOutlined
                :style="{ color: 'red', 'padding-right': '4px' }"
              />退出登录</a
            >
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>

<script lang="ts">
import { reactive } from "vue";
import { useStore } from "vuex";
import {
  UserOutlined,
  KeyOutlined,
  PoweroffOutlined,
  FundProjectionScreenOutlined
} from "@ant-design/icons-vue";
export default {
  name: "",
  /** 父组件传过来的值 */
  props: {},
  /** 组件 */
  components: {
    UserOutlined,
    KeyOutlined,
    PoweroffOutlined,
    FundProjectionScreenOutlined
  },
  setup() {
    const callback = (key: unknown) => {
      console.log("key", key);
    };
    const storage = reactive({ name: localStorage.loginName });
    const store = useStore();
    const logout = () => {
      store.dispatch("user/logout");
    };
    /** 返回值 */
    return { callback, storage, logout };
  }
};
</script>

<style lang="stylus" scoped>
.user {
  font-size: 14px;
  color: black;
  line-height: 50px;
  .user-avatar {
    margin-top: -8px;
  }
}
.uer-center-items {
  margin-top: 18px;
  > * {
    padding: 5 20px;
  }
}
</style>
