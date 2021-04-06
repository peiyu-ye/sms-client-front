<template>
  <div
    :class="className"
    ref="canvas"
    :style="{ height: height, width: width }"
  ></div>
</template>

<script lang="ts">
import echarts from "echarts";
import { defineComponent } from "vue";
import "echarts/lib/chart/line";
export default defineComponent({
  props: {
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "200px"
    },
    xData: {
      type: [Array, Object],
      default: [] as any
    }, // x轴数据
    seriesData: {
      type: [Array, Object],
      default: [] as any
    }, // 主要显示的数据
    title: {
      // 标题
      type: String,
      default: ""
    },
    legend: [Array, Object],
    color: {
      type: [Array, Object],
      default: [
        "#c23531",
        "#2f4554",
        "#61a0a8",
        "#d48265",
        "#91c7ae",
        "#749f83",
        "#ca8622",
        "#bda29a",
        "#6e7074",
        "#546570",
        "#c4ccd3"
      ] as any
    }
  },
  data() {
    return {};
  },
  updated() {
    this.draw();
  },
  watch: {
    seriesData() {
      this.draw();
    },
    xData() {
      this.draw();
    }
  },
  mounted() {
    this.draw();
  },
  methods: {
    draw() {
      const tagCanvas = this.$refs.canvas as HTMLCanvasElement;
      const myChart = echarts.init(tagCanvas);
      // const data: any = this.seriesData;
      const legend: any = this.legend;
      myChart.setOption({
        color: this.color,
        title: {
          text: this.title
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          // data: ["邮件营销", "联盟广告", "视频广告", "直接访问", "搜索引擎"]
          data: legend
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          feature: {
            // 下载为图片
            saveAsImage: {}
          }
        },
        dataZoom: [
          {
            show: false,
            realtime: true,
            start: 0,
            end: 100
          },
          {
            type: "inside",
            realtime: true,
            start: 0,
            end: 100
          }
        ],
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.xData
        },
        yAxis: {
          type: "value"
        },
        series: this.seriesData
      });
    }
  }
});
</script>
