<template>
  <div class="pageContent">
    <div class="pageTop">
      <a-tabs>
        <a-tab-pane key="1" tab="发送量统计"></a-tab-pane>
      </a-tabs>
      <div class="alert-info">
        <div class="alert-info-title">
          <InfoCircleOutlined />
          温馨提示：
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
          1、实时数据：只支持查询72个小时之内的数据，如您要查询72小时之前的数据，请选中“历史数据”标签后查询；<br />
          2、单天统计：请选择开始时间与结束时间为同一天；月统计：请选择开始时间为统计月的第一天，结束时间为统计月的最后一天；<br />
          3、范围限制：由于平台数据庞大，目前我们仅支持查询60天内的统计信息（历史数据下），给您带来的不变敬请谅解，如需更多查询数据请联系您的运营专员。
        </div>
      </div>
      <div class="topBottomSearch">
        <a-row>
          <a-col :span="20" class="searchRow">
            <p class="searchHead">
              <label>选择时间：</label>
              <a-range-picker
                v-model:value="searchDateTime"
                format="YYYY-MM-DD"
                valueFormat="YYYY-MM-DD HH:mm:ss"
                :placeholder="['开始时间', '结束时间']"
                @change="onPick"
                :allowClear="false"
              />
            </p>
            <p class="searchHead">
              <label>统计类型：</label>
              <a-select
                v-model:value="statisticalType"
                style="width: 150px"
                placeholder="请选择统计类型"
                @change="handlerGetDatainfo"
              >
                <a-select-option value="between" label="按时间范围">
                  按时间范围
                </a-select-option>
                <a-select-option value="day" label="按天">
                  按天
                </a-select-option>
              </a-select>
            </p>
          </a-col>
          <a-col :span="1" :offset="2">
            <a-button type="primary" @click="handlerGetDatainfo">
              查询
            </a-button>
          </a-col>
        </a-row>
      </div>
    </div>
    <div class="pageMain">
      <div class="alert-info" v-show="statisticalType == 'day'">
        <div class="alert-info-sapn">
          总计：
          <span class="_success">
            {{ "提交成功： " + totalSubmitSuccessCount }}
          </span>
          <span class="_failed">
            {{ "提交失败：" + totalSubmitFailedCount }}
          </span>
          <span class="_success">{{ "送达成功：" + totalSuccessCount }} </span>
          <span class="_failed">{{ "送达失败：" + totalFailedCount }}</span>
          <span class="_doing">{{ "未知：" + totalSubmitUnknowCount }} </span>
        </div>
      </div>
      <a-table
        :loading="loading"
        :columns="statisticalType == 'day' ? columns2 : columns"
        :data-source="tabelData"
        rowKey="failedCount"
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
        <template #statisticalTime="{ record }" v-if="statisticalType == 'day'">
          <span>{{ record.statisticalTime }}</span>
        </template>
        <template #successPercentStr="{ record }">
          <span class="_success">{{ record.successPercentStr }}</span>
        </template>
        <template #failedPercentStr="{ record }">
          <span class="_failed">{{ record.failedPercentStr }}</span>
        </template>
        <template #unKnowPercentStr="{ record }">
          <span class="_doing">{{ record.unKnowPercentStr }}</span>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  InfoCircleOutlined,
  CaretUpOutlined,
  CaretDownOutlined
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import API from "../../api/api";
import { parseTime } from "@/utils/index";
export default defineComponent({
  components: { InfoCircleOutlined, CaretUpOutlined, CaretDownOutlined },
  data() {
    return {
      toggle: true,
      loading: false,
      pageSize: 20,
      current: 1,
      total: 0,
      pageSizeOptions: ["20", "50", "100", "200"],
      searchDateTime: [
        parseTime(new Date(), "{y}-{m}-{d} 00:00:00"),
        parseTime(new Date(), "{y}-{m}-{d} 23:59:59")
      ], // 日期
      statisticalType: "between", // 统计类型
      totalFailedCount: 3113,
      totalRequestCount: null,
      totalSubmitFailedCount: 0,
      totalSubmitSuccessCount: 8796,
      totalSubmitUnknowCount: 5683,
      totalSuccessCount: 0,
      // 提交成功 提交失败 送达成功 送达失败 未知	成功率	失败率	未知率
      columns: [
        {
          title: "提交成功",
          dataIndex: "submitSuccessCount",
          key: "submitSuccessCount",
          align: "center"
        },
        {
          title: "提交失败",
          dataIndex: "submitFailedCount",
          key: "submitFailedCount",
          align: "center"
        },
        {
          title: "送达成功",
          dataIndex: "successCount",
          key: "successCount",
          align: "center"
        },
        {
          title: "送达失败",
          dataIndex: "failedCount",
          key: "failedCount",
          align: "center"
        },
        {
          title: "未知",
          dataIndex: "unknowCount",
          key: "unknowCount",
          align: "center"
        },
        {
          title: "成功率",
          dataIndex: "successPercentStr",
          key: "successPercentStr",
          align: "center",
          slots: { customRender: "successPercentStr" }
        },
        {
          title: "失败率",
          dataIndex: "failedPercentStr",
          key: "failedPercentStr",
          align: "center",
          slots: { customRender: "failedPercentStr" }
        },
        {
          title: "未知率",
          dataIndex: "unKnowPercentStr",
          key: "unKnowPercentStr",
          align: "center",
          slots: { customRender: "unKnowPercentStr" }
        }
      ],
      // 统计时间  提交成功 提交失败 送达成功 送达失败 未知	成功率	失败率	未知率
      columns2: [
        {
          title: "统计时间",
          dataIndex: "statisticalTime",
          key: "statisticalTime",
          align: "center",
          slots: { customRender: "statisticalTime" }
        },
        {
          title: "提交成功",
          dataIndex: "submitSuccessCount",
          key: "submitSuccessCount",
          align: "center"
        },
        {
          title: "提交失败",
          dataIndex: "submitFailedCount",
          key: "submitFailedCount",
          align: "center"
        },
        {
          title: "送达成功",
          dataIndex: "successCount",
          key: "successCount",
          align: "center"
        },
        {
          title: "送达失败",
          dataIndex: "failedCount",
          key: "failedCount",
          align: "center"
        },
        {
          title: "未知",
          dataIndex: "unknowCount",
          key: "unknowCount",
          align: "center"
        },
        {
          title: "成功率",
          dataIndex: "successPercentStr",
          key: "successPercentStr",
          align: "center",
          slots: { customRender: "successPercentStr" }
        },
        {
          title: "失败率",
          dataIndex: "failedPercentStr",
          key: "failedPercentStr",
          align: "center",
          slots: { customRender: "failedPercentStr" }
        },
        {
          title: "未知率",
          dataIndex: "unKnowPercentStr",
          key: "unKnowPercentStr",
          align: "center",
          slots: { customRender: "unKnowPercentStr" }
        }
      ],
      orderBy: "recvDate desc",
      tabelData: [
        {
          failedCount: 3105,
          failedPercentStr: "99.55%",
          submitFailedCount: 0,
          submitSuccessCount: 3119,
          successCount: 0,
          successPercentStr: "0%",
          unKnowPercentStr: "0.45%",
          unknowCount: 14,
          statisticalTime: ""
        }
      ] // 表格数据
    };
  },
  created() {
    this.handlerGetDatainfo();
  },
  methods: {
    handlerGetDatainfo() {
      this.loading = true;
      const info: any = sessionStorage.getItem("userInfoEntity");
      const datas: any = {
        dataFromSouce: "dataBaseStatistical",
        dataSource: "new",
        encode: "utf8",
        loginName: JSON.parse(info).loginName,
        merchantId: JSON.parse(info).merchantId,
        merchantName: JSON.parse(info).merchantName,
        merchantNumber: JSON.parse(info).merchantNumber,
        userId: JSON.parse(info).userId,
        region: -1,
        salesman: "全部",
        searchTypeFlag: "merchantStatistical",
        showHuiZong: true,
        pageNum: this.current,
        pageSize: this.pageSize,
        beginTime: this.searchDateTime[0],
        endTime: this.searchDateTime[1],
        statisticalType: this.statisticalType
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
            this.totalFailedCount = res.data.total_failedCount;
            this.totalRequestCount = res.data.total_requestCount;
            this.totalSubmitFailedCount = res.data.total_submitFailedCount;
            this.totalSubmitSuccessCount = res.data.total_submitSuccessCount;
            this.totalSubmitUnknowCount = res.data.total_submitUnknowCount;
            this.totalSuccessCount = res.data.total_successCount;
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
    changeTaskList(pagination: any) {
      this.current = pagination.current;
      this.pageSize = pagination.pageSize;
      this.handlerGetDatainfo();
    },
    // 时间选择
    onPick(value: any) {
      this.searchDateTime = value;
      this.handlerGetDatainfo();
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
