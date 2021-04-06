<template>
  <div class="pageContent">
    <div class="pageTop">
      <a-tabs>
        <a-tab-pane key="1" tab="主账户充值记录"></a-tab-pane>
      </a-tabs>
    </div>
    <div class="pageMain">
      <a-table
        :loading="loading"
        :columns="columns"
        :data-source="tabelData"
        rowKey="index"
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
        <template #amount="{ record }">
          <span class="rmbClass">{{ "￥ " + record.amount }}</span>
        </template>
      </a-table>
    </div>
    <div class="pageBottom"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import API from "../../api/api";
import { dealNumber } from "@/utils/index";
export default defineComponent({
  components: {},
  data() {
    return {
      loading: false,
      pageSize: 15,
      current: 1,
      total: 0,
      pageSizeOptions: ["30", "50", "100", "200"],
      columns: [
        // {
        //   width: 100,
        //   title: "序号",
        //   dataIndex: "index",
        //   key: "index",
        //   align: "center"
        // },
        {
          title: "充值时间",
          dataIndex: "createDate",
          key: "createDate",
          align: "center",
          sorter: true
        },
        {
          title: "充值类型",
          dataIndex: "tradeType",
          key: "tradeType",
          align: "center"
        },
        {
          title: "充值金额",
          dataIndex: "amount",
          key: "amount",
          align: "center",
          slots: { customRender: "amount" }
        }
      ],
      orderBy: "createDate desc",
      tabelData: [
        {
          index: 1,
          amount: "",
          createDate: "",
          tradeType: ""
        }
      ] //表格数据
    };
  },
  created() {
    this.handlerGetDatainfo();
  },
  methods: {
    handlerGetDatainfo() {
      this.loading = true;
      const info: any = sessionStorage.getItem("userInfoEntity");
      // const adminId: any = JSON.parse(info).adminId;
      const merchantId: any = JSON.parse(info).merchantId;
      const datas: any = {
        pageNum: this.current,
        pageSize: this.pageSize,
        status: "-1",
        merchantId: merchantId,
        orderBy: this.orderBy,
        adminId: null
      };
      this.tabelData = [];
      API.userAPI
        .getSupAccount(datas)
        .then((res: any) => {
          if (res.result == "success") {
            this.total = res.data.total;
            this.current = res.data.pageNum;
            this.pageSize = res.data.pageSize;
            res.data.rows.forEach((e: any, i: number) => {
              this.tabelData.push({
                index: i + 1,
                amount: dealNumber(e.amount),
                createDate: e.createDate,
                tradeType: e.tradeType
              });
            });
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
          this.orderBy = "createDate asc";
        } else {
          this.orderBy = "createDate desc";
        }
      }
      this.current = pagination.current;
      this.pageSize = pagination.pageSize;
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
