<template>
  <div class="pageContent">
    <div class="pageTop">
      <a-tabs>
        <a-tab-pane key="1" tab="上行查询"></a-tab-pane>
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
          1、由于短信数据量庞大，我们建议您进行精确查询！比如通过电话号码查询，或查询某一个小时内的短信数据等；<br />
          2、系统目前仅支持查询最近7天内的发送短信数据。
        </div>
      </div>
      <div class="topBottomSearch">
        <a-row>
          <a-col :span="20" class="searchRow">
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
      <a-table
        :loading="loading"
        :columns="columns"
        :data-source="tabelData"
        rowKey="phoneNumbers"
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
      </a-table>
    </div>
    <div class="pageBottom"></div>
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
  components: {
    InfoCircleOutlined,
    CaretUpOutlined,
    CaretDownOutlined
  },
  data() {
    return {
      toggle: true,
      loading: false,
      pageSize: 20,
      current: 1,
      total: 0,
      pageSizeOptions: ["20", "50", "100", "200"],
      searchDateTime: [
        parseTime(new Date(), "{y}-{m}-{d} 00:00"),
        parseTime(new Date(), "{y}-{m}-{d} 23:59")
      ], // 日期
      phoneNumbers: "", // 手机号码
      smsContent: "", // 短信内容
      // 电话号码	扩展/下发号码	接收时间  上行短信内容
      columns: [
        {
          width: 180,
          title: "电话号码",
          dataIndex: "phoneNumbers",
          key: "phoneNumbers",
          align: "center"
        },
        {
          title: "	扩展/下发号码",
          dataIndex: "extCode",
          key: "extCode",
          align: "center"
        },
        {
          title: "接收时间",
          dataIndex: "recvDate",
          key: "recvDate",
          align: "center",
          sorter: true
        },
        {
          title: "上行短信内容",
          dataIndex: "content",
          key: "content",
          align: "center"
        }
      ],
      orderBy: "recvDate desc",
      tabelData: [
        {
          phoneNumbers: "",
          extCode: " ",
          recvDate: "",
          content: ""
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
        beginTime: "2020-12-21 00:00",
        endTime: "2020-12-21 09:59",
        merchantId: JSON.parse(info).merchantId,
        merchantNumber: JSON.parse(info).merchantNumber,
        orderBy: this.orderBy,
        pageNum: this.current,
        pageSize: this.pageSize,
        parentId: JSON.parse(info).parentId,
        phoneNumbers: this.phoneNumbers,
        searchParent: "false",
        smsContent: this.smsContent,
        status: "-1"
      };
      this.tabelData = [];
      API.messageOneAPI
        .getSmsUpList(datas)
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
    changeTaskList(pagination: any, filters: any, sorter: any) {
      if (sorter.order) {
        if (sorter.order === "ascend") {
          this.orderBy = "recvDate asc";
        } else {
          this.orderBy = "recvDate desc";
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
