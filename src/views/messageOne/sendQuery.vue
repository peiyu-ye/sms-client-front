<template>
  <div class="pageContent">
    <div class="pageTop">
      <a-tabs>
        <a-tab-pane key="1" tab="发送量统计"></a-tab-pane>
      </a-tabs>
      <div class="alert-info">
        <div class="alert-info-title">
          <InfoCircleOutlined style="color: rgba(251,150,0,1)" /> 温馨提示：
          <CaretUpOutlined
            v-show="toggle"
            @click="toggle = !toggle"
            style="position: absolute;right: 1rem;"
          />
          <CaretDownOutlined
            v-show="!toggle"
            @click="toggle = !toggle"
            style="position: absolute;right: 1rem;"
          />
        </div>
        <div class="alert-info-sapn" v-show="toggle">
          1、系统目前仅支持查询最近35天内的发送短信数据。<br />
          2、由于短信数据量庞大，我们建议您进行精确查询！比如通过电话号码查询，或查询某一个小时内的短信数据等。<br />
          3、为了保证为您提供更好更快速的系统信息服务，短信发送信息导出功能开放时间段为：每天晚9:
          00 ~ 早 10: 00 。
        </div>
      </div>
      <div class="topBottomSearch">
        <a-row>
          <a-col :span="20" class="searchRow">
            <p class="searchHead">
              <label>任务名称：</label>
              <a-select
                v-model:value="taskId"
                style="width: 200px"
                placeholder="请选择任务名称"
                :dropdownMenuStyle="{
                  'max-height': '200px'
                }"
                @focus="getTaskNameList"
              >
                <template v-for="(option, i) in taskNameList" :key="i">
                  <a-select-option :value="option.value" :label="option.label">
                    {{ option.label }}
                  </a-select-option>
                </template>
              </a-select>
            </p>
            <p class="searchHead">
              <label>选择时间：</label>
              <a-range-picker
                v-model:value="searchDateTime"
                format="YYYY-MM-DD HH:mm"
                valueFormat="YYYY-MM-DD HH:mm"
                :showTime="{
                  format: 'HH:mm'
                }"
                :placeholder="['开始时间', '结束时间']"
                @ok="onPick"
                :allowClear="false"
              />
            </p>
            <p class="searchHead">
              <label>手机号码: </label>
              <a-input
                v-model:value="phoneNumbers"
                placeholder="根据手机号码查询"
                style="width: 200px"
              />
            </p>
            <p class="searchHead">
              <label>短信内容：</label>
              <a-input
                v-model:value="smsContent"
                placeholder="根据短信内容查询"
                style="width: 200px"
              />
            </p>
            <p class="searchHead">
              <label>短信状态：</label>
              <a-select
                v-model:value="status"
                style="width: 150px"
                placeholder="请选择短信状态"
              >
                <a-select-option value="-1" label="全部">全部</a-select-option>
                <a-select-option value="0" label="提交成功">
                  提交成功
                </a-select-option>
                <a-select-option value="-99" label="提交失败">
                  提交失败
                </a-select-option>
                <a-select-option value="10" label="送达成功">
                  送达成功
                </a-select-option>
                <a-select-option value="11" label="送达失败">
                  送达失败
                </a-select-option>
              </a-select>
            </p>
            <p class="searchHead">
              <label>运营商：</label>
              <a-select
                v-model:value="carrieroperator"
                style="width: 150px"
                placeholder="请选择运营商"
              >
                <a-select-option value="-1" label="全部">全部</a-select-option>
                <a-select-option value="中国移动" label="中国移动">
                  中国移动
                </a-select-option>
                <a-select-option value="中国电信" label="中国电信">
                  中国电信
                </a-select-option>
                <a-select-option value="中国联通" label="中国联通">
                  中国联通
                </a-select-option>
                <a-select-option value="其他" label="其他">
                  其他
                </a-select-option>
              </a-select>
            </p>
            <p class="searchHead" v-if="parentId == '0'">
              <label>客户名称：</label>
              <a-select
                v-model:value="subMerchantNumber1"
                style="width: 200px"
                placeholder="请选择运营商"
                :dropdownMenuStyle="{
                  'max-height': '200px'
                }"
                @focus="getSonMerchantList"
              >
                <template v-for="(option, i) in merchantNameList" :key="i">
                  <a-select-option :value="option.value" :label="option.label">
                    {{ option.label }}
                  </a-select-option>
                </template>
              </a-select>
            </p>
          </a-col>
          <a-col :span="2" :offset="1">
            <a-button
              type="primary"
              @click="handlerGetDatainfo"
              style="margin-bottom: 1rem;"
            >
              查询
            </a-button>
            <a-dropdown>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="1" @click="getExportTaskList">
                    查看导出任务
                  </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item key="2" @click="exportSmsTaskList('csv', 'gbk')">
                    导出 *.csv 文件(GBK)
                  </a-menu-item>
                  <a-menu-item
                    key="3"
                    @click="exportSmsTaskList('csv', 'utf-8')"
                  >
                    导出 *.csv 文件(UTF-8)
                  </a-menu-item>
                </a-menu>
              </template>
              <a-button type="primary">
                <DownloadOutlined />
                导出数据
                <DownOutlined />
              </a-button>
            </a-dropdown>
          </a-col>
        </a-row>
      </div>
    </div>
    <div class="pageMain">
      <a-table
        :loading="loading"
        :columns="columns"
        :data-source="tabelData"
        rowKey="upStreamOrderId"
        size="middle"
        show-size-changer
        :scroll="{ x: 800, y: 520 }"
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
        <template #recvMessage="{ record }">
          <span
            :class="
              record.recvMessage.substring(0, 4) == '送达失败'
                ? '_failed'
                : record.recvMessage.substring(0, 4) == '送达成功'
                ? '_success'
                : ''
            "
          >
            {{ record.recvMessage.substring(0, 4) }}
          </span>
        </template>
      </a-table>
    </div>
    <!-- 弹框 -->
    <a-modal
      v-model:visible="modalVisible"
      title="短信导出任务"
      style="top: 20%;"
      :width="700"
      cancelText=""
      @ok="modalVisible = false"
    >
      <div class="modelSearchHead">
        <p>
          <span class="searchHead">
            <label>检索内容: </label>
            <a-input
              v-model:value="searchContent"
              placeholder="请输入查询内容"
              style="width: 300px"
            />
          </span>
          <a-button type="primary" @click="getExportTaskList">
            查询
          </a-button>
        </p>
        <a-table
          :loading="modalLoading"
          :columns="modalColumns"
          :data-source="modalTabelData"
          rowKey="taskName"
          size="middle"
          show-size-changer
          :scroll="{ x: 600, y: 300 }"
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
          <template #exportStatus="{ record }">
            <span
              :class="
                record.exportStatus == 'export_doing'
                  ? '_doing'
                  : record.exportStatus == 'export_success'
                  ? '_success'
                  : record.exportStatus == 'export_fail'
                  ? '_failed'
                  : ''
              "
            >
              {{
                record.exportStatus == "export_doing"
                  ? "执行中..."
                  : record.exportStatus == "export_success"
                  ? "执行成功"
                  : record.exportStatus == "export_fail"
                  ? "执行失败"
                  : "执行中"
              }}
            </span>
          </template>
          <template #operation="{ record }">
            <a-popconfirm title="导出" @confirm="onDelete(record)">
              <a>导出</a>
            </a-popconfirm>
            <a-divider type="vertical" />
            <a-popconfirm title="删除" @confirm="onDelete(record)">
              <a class="tipText_error">删除</a>
            </a-popconfirm>
          </template>
        </a-table>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  InfoCircleOutlined,
  DownloadOutlined,
  DownOutlined,
  CaretUpOutlined,
  CaretDownOutlined
} from "@ant-design/icons-vue";
import { message, notification } from "ant-design-vue";
import API from "../../api/api";
import { parseTime } from "@/utils/index";
export default defineComponent({
  components: {
    InfoCircleOutlined,
    DownloadOutlined,
    DownOutlined,
    CaretUpOutlined,
    CaretDownOutlined
  },
  data() {
    return {
      toggle: true,
      loading: false,
      modalLoading: false,
      modalVisible: false,
      pageSize: 10,
      current: 1,
      total: 0,
      modalPageSize: 5,
      modalCurrent: 1,
      modalTotal: 0,
      pageSizeOptions: ["20", "50", "100", "200"],
      modalPageSizeOptions: ["10", "25", "50", "100"],
      searchDateTime: [
        parseTime(new Date(), "{y}-{m}-{d} 00:00"),
        parseTime(new Date(), "{y}-{m}-{d} 23:59")
      ], //日期
      taskId: 0, //任务名称
      subMerchantNumber1: "", //客户名称
      phoneNumbers: "", //手机号码
      smsContent: "", //短信内容
      status: "-1", //短信状态
      carrieroperator: "-1", //运营商
      parentId: "",
      merchantId: "",
      taskNameList: [
        {
          value: 0,
          label: "全部"
        }
      ],
      merchantNameList: [
        {
          value: "all",
          label: "全部"
        }
      ],
      //手机号码	运营商	类型	时间  状态	发送内容
      columns: [
        {
          title: "手机号码",
          width: 180,
          dataIndex: "phoneNumbers",
          key: "phoneNumbers",
          align: "center"
        },
        {
          title: "运营商",
          width: 140,
          dataIndex: "carrieroperator",
          key: "carrieroperator",
          align: "center"
        },
        {
          title: "类型",
          width: 90,
          dataIndex: "smsType",
          key: "smsType",
          align: "center"
        },
        {
          title: "时间",
          width: 200,
          dataIndex: "requestAcceptTime",
          key: "requestAcceptTime",
          align: "center",
          sorter: true
        },
        {
          title: "状态",
          width: 180,
          dataIndex: "recvMessage",
          key: "recvMessage",
          align: "center",
          slots: { customRender: "recvMessage" }
        },
        {
          title: "发送内容",
          width: 440,
          dataIndex: "smsContent",
          key: "smsContent",
          align: "center"
        }
      ],
      orderBy: "requestProcessTime desc",
      tabelData: [
        {
          upStreamOrderId: "",
          phoneNumbers: "",
          carrieroperator: "",
          smsType: "",
          requestAcceptTime: "",
          recvMessage: "",
          smsContent: ""
        }
      ], //表格数据
      //任务名称	任务状态  创建人  操作
      modalColumns: [
        {
          title: "任务名称",
          dataIndex: "taskName",
          key: "taskName",
          align: "center"
        },
        {
          title: "任务状态",
          dataIndex: "exportStatus",
          key: "exportStatus",
          slots: { customRender: "exportStatus" },
          align: "center"
        },
        {
          title: "创建人",
          dataIndex: "operator",
          key: "operator",
          align: "center"
        },
        {
          title: "操作",
          align: "center",
          slots: { customRender: "operation" }
        }
      ],
      searchContent: null as string | null,
      modalTabelData: [
        {
          taskName: "",
          exportStatus: "export_doing",
          operator: "operator"
        }
      ]
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
      this.merchantId = JSON.parse(info).merchantId;
      this.parentId = JSON.parse(info).parentId;
      // null 的参数都不知道是干啥的
      const datas: any = {
        adminId: adminId,
        merchantId: this.merchantId,
        parentId: this.parentId,
        loginName: JSON.parse(info).loginName,
        merchantNumber: JSON.parse(info).merchantNumber,
        pageNum: this.current,
        pageSize: this.pageSize,
        beginTime: this.searchDateTime[0],
        endTime: this.searchDateTime[1],
        orderBy: this.orderBy,
        carrieroperator: this.carrieroperator,
        encode: "utf8",
        handingType: -1,
        merchantName: null,
        phoneNumbers: this.phoneNumbers,
        province: "全部",
        searchContent: null,
        searchParent: "false",
        smsContent: this.smsContent,
        status: this.status,
        subMerchantNumber: null,
        subMerchantNumber1: this.subMerchantNumber1,
        taskId: this.taskId,
        upStreamName: null
      };
      this.tabelData = [];
      API.messageOneAPI
        .getEsSmsSendLogList(datas)
        .then((res: any) => {
          if (res.result == "success") {
            this.total = res.data.total;
            this.current = res.data.pageNum;
            this.pageSize = res.data.pageSize;
            this.tabelData = res.data.rows;
            this.loading = false;
          } else {
            message.error({
              content: res.errorMessage,
              duration: 6
            });
            this.total = 0;
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
    changeTaskList(pagination: any, filters: any, sorter: any) {
      // console.log("sorter", sorter);
      if (sorter.order) {
        if (sorter.order === "ascend") {
          this.orderBy = sorter.columnKey + " asc";
        } else {
          this.orderBy = sorter.columnKey + " desc";
        }
      }
      this.current = pagination.current;
      this.pageSize = pagination.pageSize;
      this.handlerGetDatainfo();
    },
    // 时间选择
    onPick(value: any) {
      this.searchDateTime = value;
      this.handlerGetDatainfo();
    },
    getTaskNameList() {
      this.taskNameList = [
        {
          value: 0,
          label: "全部"
        }
      ];
      const params = {
        extCodeType: -1,
        interfaceType: null,
        isExlude: false,
        merchantId: this.merchantId,
        salesman: null,
        searchContent: null
      };
      API.messageOneAPI
        .getTaskNameList(params)
        .then((res: any) => {
          if (res.result == "success") {
            res.data.rows.forEach((e: any) => {
              this.taskNameList.push({
                value: e.taskId,
                label: e.taskName
              });
            });
          } else {
            message.error({
              content: "加载数据失败，请稍后再试！"
            });
          }
        })
        .catch(e => {
          console.log(e);
          message.error({
            content: "加载数据失败，请稍后再试！"
          });
        });
    },
    getSonMerchantList() {
      this.merchantNameList = [
        {
          value: "all",
          label: "全部"
        }
      ];
      const params = {
        merchantId: this.merchantId
      };
      API.messageOneAPI
        .getSonMerchantList(params)
        .then((res: any) => {
          if (res.result == "success") {
            res.data.rows.forEach((e: any) => {
              this.merchantNameList.push({
                value: e.merchantNumber,
                label: e.merchantName
              });
            });
          } else {
            message.error({
              content: "加载数据失败，请稍后再试！"
            });
          }
        })
        .catch(e => {
          console.log(e);
          message.error({
            content: "加载数据失败，请稍后再试！"
          });
        });
    },
    // 查看导出任务
    getExportTaskList() {
      this.modalVisible = true;
      const info: any = sessionStorage.getItem("userInfoEntity");
      const params = {
        adminId: JSON.parse(info).adminId,
        loginName: JSON.parse(info).loginName,
        pageNum: this.modalCurrent,
        pageSize: this.modalPageSize,
        beginTime: this.searchDateTime[0],
        endTime: this.searchDateTime[1],
        orderBy: "updateTime desc",
        exportType: null,
        exporttaskId: null,
        searchContent: this.searchContent,
        taskType: "smsLog"
      };
      API.messageOneAPI
        .getExportTaskList(params)
        .then((res: any) => {
          if (res.result == "success") {
            console.log("getExportTaskList: ", res);
            this.modalTabelData = res.data.rows;
            this.modalPageSize = res.data.pageSize;
            this.modalCurrent = res.data.pageNum;
            this.modalTotal = res.data.total;
          } else {
            message.error({
              content: "加载数据失败，请稍后再试！"
            });
          }
        })
        .catch(e => {
          console.log(e);
          message.error({
            content: "加载数据失败，请稍后再试！"
          });
        });
    },
    //导出表格
    exportSmsTaskList(type: string, format: string) {
      // console.log("exportSmsTaskList", type, format);
      const nowDate = new Date();
      const nowHour = nowDate.getHours();
      if (nowHour >= 8 && nowHour < 21) {
        notification.warning({
          message: "提示信息",
          description:
            "对不起，当前时间不能导出！导出功能开放时间段为：每天晚 9:00 ~ 早 8:00！"
        });
        return;
      }
      if (this.merchantId == null) {
        notification.warning({
          message: "提示信息",
          description:
            "当前查询条件数据范围太大，系统暂不支持！请先确认一个具体客戶后，再进行导出操作！"
        });
        return;
      }
    }
  }
});
</script>

<style lang="stylus" scoped>
.pageMain{
  .rmbClass{
    color: rgba(0, 0, 0, 0.6);
    font-weight: 600;
  }
}
</style>
