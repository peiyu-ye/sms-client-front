<template>
  <div class="pageContent">
    <div class="pageTop">
      <a-tabs>
        <a-tab-pane key="1" tab="修改密码"></a-tab-pane>
      </a-tabs>
    </div>
    <div class="pageMain">
      <a-form
        ref="form"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-row>
          <a-col :span="24">
            <a-form-item label="原密码：" name="loginPassword" has-feedback>
              <a-input-password
                v-model:value="form.loginPassword"
                autocomplete="off"
                visibilityToggle
              />
            </a-form-item>
            <a-form-item
              required
              has-feedback
              label="新密码："
              name="editPassword"
            >
              <a-input-password
                v-model:value="form.editPassword"
                autocomplete="off"
                visibilityToggle
              />
            </a-form-item>
            <a-form-item
              required
              has-feedback
              label="确认密码："
              name="editPassword2"
            >
              <a-input-password
                v-model:value="form.editPassword2"
                visibilityToggle
                autocomplete="off"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item :wrapper-col="{ span: 14, offset: 8 }">
              <a-button type="primary" @click="onSubmit">
                确定保存
              </a-button>
              <span class="mesg">
                保存生效时间60秒！
              </span>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { message } from "ant-design-vue";
import API from "../../api/api";

export default defineComponent({
  components: {},
  data() {
    const validatePass2 = async (rule: any, value: string, callback: any) => {
      if (value === "") {
        return Promise.reject("确认密码不能为空！");
      } else if (value !== (this as any).form.editPassword) {
        return Promise.reject("两次输入的密码不一致!");
      } else {
        return Promise.resolve();
      }
    };
    return {
      labelCol: { span: 8 },
      wrapperCol: { span: 12 },
      // 客戶个人资料实体
      form: {
        loginPassword: "",
        editPassword: "",
        editPassword2: ""
      },
      rules: {
        loginPassword: [
          {
            required: true,
            message: "请输入6位以上的原密码",
            min: 6,
            trigger: "blur"
          }
        ],
        editPassword: [
          {
            required: true,
            message: "请输入6位以上的密码",
            min: 6,
            trigger: "blur"
          }
        ],
        editPassword2: [
          {
            validator: validatePass2,
            trigger: "change"
          }
        ]
      },
      checkPasswordHlpe: ""
    };
  },
  methods: {
    onSubmit() {
      const ruleForm: any = this.$refs.form;
      ruleForm
        .validate()
        .then(() => {
          try {
            const info: any = sessionStorage.getItem("userInfoEntity");
            const params = {
              adminId: JSON.parse(info).adminId,
              editPassword: this.form.editPassword,
              editPassword2: this.form.editPassword2,
              loginName: JSON.parse(info).loginName,
              loginPassword: this.form.loginPassword,
              merchantId: JSON.parse(info).merchantId,
              userId: JSON.parse(info).userId
            };
            API.userAPI
              .editPassword(params)
              .then((response: any) => {
                if (response.result == "success") {
                  message.success({
                    content: "修改密码成功！"
                  });
                }
              })
              .catch(e => {
                console.log(e);
              });
          } catch (error) {
            console.log(error);
            message.error({
              content: "数据请求失败，请稍后再试！"
            });
          }
        })
        .catch((e: any) => {
          message.warning({
            content: "请填写完整需要修改的内容！"
          });
        });
    }
  }
});
</script>

<style lang="stylus" scoped>
.pageMain{
  .formTextClass{
    color: rgba(0,0,0,.87);
    font-size: 16px;
    font-weight: 500;
    text-align: center;
  }
  .mesg{
    color: #ff7600;
    font-size: 14px;
    font-weight: 600;
    padding-left: 20px;
  }
}
</style>
