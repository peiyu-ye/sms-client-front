
/*
 * 短信发送
 */
import services from "../../utils/axios/http";
import base from "./base"; // 导入接口域名列表

// 定义参数类型
type paramsType = {
  [key: string]: any;
};

const businessStatisticsAPI = {
  // 获取统计数据getDaySmsCountList
  getDaySmsCountList(params: paramsType) {
    return services.post(`${base.baseURL2}/getDaySmsCountList`, params, {
      headers: { "Content-Type": "application/json" }
    });
  },
};

export default businessStatisticsAPI;