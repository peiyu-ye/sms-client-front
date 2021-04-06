/*
 * 个人中心
 * */
import services from "../../utils/axios/http";
import base from "./base"; // 导入接口域名列表

// 定义参数类型
type paramsType = {
  [key: string]: any;
};

const userAPI = {
  // 获取个人信息
  getUserInfo(params: paramsType) {
    return services.post(`${base.baseURL}/MangerPub/getUserInfo`, params, {
      headers: { "Content-Type": "application/json" }
    });
  },
  // 更新个人信息
  updateMerchant(params: paramsType){
    return services.post(`${base.baseURL}/MangerPub/updateMerchant`, params, {
      headers: { "Content-Type": "application/json" }
    });
  },
  //主账户充值记录 
  getSupAccount(params: paramsType){
    return services.post(`${base.baseURL}/RechargeRecordSearch/getSupAccountRechargeRecords`, params, {
      headers: { "Content-Type": "application/json" }
    });
  },
  // 修改密码
  editPassword(params: paramsType){
    return services.post(`${base.baseURL}/MangerPub/editPassword`, params, {
      headers: { "Content-Type": "application/json" }
    });
  },
  // 获取账户统计数据(折线图) /getNewTotalCountDataBySmsType
  getDataBySmsType(params: paramsType){
    return services.post(`${base.baseURL2}/getNewTotalCountDataBySmsType`, params, {
      headers: { "Content-Type": "application/json" }
    });
  },

};

export default userAPI;