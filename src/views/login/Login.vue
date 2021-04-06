<template>
  <div class="login">
    <div class="login-mask">
      <div class="login-form-wrap">
        <div class="login-form">
          <div class="login-form-content">
            <!-- <router-link to="/userCenter/personal">Go to Home</router-link> -->
            <header>
              <!-- <img src="@/assets/logo.png" /> -->
              <h1>SMS短信客户端登录</h1>
            </header>
            <a-form :model="formData" :rules="formRules" ref="ruleForm">
              <a-form-item name="loginName">
                <a-input
                  size="large"
                  v-model:value="formData.loginName"
                  placeholder="请输入用户名"
                />
              </a-form-item>
              <a-form-item name="loginPassword">
                <a-input-password
                  size="large"
                  visibilityToggle
                  v-model:value="formData.loginPassword"
                  placeholder="请输入密码"
                  @keyup.enter="handleLogin"
                />
              </a-form-item>
              <a-form-item>
                <a-button
                  type="primary"
                  size="large"
                  block
                  @click="handleLogin"
                  :loading="loading"
                  >登录</a-button
                >
              </a-form-item>
            </a-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
// import { defineComponent, reactive, ref, unref, toRaw } from "vue";
import { defineComponent } from "vue";
// import { useRouter, RouteLocationRaw } from "vue-router";
import { notification, message } from "ant-design-vue";
import API from "../../api/api";

export default defineComponent({
  name: "Login",
  data() {
    return {
      formData: {
        loginName: "",
        loginPassword: ""
      },
      formRules: {
        loginName: [{ required: true, message: "请输入账号", trigger: "blur" }],
        loginPassword: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            // pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/,
            max: 12,
            min: 6,
            message: "密码应该在6-12位",
            trigger: "blur"
          }
        ]
      },
      loading: false,
      redirect: undefined as any,
      otherQuery: {}
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true
    }
  },
  created() {
    sessionStorage.workerId = "";
    sessionStorage.clear();
  },
  methods: {
    handleLogin() {
      this.loading = true;
      const datas: any = this.$refs.ruleForm;
      datas
        .validate()
        .then(() => {
          try {
            // 调用登录接口API
            API.loginAPI
              .login({
                loginPassword: this.formData.loginPassword,
                loginName: this.formData.loginName
              })
              .then(async (response: any) => {
                console.log("result", response);
                if (response.result == "fail") {
                  message.error({
                    content: "对不起，您输入的账户密码错误！"
                  });
                } else if (response.loginResult == "nousername") {
                  message.error({
                    content: "对不起，系统没有检测到您的账户信息！"
                  });
                } else if (response.loginResult == "nopassword") {
                  message.error({
                    content: "对不起，您输入的账户密码错误！"
                  });
                } else {
                  sessionStorage.setItem("token", response.loginResult);
                  localStorage.loginName = this.formData.loginName; //用户名在了localStorage
                  sessionStorage.setItem(
                    "userInfoEntity",
                    JSON.stringify(response.userInfoEntity)
                  );
                  //   /** 路由 */sendStatistical
                  // const router = useRouter();
                  // const toPage = (path: RouteLocationRaw) => router.push(path);
                  await this.$router
                    .push({
                      path: this.redirect || "/sendStatistical",
                      query: this.otherQuery
                    })
                    .then(() => {
                      setTimeout(() => {
                        notification["success"]({
                          message: "登录成功",
                          description:
                            "尊敬的" +
                            this.formData.loginName +
                            "用户，欢迎回来！"
                        });
                      }, 10);
                    })
                    .catch(() => {
                      message.error({
                        content: "跳转页面失败！"
                      });
                      sessionStorage.clear();
                    });
                }
              })
              .catch(e => {
                console.log(e);
              });
          } catch (error) {
            notification["error"]({
              message: "登录失败",
              description: "请检查您的用户名或者密码是否正确！"
            });
          } finally {
            this.loading = false;
          }
        })
        .catch((error: any) => {
          console.log("error", error);
          this.loading = false;
        });
    },
    getOtherQuery(query: any) {
      return Object.keys(query).reduce((acc: any, cur: any) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    }
  }
});
// export default defineComponent({
/** 所有的代码逻辑将在setup方法中实现，并且不再有this */
// setup() {
//   /** 返回值 */
//   const formData = reactive({
//     loginName: "",
//     loginPassword: ""
//   });
//   const formRef = ref<any>(null);
//   const formState = reactive({
//     loading: false
//   });
//   const formRules = reactive({
//     loginName: [{ required: true, message: "请输入账号", trigger: "blur" }],
//     loginPassword: [
//       { required: true, message: "请输入密码", trigger: "blur" },
//       {
//         // pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/,
//         max: 12,
//         min: 6,
//         message: "密码应该在6-12位",
//         trigger: "blur"
//       }
//     ]
//   });
//   /** 路由 */
//   const router = useRouter();
//   const toPage = (path: RouteLocationRaw) => router.push(path);
//   /** 方法 */
//   async function handleLogin() {
//     const form = unref(formRef);
//     if (!form) return;
//     formState.loading = true;
//     sessionStorage.removeItem("token");
//     try {
//       const data = await form.validate();
//       // 调用登录接口API
//       // console.log("userInfo", JSON.stringify(data));
//       API.loginAPI
//         .login({
//           loginPassword: data.loginPassword,
//           loginName: data.loginName
//         })
//         .then((response: any) => {
//           if (response.result == "fail") {
//             message.error({
//               content: "对不起，您输入的账户密码错误！"
//             });
//           } else if (response.data.loginResult == "nousername") {
//             message.error({
//               content: "对不起，系统没有检测到您的账户信息！"
//             });
//           } else if (response.data.loginResult == "nopassword") {
//             message.error({
//               content: "对不起，您输入的账户密码错误！"
//             });
//           } else {
//             sessionStorage.setItem("token", response.data.loginResult);
//             localStorage.loginName = data.loginName; //用户名在了localStorage
//             sessionStorage.setItem(
//               "userInfoEntity",
//               JSON.stringify(response.data.userInfoEntity)
//             );
//             // toPage("/layout");
//             toPage("/");
//             setTimeout(() => {
//               notification["success"]({
//                 message: "登录成功",
//                 description: "尊敬的" + data.loginName + "用户，欢迎回来！"
//               });
//             }, 10);
//           }
//         })
//         .catch(e => {
//           console.log(e);
//         });
//     } catch (error) {
//       notification["error"]({
//         message: "登录失败",
//         description: "请检查您的用户名或者密码是否正确！"
//       });
//     } finally {
//       formState.loading = false;
//     }
//   }
//   /** 返回值  */
//   return {
//     formRef,
//     formData,
//     formState,
//     formRules,
//     login: handleLogin
//   };
// }
// });
</script>
<style lang="stylus" scoped>
.login {
  position: relative;
  height: 100vh;
  background: url('../../assets/login/login-bg.png') no-repeat;
  background-size: 100% 100%;

  &-mask {
    height: 100%;
    background: url('../../assets/login/login-in.png') no-repeat;
    background-size: 100% 100%;
  }

  &-form {
    width: 32rem;
    background: rgba(255, 255, 255, 0.5);
    border: 10px solid rgba(255, 255, 255, 0.5);
    border-width: 10px;
    border-radius: 4px;
    background-clip: padding-box;
    position: absolute;
    right: 6%;
    top: 25%;
    box-shadow: 1px 2px 8px 4px #0387f1;

    &-wrap {
      position: absolute;
      top: 0;
      right: 0;
      display: flex;
      width: 100%;
      height: 100%;
      justify-content: center;
      align-items: center;
    }

    &-content {
      width: 100%;
      height: 100%;
      border: 1px solid #999;
      border-radius: 2px;

      header {
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          display: inline-block;
          width: 80px;
        }

        h1 {
          margin-top: 1rem;
          margin-bottom: 0;
          font-size: 24px;
          color: rgba(255, 255, 255, 1);
          text-align: center;
        }
      }

      form {
        width: 80%;
        margin-left: 10%;
        margin-top: 5%;
      }
    }
  }
}
</style>
