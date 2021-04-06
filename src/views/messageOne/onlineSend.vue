<template>
  <div class="pageContent">
    <div class="pageTop">
      <a-tabs>
        <a-tab-pane key="1" tab="在线发送任务"></a-tab-pane>
      </a-tabs>
      <div class="topBottomSearch">
        <a-row>
          <a-col :span="22">
            <p class="searchHead">
              <label>短信内容: </label>
              <a-input
                v-model:value="searchContent"
                placeholder="请输入客户号码"
                style="width: 200px"
              />
            </p>
            <p class="searchHead">
              <label>选择时间：</label>
              <a-range-picker
                v-model:value="searchDateTime"
                format="YYYY-MM-DD HH:mm:ss"
                valueFormat="YYYY-MM-DD HH:mm:ss"
                showTime
                :placeholder="['开始时间', '结束时间']"
                @ok="onPick"
                :allowClear="false"
              />
            </p>
            <p class="searchHead">
              <label>状态：</label>
              <a-select
                v-model:value="status"
                style="width: 200px"
                placeholder="请选择所属呼叫任务"
                :dropdownMenuStyle="{
                  'max-height': '140px'
                }"
              >
                <a-select-option value="-1" label="全部">全部</a-select-option>
                <a-select-option value="waiting_for_send" label="待执行">
                  待执行
                </a-select-option>
                <a-select-option value="send_doing" label="执行中">
                  执行中
                </a-select-option>
                <a-select-option value="send_success" label="执行成功">
                  执行成功
                </a-select-option>
                <a-select-option value="send_failed" label="执行失败">
                  执行失败
                </a-select-option>
              </a-select>
            </p>
          </a-col>
          <a-col :span="1">
            <a-button type="primary" @click="handleGetSendTaskList"
              >查询</a-button
            >
          </a-col>
        </a-row>
      </div>
    </div>
    <div class="pageMain">
      <div class="pageMain-Operation">
        <a-button type="primary" @click="addTask('add', 'input')">
          <template #icon><FormOutlined /></template>录入-发送短信
        </a-button>
        <a-button
          type="primary"
          @click="importTask('add', 'import', '群发短信')"
        >
          <template #icon><SelectOutlined /></template>导入-群发短信
        </a-button>
        <a-button
          type="primary"
          @click="importTask('add', 'import', '变量短信')"
        >
          <template #icon><SelectOutlined /></template>导入-变量短信
        </a-button>
      </div>
      <a-table
        :loading="loading"
        :columns="columns"
        :data-source="tabelData"
        rowKey="sendTaskid"
        size="middle"
        show-size-changer
        :scroll="{ x: 800, y: 700 }"
        :pagination="{
          size: 'small',
          showQuickJumper: true,
          showSizeChanger: true,
          hideOnSinglePage: true,
          current: current,
          pageSize: pageSize,
          total: total,
          pageSizeOptions: pageSizeOptions
        }"
        @change="changeTaskList"
      >
        <template #status="{ record }">
          <span
            :class="
              record.status == 'send_doing'
                ? 'send_doing'
                : record.status == 'send_success'
                ? 'send_success'
                : record.status == 'send_failed'
                ? 'send_failed'
                : ''
            "
          >
            {{
              record.status == "send_doing"
                ? "执行中"
                : record.status == "send_success"
                ? "执行成功"
                : record.status == "send_failed"
                ? "执行失败"
                : "待执行"
            }}
          </span>
        </template>
        <template #operation="{ record }">
          <a
            class="operationClass"
            v-if="
              record.status == 'waiting_for_send' &&
                record.taskType == '即时发送'
            "
            @click="startSendTask(record)"
          >
            执行任务
          </a>
          <a-divider
            type="vertical"
            v-if="
              record.status == 'waiting_for_send' &&
                record.taskType == '即时发送'
            "
          />
          <a
            class="operationClass"
            v-if="
              record.status == 'waiting_for_send' ||
                record.status == 'send_failed'
            "
            @click="updateTask(record, 'update')"
          >
            修改
          </a>
          <a
            class="operationClass"
            v-if="record.status == 'send_success'"
            @click="handleDetails(record)"
          >
            更多详情
          </a>
        </template>
      </a-table>
    </div>
    <!-- 任务详情弹框 -->
    <a-modal
      v-model:visible="modalVisible"
      title="任务详情"
      style="top: 20%;"
      cancelText=""
      @ok="modalVisible = false"
    >
      <div class="modelFormText">
        <a-form ref="modalForm" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-item label="短信状态：" style="margin-bottom: 4px;">
            <span
              :class="
                modelDetails.status == 'send_doing'
                  ? 'send_doing'
                  : modelDetails.status == 'send_success'
                  ? 'send_success'
                  : modelDetails.status == 'send_failed'
                  ? 'send_failed'
                  : ''
              "
            >
              {{
                modelDetails.status == "send_doing"
                  ? "执行中"
                  : modelDetails.status == "send_success"
                  ? "执行成功"
                  : modelDetails.status == "send_failed"
                  ? "执行失败"
                  : "待执行"
              }}
            </span>
          </a-form-item>
          <a-form-item label="短信类型：" style="margin-bottom: 4px;">
            {{ modelDetails.smsType }}
          </a-form-item>
          <a-form-item label="任务名称：" style="margin-bottom: 4px;">
            {{ modelDetails.taskName }}
          </a-form-item>
          <a-form-item label="短信签名：" style="margin-bottom: 4px;">
            {{ modelDetails.smsSignature }}
          </a-form-item>
          <a-form-item label="短信模板：" style="margin-bottom: 4px;">
            <a-textarea v-model:value="modelDetails.templateContent" disabled />
          </a-form-item>
          <a-form-item label="号码数量：" style="margin-bottom: 4px;">
            {{ modelDetails.phoneCount }}
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
    <!-- 录入任务弹窗 -->
    <a-modal
      v-model:visible="modal2Visible"
      style="top: 5%;"
      :title="tagTask == 'add' ? '添加短信发送任务' : '修改短信发送任务'"
      :width="900"
      cancelText=""
      :okText="importType === '变量短信' ? '生成短信模板' : '保存'"
      @ok="importType === '变量短信' ? '' : sendTaskForInput()"
      @cancel="cancelForm()"
    >
      <a-popover placement="rightBottom">
        <template #content>
          <p>第一步:下载模板</p>
          <p>
            第二步:按模板内容输入【手机号码】,【变量】,【变量1】,如果变量不满足需求,也可以自行添加变量
          </p>
          <p>第三步:导入填好的模板之后显示两个变量的按钮</p>
          <p>
            第四步:编辑短信模板的内容,点击【变量】【变量1】可插入短信模板,填写签名
          </p>
          <p>第五步:保存任务,并在列表执行</p>
        </template>
        <template #title>
          <InfoCircleOutlined style="color: rgba(251,150,0,1)" />
          <span>温馨提示</span>
        </template>
        <a-button type="link">
          <QuestionCircleOutlined
            style="color: rgba(251,150,0,1);margin: 0 4px;"
          />操作提示</a-button
        >
      </a-popover>
      <a-popover placement="bottomLeft">
        <template #content>
          <img src="@/assets/import.png" height="300" width="800" />
        </template>
        <a-button type="link" v-show="importType === '变量短信'">
          操作帮助
        </a-button>
      </a-popover>
      <a-popover placement="rightBottom">
        <template #content>
          <img src="@/assets/import_explain.png" height="500" width="650" />
        </template>
        <a-button type="link" v-show="importType === '群发短信'">
          操作帮助
        </a-button>
      </a-popover>
      <div class="modelFormText">
        <a-row>
          <a-form
            ref="modalForm"
            :model="modelEditForm"
            :rules="modelEditFormRules"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-col :span="24">
              <!-- smsTypeId == '1'通知  smsTypeId == '2'验证码   smsTypeId == '3'营销  -->
              <a-form-item label="短信类型：" name="smsTypeId">
                <a-select
                  v-model:value="modelEditForm.smsTypeId"
                  style="width: 200px"
                  placeholder="请选择短信类型"
                  :dropdownMenuStyle="{
                    'max-height': '140px'
                  }"
                >
                  <a-select-option value="1" label="通知">
                    通知
                  </a-select-option>
                  <a-select-option value="2" label="验证码">
                    验证码
                  </a-select-option>
                  <a-select-option value="3" label="营销">
                    营销
                  </a-select-option>
                </a-select>
                <!-- <span class="formTextClass">{{ modelEditForm.smsType }}</span> -->
              </a-form-item>
              <a-form-item required label="任务名称：" name="taskName">
                <a-input
                  v-model:value="modelEditForm.taskName"
                  placeholder="请输入任务名称，此名称只做数据标识，不涉及业务"
                />
              </a-form-item>
              <a-form-item
                v-if="modelEditForm.sendType == 'input'"
                label="手机号码："
                name="phoneNumbers"
                extra=" 多个手机号码之间请用英文逗号分割，不能有换行等其他特殊字符，最多支持200个号码 "
              >
                <a-textarea
                  v-model:value="modelEditForm.phoneNumbers"
                  placeholder="请输入手机号码"
                />
              </a-form-item>
              <a-form-item
                v-else
                label="手机号码："
                name="phoneFilePath"
                :extra="
                  importType === '群发短信'
                    ? '只支持文件类型：xls、xlsx、txt、csv'
                    : '只支持文件类型：xlsx'
                "
              >
                <a
                  v-if="importType === '变量短信'"
                  style="margin-right:20px;"
                  :href="`${path}template_phoneParam.xlsx`"
                  download="template_phoneParam.xlsx"
                >
                  xlsx 模板下载
                </a>
                <a-upload
                  action="http://192.168.0.28/smsapi/1.0/uploadFile/upload"
                  :multiple="true"
                  list-type="text"
                  accept=".xls,.xlsx,.txt,.csv"
                  :file-list="fileList"
                  @change="handleChangeFileList"
                >
                  <a-button type="primary">
                    <UploadOutlined /> 选择文件
                  </a-button>
                </a-upload>
              </a-form-item>
              <a-form-item
                v-if="
                  modelEditForm.sendType != 'input' && importType != '变量短信'
                "
                label="选择联系人群组："
              >
                <a-button type="primary" @click="getContactGroupList">
                  选择联系人群组
                </a-button>
              </a-form-item>
              <!-- </a-col>
            <a-col :span="12"> -->
              <a-form-item label="任务类型：" name="taskType">
                <a-select
                  v-model:value="modelEditForm.taskType"
                  style="width: 200px"
                  placeholder="请选择任务类型"
                  :dropdownMenuStyle="{
                    'max-height': '140px'
                  }"
                >
                  <a-select-option value="即时发送" label="即时发送">
                    即时发送
                  </a-select-option>
                  <a-select-option value="定时发送" label="定时发送">
                    定时发送
                  </a-select-option>
                </a-select>
                <div
                  class="timePickerForm"
                  v-if="modelEditForm.taskType == '定时发送'"
                >
                  <a-date-picker
                    showTime
                    placeholder="选择定时发送的时间"
                    v-model:value="modelEditForm.taskSendTime"
                    valueFormat="YYYY-MM-DD HH:mm:ss"
                  />
                </div>
              </a-form-item>
              <a-form-item label="短信签名：" name="smsSignature">
                <a-input
                  v-model:value="modelEditForm.smsSignature"
                  placeholder="请输入要发送短信的签名"
                />
              </a-form-item>
              <a-form-item
                label="短信模板："
                name="templateContent"
                extra="包含敏感词汇短信将被拦截或进入人工审核，请进行敏感词汇识别"
              >
                <a-textarea
                  v-model:value="modelEditForm.templateContent"
                  style="width: 92%"
                  showCount
                  :maxlength="530"
                  placeholder="请输入要发送短信的内容"
                />
                <a-popover placement="right">
                  <template #content>
                    <p>
                      温馨提示：单次最多可输入
                      530个字（含标点符号，短信签名）<br />
                    </p>
                    <p>
                      短信签名会自动计入前后 【】 2个字符
                      (字符下发短信自动添加， 不需输入) <br />
                      计算规则：<br />
                      · ≤70个字（含标点符号，短信签名），计为一条普通短信；<br />
                      · ＞70个字（含标点符号，短信签名），计为长短信，<br />
                      · 每满67个字（含标点符号）计为一条短信，<br />
                      · 剩余超出字数（未满67个字符）也计为一条<br />
                    </p>
                  </template>
                  <template #title>
                    <InfoCircleOutlined style="color: rgba(251,150,0,1)" />
                    <span>温馨提示</span>
                  </template>
                  <QuestionCircleOutlined
                    :style="{
                      color: 'rgba(251, 150, 0, 1)',
                      fontSize: '24px',
                      margin: '10px'
                    }"
                  />
                </a-popover>
              </a-form-item>
            </a-col>
            <a-col :span="14" :offset="6">
              <a-button
                type="primary"
                :loading="loadingBtn"
                @click="validateKeywordBan"
              >
                <template #icon><SearchOutlined /></template>敏感词识别
              </a-button>
              <span class="tipText_warning">
                {{ tipKeyword }}
              </span>
            </a-col>
          </a-form>
          <a-col :span="18" :offset="6">
            <br />
            <div
              v-show="
                modelEditForm.sendType == 'import' && importType === '群发短信'
              "
            >
              <span class="tipText_failed">· 导入群发短信最大限制100万条！</span
              ><br />
              <span class="tipText"
                >· 上传文件必须标准的 xlsx(编码格式：UTF-8)、xls、txt、csv</span
              >
            </div>
            <div
              v-show="
                modelEditForm.sendType == 'import' && importType === '变量短信'
              "
            >
              <span class="tipText">
                · 变量导入 ->
                短信模板变量名必须与excel导入变量名相同且顺序一致！
              </span>
              <br />
              <span class="tipText">
                · 上传文件必须标准的 xlsx文件(编码格式：UTF-8)
              </span>
            </div>
            <span class="tipText">
              · 保存成功后，请在浏览页面点击 "执行任务"
              按钮成功后才能开始发短信操作！
            </span>
            <br />
            <span class="tipText_failed">
              ·
              变量短信计费:按实际发送的字符数换算短信条数计费(变量下的正式字符串数)
            </span>
          </a-col>
        </a-row>
      </div>
    </a-modal>
    <a-modal
      v-model:visible="modal3Visible"
      title="选择联系人群组"
      style="top: 25%;"
    >
      <div class="modelSearchHead">
        <p>
          <span class="searchHead">
            <label>检索内容: </label>
            <a-input
              v-model:value="contactName"
              placeholder="请输入查询内容"
              style="width: 300px"
            />
          </span>
          <a-button type="primary">
            查询
          </a-button>
        </p>
        <a-table
          :loading="modalLoading"
          :columns="modalColumns"
          :data-source="modalTabelData"
          :row-selection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange
          }"
          rowKey="contactName"
          size="middle"
          show-size-changer
          :scroll="{ x: 300, y: 300 }"
          :pagination="{
            size: 'small',
            showQuickJumper: true,
            showSizeChanger: true,
            hideOnSinglePage: true,
            current: modalCurrent,
            pageSize: modalPageSize,
            total: modalTotal,
            pageSizeOptions: modalPageSizeOptions
          }"
          @change="changeTaskList"
        >
        </a-table>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  FormOutlined,
  SelectOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  QuestionCircleOutlined,
  UploadOutlined
} from "@ant-design/icons-vue";
import { message, notification } from "ant-design-vue";
import API from "../../api/api";
import { parseTime } from "@/utils/index";
import moment from "moment";
export default defineComponent({
  components: {
    FormOutlined,
    SelectOutlined,
    InfoCircleOutlined,
    SearchOutlined,
    QuestionCircleOutlined,
    UploadOutlined
  },
  data() {
    // 任务名称不能重复异步判断
    const validateTaskName = async (
      rule: any,
      value: string,
      callback: any
    ) => {
      if (value === "") {
        return Promise.reject("任务名称不能为空！");
      } else {
        // 任务名称识别（不能存在重复的名称）
        await API.messageOneAPI
          .validateTaskNameRepeat({
            filedName: "taskName",
            filedValue: value
          })
          .then((res: any) => {
            if (res.result == "false") {
              return Promise.reject("任务名称不能重复！");
            } else {
              return Promise.resolve();
            }
          });
      }
    };
    // 判断电话格式
    const validatePhone = async (rule: any, value: string, callback: any) => {
      if (value === "") {
        return Promise.reject("手机号码不能为空！");
      } else {
        value = value.replace(/[(\r\n)|(\n)|，|、|/|\\|;]/g, ",");
        const phoneArray: any = value.split(",");
        if (phoneArray.length > 200) {
          return Promise.reject(
            "手机号码个数超出限制，最多不得超过：" + 200 + "个！"
          );
        }
        for (let i = 0; i < phoneArray.length; i++) {
          const phoneNumber: any = phoneArray[i];
          const re: any = /(^(\d{2,4}[-_－— ]?)?\d{3,8}([-_－— ]?\d{3,8})?([-_－— ]?\d{1,7})?$)|(^0?1[35]\d{9}$)/;
          if (value && !re.test(phoneNumber)) {
            return Promise.reject("手机号码格式不正确!");
          }
          if (
            // 手机号码位数(最早的10位)
            phoneNumber.length != 10 &&
            phoneNumber.length != 11 &&
            phoneNumber.length != 12
          ) {
            return Promise.reject("手机号码格式不正确");
          }
        }
        return Promise.reject();
      }
    };
    return {
      path: process.env.BASE_URL,
      loading: false,
      loadingBtn: false,
      // search
      searchContent: "",
      searchDateTime: [
        parseTime(new Date(), "{y}-{m}-{d} 00:00:00"),
        parseTime(new Date(), "{y}-{m}-{d} 23:59:59")
      ],
      status: "-1",
      pageSize: 10,
      current: 1,
      total: 0,
      pageSizeOptions: ["20", "50", "100", "200"],
      modalPageSize: 5,
      modalCurrent: 1,
      modalTotal: 0,
      modalPageSizeOptions: ["10", "25", "50", "100"],
      selectedRowKeys: [], // Check here to configure the default column
      modalColumns: [
        {
          title: "联系人群组名称",
          dataIndex: "contactName",
          key: "contactName",
          align: "center"
        }
      ],
      modalTabelData: [
        {
          id: "",
          contactName: ""
        }
      ],
      contactName: null as string | null,
      columns: [
        {
          title: "电话数量",
          dataIndex: "phoneCount",
          key: "phoneCount",
          align: "center"
        },
        {
          title: "状态",
          dataIndex: "status",
          key: "status",
          slots: { customRender: "status" },
          align: "center"
        },
        {
          title: "任务类型",
          dataIndex: "taskType",
          key: "taskType",
          align: "center"
        },
        {
          title: "短信模板",
          dataIndex: "smsContent",
          key: "smsContent",
          align: "center"
        },
        {
          title: "创建时间",
          dataIndex: "taskSendTime",
          key: "taskSendTime",
          align: "center"
        },
        {
          title: "操作",
          dataIndex: "operation",
          slots: { customRender: "operation" },
          align: "center"
        }
      ],
      tabelData: [
        {
          sendTaskid: "1",
          phoneCount: "2599",
          taskSendTime: "2020-12-15 11:07:37",
          taskType: "充值",
          smsContent: "充值",
          status: "send_success"
        }
      ], //表格数据
      modalVisible: false,
      modal2Visible: false,
      modal3Visible: false,
      modelDetails: {},
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
      modelEditForm: {
        smsType: "营销",
        smsTypeId: "3",
        taskName: "",
        phoneNumbers: null as string | null,
        taskType: "即时发送",
        smsSignature: "",
        templateContent: null as string | null,
        taskSendTime: null as string | null,
        phoneCount: "",
        createTime: "",
        updateTime: "",
        sendType: "",
        phoneFilePath: null as string | null,
        sendTaskid: 0
      },
      modelEditFormRules: {
        smsTypeId: [
          {
            required: true,
            message: "请选择短信类型",
            trigger: "change"
          }
        ],
        taskName: [
          {
            required: true,
            validator: validateTaskName,
            trigger: "blur"
          }
        ],
        phoneNumbers: [
          {
            validator: validatePhone,
            trigger: "blur"
          }
        ],
        phoneFilePath: [
          {
            required: true,
            message: "请上传文件",
            trigger: "blur"
          }
        ],
        taskType: [
          {
            required: true,
            message: "请选择",
            trigger: "change"
          }
        ],
        smsSignature: [
          {
            required: true,
            message: "请填写完整短信签名",
            trigger: "blur"
          }
        ],
        templateContent: [
          {
            required: true,
            message: "请填写完整短信模板",
            trigger: "blur"
          }
        ]
      },
      fileList: [] as object[], //上传的文件
      tagTask: "",
      importType: "",
      tipTaskName: "",
      // 敏感词
      tipKeyword: "",
      adminId: "",
      merchantId: "",
      userId: "",
      loginName: ""
    };
  },
  created() {
    this.handleGetSendTaskList();
  },
  methods: {
    handleGetSendTaskList() {
      this.loading = true;
      const info: any = sessionStorage.getItem("userInfoEntity");
      this.adminId = JSON.parse(info).adminId;
      this.merchantId = JSON.parse(info).merchantId;
      this.userId = JSON.parse(info).userId;
      this.loginName = JSON.parse(info).loginName;
      const datas: any = {
        pageNum: this.current,
        pageSize: this.pageSize,
        beginTime: this.searchDateTime[0],
        endTime: this.searchDateTime[1],
        // endTimeText: null,
        // beginTimeText: null,
        searchContent: this.searchContent,
        status: this.status,
        orderBy: "createTime desc",
        userId: this.userId,
        merchantId: this.merchantId,
        adminId: this.adminId,
        loginName: this.loginName
      };
      this.tabelData = [];
      API.messageOneAPI
        .getSendTaskList(datas)
        .then((res: any) => {
          if (res.result == "success") {
            this.total = res.data.total;
            this.current = res.data.pageNum;
            this.pageSize = res.data.pageSize;
            this.tabelData = res.data.rows;
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
          this.tabelData = [];
          this.loading = false;
        });
    },
    // 列表分页 --分页、排序、筛选变化时触发(pagination:any, filters:any, sorter:any, { currentDataSource }:any)
    changeTaskList(pagination: any) {
      this.current = pagination.current;
      this.pageSize = pagination.pageSize;
      this.handleGetSendTaskList();
    },
    // 时间选择
    onPick(value: any) {
      this.searchDateTime = value;
      this.handleGetSendTaskList();
    },
    // 详情
    handleDetails(rowData: any) {
      // console.log("handleDetails", rowData);
      this.modalVisible = true;
      this.modelDetails = rowData;
    },
    //模态框form表单的时间选择（禁用今天包括今天之前的时间）
    moment,
    // 敏感词识别
    validateKeywordBan() {
      if (
        this.modelEditForm.templateContent == "" ||
        this.modelEditForm.templateContent == null
      ) {
        this.tipKeyword = "无内容识别";
        return;
      }
      this.loadingBtn = true;
      const params = {
        merchantId: this.merchantId,
        searchContent: this.modelEditForm.templateContent
      };
      API.messageOneAPI
        .validateKeywordBan(params)
        .then((res: any) => {
          this.tabelData = [];
          if (res.result == "success") {
            const result = res.data.resultList;
            if (result.length > 0) {
              const arr: any[] = [];
              result.forEach((e: any) => {
                arr.push(e.keyWord);
              });
              this.tipKeyword =
                "包含敏感词（" + result.length + "）个: " + arr.toString();
            } else {
              this.tipKeyword = "没有敏感词";
            }
            this.loadingBtn = false;
          } else {
            message.error({
              content: "加载数据失败,请稍后再试！"
            });
            this.loadingBtn = false;
          }
        })
        .catch(e => {
          console.log(e);
          message.error({
            content: "加载数据失败，请联系管理员！"
          });
          this.loadingBtn = false;
        });
    },
    cancelForm() {
      //重置表单
      const modalForm: any = this.$refs.modalForm;
      modalForm.resetFields();
      this.modelEditForm = [] as any;
      this.fileList = [];
      this.tipKeyword = "";
    },
    // 新增
    addTask(tag: string, importTag: string) {
      this.modal2Visible = true;
      this.tagTask = tag;
      this.modelEditForm.sendType = importTag;
    },
    // 导入
    importTask(tag: string, importTag: string, importType: string) {
      this.modal2Visible = true;
      this.tagTask = tag;
      this.modelEditForm.sendType = importTag;
      this.importType = importType;
    },
    // 上传文件
    handleChangeFileList(info: any) {
      let fileList = [...info.fileList];
      // 从响应读取并显示文件名称
      fileList = fileList.map(file => {
        if (file.response) {
          file.name = file.response.data.fileName;
        }
        return file;
      });
      this.fileList = fileList;
      if (info.file.status === "done") {
        // 成功后调用赋值到phoneFilePath
        let files = [];
        files = this.fileList.map((file:any) => {
          if (file.response) {
            file.name = file.response.data.fileName;
          }
          return file.name;
        });
        this.modelEditForm.phoneFilePath = files.toString();
      }
    },
    // 修改详情
    updateTask(record: any, tag: string) {
      this.tagTask = tag;
      record.smsTypeId =
        record.smsType == "通知" ? "1" : record.smsType == "验证码" ? "2" : "3";
      this.modal2Visible = true;
      this.modelEditForm = record;
      record.phoneFilePath.split(",").map((e: any) => {
        return this.fileList.push({ name: e });
      });
    },
    // 录入/导入 任务
    sendTaskForInput() {
      const modalForm: any = this.$refs.modalForm;
      modalForm
        .validate()
        .then(() => {
          // console.log("values", this.modelEditForm);
          if (this.tagTask === "add") {
            /** @参数
             *  taskName: null,
             *  sendTaskid: null,
             *  merchantId: null,
             *  signatureId: null,
             *  smsSignature: "",
             *  templateId: null,
             *  templateContent: "",
             *  templateParam: null,
             *  phoneNumbers: null,
             *  smsContent: null,
             *  sendType: null, //input,import
             *  phoneFilePath: null,
             *  phoneNumbersText: null,
             *  smsType: "通知",
             *  status: "waiting_for_send", //waiting_for_send：待执行  send_success：执行完成  send_failed：执行失败
             *  remark: null,
             *  phoneCount: null,
             *  operator: null,
             *  createTime: null,
             *  updateTime: null,
             *  contactGroupIds: "",
             */
            // 删减了一些参数！！感觉像是没错的!!!
            const datas: any = {
              merchantId: this.merchantId,
              operator: this.loginName,
              phoneNumbers: this.modelEditForm.phoneNumbers,
              phoneNumbersText: this.modelEditForm.phoneNumbers,
              phoneFilePath: this.modelEditForm.phoneFilePath,
              sendType: this.modelEditForm.sendType,
              templateParam: "[]",
              smsSignature: this.modelEditForm.smsSignature,
              smsType:
                this.modelEditForm.smsTypeId == "1"
                  ? "通知"
                  : this.modelEditForm.smsTypeId == "2"
                  ? "验证码"
                  : "营销",
              smsTypeId: this.modelEditForm.smsTypeId,
              status: "waiting_for_send",
              taskName: this.modelEditForm.taskName,
              taskType: this.modelEditForm.taskType,
              templateContent: this.modelEditForm.templateContent,
              taskSendTime: this.modelEditForm.taskSendTime
            };
            API.messageOneAPI
              .insertSendTaskForInput(datas)
              .then((res: any) => {
                if (res.result == "success") {
                  this.modal2Visible = false;
                  message.success({
                    content: "新增成功"
                  });
                  this.handleGetSendTaskList();
                } else {
                  message.error({
                    content: "新增失败,请稍后再试！"
                  });
                }
              })
              .catch(e => {
                console.log(e);
                message.error({
                  content: "新增失败，请稍后再试！"
                });
              });
          } else {
            // 也不知道这些参数用不用的上！！！！
            const params = {
              contactGroupIds: "",
              contactsData: [],
              createTime: this.modelEditForm.createTime,
              merchantId: this.merchantId,
              operator: this.loginName,
              phoneCount: this.modelEditForm.phoneCount,
              phoneNumbers: this.modelEditForm.phoneNumbers,
              phoneNumbersText: this.modelEditForm.phoneNumbers,
              phoneFilePath: this.modelEditForm.phoneFilePath,
              sendTaskid: this.modelEditForm.sendTaskid,
              sendType: this.modelEditForm.sendType,
              smsContent: "",
              smsSignature: this.modelEditForm.smsSignature,
              smsType:
                this.modelEditForm.smsTypeId == "1"
                  ? "通知"
                  : this.modelEditForm.smsTypeId == "2"
                  ? "验证码"
                  : "营销",
              smsTypeId: this.modelEditForm.smsTypeId,
              status: "waiting_for_send",
              taskName: this.modelEditForm.taskName,
              taskSendTime: this.modelEditForm.taskSendTime,
              taskType: this.modelEditForm.taskType,
              templateContent: this.modelEditForm.templateContent,
              templateNumber: "",
              templateParam: "[]",
              updateTime: this.modelEditForm.updateTime
            };
            API.messageOneAPI
              .updateSendTaskForInput(params)
              .then((res: any) => {
                if (res.result == "success") {
                  this.modal2Visible = false;
                  message.success({
                    content: "修改成功"
                  });
                  this.handleGetSendTaskList();
                } else {
                  message.error({
                    content: "修改失败,请稍后再试！"
                  });
                }
              })
              .catch(e => {
                console.log(e);
                message.error({
                  content: "修改失败，请稍后再试！"
                });
              });
          }
        })
        .catch((e:any) => {
          message.error({
            content: "请填写完整内容"
          });
          console.log("error", e);
        });
    },
    // 执行短信任务
    startSendTask(record: any) {
      const sendTaskid = {
        sendTaskid: record.sendTaskid
      };
      API.messageOneAPI
        .startSendTask(sendTaskid)
        .then((res: any) => {
          if (res.result == "success") {
            this.modal2Visible = false;
            notification["success"]({
              message: "执行短信成功",
              duration: 5,
              description: res.data.result.resultMessage
            });
            this.handleGetSendTaskList();
          } else {
            notification["error"]({
              message: "执行短信任务失败",
              duration: 0,
              description: res.data.result.resultMessage
            });
            this.handleGetSendTaskList();
          }
        })
        .catch(e => {
          console.log(e);
          message.error({
            content: "执行短信任务失败，请稍后再试！！"
          });
        });
    },
    // getContactGroupList
    getContactGroupList() {
      this.modal3Visible = true;
      // getContactGroupList
      const params = {
        adminId: this.adminId,
        contactName: this.contactName,
        loginName: this.loginName,
        merchantId: this.merchantId,
        pageNum: this.modalCurrent,
        pageSize: this.modalPageSize,
        userId: this.userId
      };
      API.messageOneAPI
        .getContactGroupList(params)
        .then((res: any) => {
          if (res.result == "success") {
            console.log("ffff", res);
            this.modalTabelData = res.data.rows;
            this.modalPageSize = res.data.pageSize;
            this.modalCurrent = res.data.pageNum;
            this.modalTotal = res.data.total;
          } else {
            message.error({
              content: "请稍后再试！"
            });
          }
        })
        .catch(e => {
          console.log(e);
          message.error({
            content: "系统异常，请稍后再试！"
          });
        });
    },
    // 选择群组
    onSelectChange(selectedRowKeys: never[]) {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },
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
  .operationClass{
    color: #1890ff;
  }
  &-Operation{
    button{
      margin-right: 12px;
      margin-bottom: 12px;
    }
  }
}
.send_doing{
  color: #1890ff;
  font-weight: 600;
}
.send_success{
  color: rgba(68,185,11,1);
  font-weight: 600;
}
.send_failed{
  color: rgba(245,34,45,1);
  font-weight: 600;
}
.timePickerForm{
  display: inline-block;
  margin-left: 1rem;
}
</style>
