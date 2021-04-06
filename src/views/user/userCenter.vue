<template>
  <div class="pageContent">
    <div class="pageTop">
      <a-tabs>
        <a-tab-pane key="1" tab="个人资料"></a-tab-pane>
      </a-tabs>
      <div class="alert-info">
        <div class="alert-info-title">
          <InfoCircleOutlined style="color: rgba(251,150,0,1)" /> 温馨提示：修改信息保存生效时间为 60 秒！
        </div>
        <!-- <div class="alert-info-sapn">
          1、修改信息保存生效时间为 60 秒！
        </div> -->
      </div>
    </div>
    <div class="pageMain">
      <a-spin :spinning="loading" :delay="100" tip="正在加载数据...">
        <a-form
          ref="ruleForm"
          :model="form"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-row>
            <a-col :span="12">
              <a-form-item label="客戶名称：" name="merchantName">
                <span class="formTextClass">{{ form.merchantName }}</span>
              </a-form-item>
              <a-form-item label="地址：" name="contactAdress">
                <span class="formTextClass">{{ form.contactAdress }}</span>
              </a-form-item>
              <a-form-item label="可发短信类型：" name="discount">
                <span class="formTextClass">{{ form.discount }}</span>
              </a-form-item>
              <a-form-item
                ref="stateCallbackUrl"
                label="状态回调Url："
                name="stateCallbackUrl"
              >
                <a-input
                  placeholder="请正确填写状态回调Url"
                  v-model:value="form.stateCallbackUrl"
                >
                  <template #suffix>
                    <a-tooltip
                      title="此Url作为 短信服务平台自动发送“短信发送状态信息”的Url， 返回数据格式为Json， 详细内容请参考本平台的API说明文档。"
                    >
                      <info-circle-outlined style="color: rgba(251,150,0,1)" />
                    </a-tooltip>
                  </template>
                </a-input>
              </a-form-item>
              <a-form-item label="联系人姓名：" name="contactName">
                <a-input v-model:value="form.contactName" />
              </a-form-item>
              <a-form-item label="联系人电话：" name="contactPhone">
                <a-input v-model:value="form.contactPhone" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="客戶编号：" name="merchantNumber">
                <span class="formTextClass">{{ form.merchantNumber }}</span>
              </a-form-item>
              <a-form-item
                ref="accountBalance"
                label="账户余额："
                name="accountBalance"
              >
                <span class="formTextClass">{{
                  "￥ " + form.accountBalance + " 元"
                }}</span>
              </a-form-item>
              <a-form-item label="预警余额：" name="warningBalance">
                <a-input
                  v-model:value="form.warningBalance"
                  prefix="￥"
                  suffix="RMB"
                />
              </a-form-item>
              <a-form-item
                ref="receiveCallbackUrl"
                label="接收回调Url："
                name="receiveCallbackUrl"
              >
                <a-input
                  placeholder="请正确填写接收回调Url"
                  v-model:value="form.receiveCallbackUrl"
                >
                  <template #suffix>
                    <a-tooltip
                      title="此Url作为 短信服务平台自动发送“短信发送状态信息”的Url， 返回数据格式为Json， 详细内容请参考本平台的API说明文档。"
                    >
                      <info-circle-outlined style="color: rgba(251,150,0,1)" />
                    </a-tooltip>
                  </template>
                </a-input>
              </a-form-item>
              <a-form-item label="联系人邮箱：" name="contactEmail">
                <a-input v-model:value="form.contactEmail" />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
                <a-button type="primary" @click="onSubmit" :loading="loading">
                  确定保存
                </a-button>
                <!-- <span class="mesg">
                  保存生效时间60秒！
                </span> -->
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-spin>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { InfoCircleOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import API from "../../api/api";
export default defineComponent({
  components: {
    InfoCircleOutlined
  },
  data() {
    return {
      loading: false,
      labelCol: { span: 8 },
      wrapperCol: { span: 12 },
      // 客戶个人资料实体
      form: {
        merchantId: "",
        merchantName: "",
        merchantNumber: "",
        contactAdress: "",
        accountBalance: "0.0000",
        discount: "",
        warningBalance: "",
        contactName: "",
        contactQQ: "",
        contactWechat: "",
        contactEmail: "",
        contactPhone: "",
        stateCallbackUrl: "",
        receiveCallbackUrl: ""
      },
      rules: {
        contactName: [
          {
            required: true,
            message: "请填写完整",
            trigger: "blur"
          }
        ],
        contactEmail: [
          {
            pattern: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
            required: true,
            message: "请正确填写完整邮箱信息",
            trigger: "blur"
          }
        ],
        contactPhone: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]{9}$/,
            required: true,
            message: "请正确填写完整手机号码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.handlerGetDatainfo();
  },
  methods: {
    handlerGetDatainfo() {
      this.loading = true;
      const info: any = sessionStorage.getItem("userInfoEntity");
      const adminId: any = JSON.parse(info).adminId;
      const merchantId: any = JSON.parse(info).merchantId;
      const datas: any = {
        pageNum: 1,
        pageSize: 10,
        beginTime: null,
        endTime: null,
        searchContent: null,
        orderBy: null,
        userId: JSON.parse(info).userId,
        merchantId: merchantId,
        adminId: adminId,
        loginName: JSON.parse(info).loginName
      };
      API.userAPI
        .getUserInfo(datas)
        .then((res: any) => {
          if (res.result == "success") {
            this.form = res.data;
            this.loading = false;
          } else {
            message.error({
              content: "加载数据失败,请稍后再试！"
            });
            this.loading = false;
          }
        })
        .catch(e => {
          console.log(e);
          message.error({
            content: "加载数据失败，请联系管理员！"
          });
          this.loading = false;
        });
    },
    onSubmit() {
      const ruleForm: any = this.$refs.ruleForm;
      ruleForm
        .validate()
        .then(() => {
          try {
            this.loading = true;
            API.userAPI
              .updateMerchant(this.form)
              .then((response: any) => {
                if (response.result == "success") {
                  this.handlerGetDatainfo();
                  // message.success({
                  //   content: "更新成功！"
                  // });
                }
              })
              .catch(e => {
                console.log(e);
              });
          } catch (error) {
            console.log(error);
            message.error({
              content: "加载数据失败，请联系管理员！"
            });
            this.loading = false;
          } finally {
            this.loading = false;
          }
        })
        .catch((e: any) => {
          message.warning({
            content: "请填写完整内容！"
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
