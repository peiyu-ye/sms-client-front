<template>
  <div class="pageContent">
    <div class="pageTop">
      <a-tabs>
        <a-tab-pane key="1" tab="账户管理"></a-tab-pane>
      </a-tabs>
    </div>
    <div class="pageMain">
      <div class="pageMain-top">
        <div class="pageMain-top-selection">
          <a-radio-group v-model:value="smsTypeId" @change="radioOnChange">
            <a-radio-button value="0">
              全部
            </a-radio-button>
            <a-radio-button value="1">
              通知
            </a-radio-button>
            <a-radio-button value="3">
              营销
            </a-radio-button>
            <a-radio-button value="2">
              验证码
            </a-radio-button>
          </a-radio-group>
          <a-radio-group v-model:value="operatorType" @change="changeOperator">
            <a-radio-button value="allOperator">
              全部
            </a-radio-button>
            <a-radio-button value="cmcc">
              移动
            </a-radio-button>
            <a-radio-button value="cucc">
              联通
            </a-radio-button>
            <a-radio-button value="ctcc">
              电信
            </a-radio-button>
          </a-radio-group>
          <p>
            <span class="_doing">提交成功： {{ totalSubmitSuccessCount }}</span>
            <span class="_warning">
              提交失败： {{ totalSubmitFailedCount }}
            </span>
            <span class="_success">送达成功： {{ totalSuccessCount }}</span>
            <span class="_failed">送达失败： {{ totalFailedCount }}</span>
            <span>未知： {{ totalSubmitUnknownCount }}</span>
          </p>
        </div>
        <div class="pageMain-top-echarst">
          <lineStack
            height="300px"
            :seriesData="seriesData"
            :legend="legend"
            :color="color"
            :xData="xData"
          />
        </div>
      </div>
      <div class="pageMain-bottom">
        <a-divider orientation="left">
          当前月短信发送量单日统计
        </a-divider>
        <a-table
          :loading="loading"
          :columns="columns"
          :data-source="tabelData"
          rowKey="statisticalTime"
          size="middle"
          show-size-changer
          :scroll="{ x: 300, y: 700 }"
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
        </a-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import API from "../../api/api";
import lineStack from "@c/echarts/line-stack.vue";
import { parseTime } from "@/utils";
export default defineComponent({
  components: {
    lineStack
  },
  data() {
    return {
      smsTypeId: "0",
      operatorType: "allOperator",
      totalFailedCount: 0,
      totalSubmitFailedCount: 0,
      totalSubmitSuccessCount: 0,
      totalSubmitUnknownCount: 0,
      totalSuccessCount: 0,
      color: ["#1890ff", "#fb9600", "#44b90b", "#f5222d", "#8e8e8e"],
      legend: ["提交成功", "提交失败", "送达成功", "送达失败", "未知"],
      xData: [],
      seriesData: [
        {
          name: "提交成功",
          type: "line",
          stack: "总量",
          data: []
        },
        {
          name: "提交失败",
          type: "line",
          stack: "总量",
          data: []
        },
        {
          name: "送达成功",
          type: "line",
          stack: "总量",
          data: []
        },
        {
          name: "送达失败",
          type: "line",
          stack: "总量",
          data: []
        },
        {
          name: "未知",
          type: "line",
          stack: "总量",
          data: []
        }
      ],
      loading: false,
      searchDateTime: [
        parseTime(new Date(), "{y}-{m}-{d} 00:00:00"),
        parseTime(new Date(), "{y}-{m}-{d} 23:59:59")
      ],
      pageSize: 5,
      current: 1,
      total: 0,
      pageSizeOptions: ["10", "30", "60", "100"],
      // 日期 提交成功(条) 提交失败(条) 送达成功(条) 送达失败(条) 未知(条)
      columns: [
        {
          title: "日期",
          dataIndex: "statisticalTime",
          key: "statisticalTime",
          align: "center",
          sorter: true
        },
        {
          title: "提交成功(条) ",
          dataIndex: "submitSuccessCount",
          key: "submitSuccessCount",
          align: "center"
        },
        {
          title: "提交失败(条) ",
          dataIndex: "submitFailedCount",
          key: "submitFailedCount",
          align: "center"
        },
        {
          title: "送达成功(条)",
          dataIndex: "successCount",
          key: "successCount",
          align: "center"
        },
        {
          title: "送达失败(条)",
          dataIndex: "failedCount",
          key: "failedCount",
          align: "center"
        },
        {
          title: "未知(条)",
          dataIndex: "unknowCount",
          key: "unknowCount",
          align: "center"
        }
      ],
      orderBy: "statisticalTime desc",
      tabelData: [
        {
          failedCount: 3119,
          failedPercentStr: "94.8%",
          statisticalTime: "2020-12-21",
          submitFailedCount: 0,
          submitSuccessCount: 3290,
          successCount: 0,
          successPercentStr: "0%",
          unKnowPercentStr: "5.2%",
          unknowCount: 171
        }
      ] //表格数据
    };
  },
  created() {
    this.handlerGetDatainfo();
    this.getEcharstData();
  },
  methods: {
    // 获取折线图
    getEcharstData() {
      const info: any = sessionStorage.getItem("userInfoEntity");
      const datas: any = {
        adminId: JSON.parse(info).adminId,
        loginName: JSON.parse(info).loginName,
        merchantId: JSON.parse(info).merchantId,
        userId: JSON.parse(info).userId,
        beginTime: this.searchDateTime[0],
        endTime: this.searchDateTime[1],
        carrieroperator: "",
        fromSource: "db",
        operatorType: this.operatorType,
        pageNum: this.current,
        pageSize: this.pageSize,
        searchContent: null,
        smsTypeId: this.smsTypeId
      };
      this.xData = [];
      API.userAPI
        .getDataBySmsType(datas)
        .then((res: any) => {
          if (res.result == "success") {
            // console.log(res.data);
            this.xData = res.data.xAxisData;
            this.seriesData[0].data = res.data.submitSuccessData;
            this.seriesData[1].data = res.data.submitFailData;
            this.seriesData[2].data = res.data.sendSuccessData;
            this.seriesData[3].data = res.data.sendFailData;
            this.seriesData[4].data = res.data.submitUnknownData;
            this.totalFailedCount = res.data.totalFailedCount;
            this.totalSubmitFailedCount = res.data.totalSubmitFailedCount;
            this.totalSubmitSuccessCount = res.data.totalSubmitSuccessCount;
            this.totalSubmitUnknownCount = res.data.totalSubmitUnknownCount;
            this.totalSuccessCount = res.data.totalSuccessCount;
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
            content: "加载数据失败，请稍后再试！"
          });
          this.loading = false;
        });
    },
    // 获取表格
    handlerGetDatainfo() {
      this.loading = true;
      const now = new Date(); //当前日期
      const nowMonth = now.getMonth(); //当前月
      const nowYear = now.getFullYear(); //当前年
      const monthStartDate = new Date(nowYear, nowMonth, 1); //本月的开始时间
      const monthEndDate = new Date(nowYear, nowMonth + 1, 0); //本月的结束时间
      const info: any = sessionStorage.getItem("userInfoEntity");
      const datas: any = {
        adminId: JSON.parse(info).adminId,
        loginName: JSON.parse(info).loginName,
        merchantId: JSON.parse(info).merchantId,
        userId: JSON.parse(info).userId,
        beginTime: parseTime(monthStartDate, "{y}-{m}-{d} 00:00:00"),
        // beginTimeText: "2020-12-01",
        endTime: parseTime(monthEndDate, "{y}-{m}-{d} 59:59:59"),
        // endTimeText: "2020-12-31",
        orderBy: this.orderBy,
        pageNum: this.current,
        pageSize: this.pageSize,
        region: -1,
        // salesman: "全部",
        searchContent: null,
        showHuiZong: false,
        smsTypeId: this.smsTypeId,
        statisticalType: "day"
      }; //参数
      this.tabelData = [];
      API.businessStatisticsAPI
        .getDaySmsCountList(datas)
        .then((res: any) => {
          if (res.result == "success") {
            // console.log(res);
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
          this.loading = false;
        });
    },
    // 列表分页 --分页、排序、筛选变化时触发(pagination:any, filters:any, sorter:any, { currentDataSource }:any)
    changeTaskList(pagination: any, filters: any, sorter: any) {
      if (sorter.order) {
        if (sorter.order === "ascend") {
          this.orderBy = "statisticalTime asc";
        } else {
          this.orderBy = "statisticalTime desc";
        }
      }
      this.current = pagination.current;
      this.pageSize = pagination.pageSize;
      this.handlerGetDatainfo();
    },
    // 更改条件触发
    radioOnChange() {
      this.handlerGetDatainfo();
      this.getEcharstData();
    },
    changeOperator() {
      this.getEcharstData();
    }
  }
});
</script>

<style lang="stylus" scoped>
.pageMain{
  &-top{
    margin-bottom: 20px;
    .ant-radio-group{
      padding-right: 20px;
      margin-bottom: 20px;
    }
    p{
      span{
        padding-right: 24px;
      }
    }
    &-echarst{
      border: 1px solid #ddd;
      padding: 6px;
    }
  }
  .rmbClass{
    color: rgba(0, 0, 0, 0.6);
    font-weight: 600;
  }
}
</style>
