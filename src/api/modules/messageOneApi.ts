
/*
 * 短信发送
 */
import services from "../../utils/axios/http";
import base from "./base"; // 导入接口域名列表

// 定义参数类型
type paramsType = {
  [key: string]: any;
};

const messageOneAPI = {
  // 获取在线发送信息列表
  getSendTaskList(params: paramsType) {
    return services.post(`${base.baseURL}/sendtask/getSendTaskList`, params, {
      headers: { "Content-Type": "application/json" }
    });
  },
  // 识别敏感词 keywordUser/validateKeywordBan
  validateKeywordBan(params: paramsType) {
    return services.post(`${base.baseURL}/keywordUser/validateKeywordBan`, params, {
      headers: { "Content-Type": "application/json" }
    });
  },
  // 任务名称识别
  validateTaskNameRepeat(params: paramsType) {
    return services.post(`${base.baseURL}/sendtask/validateTaskNameRepeat`, params, {
      headers: { "Content-Type": "application/json" }
    });
  },
  // 新增短信任务/sendtask/insertSendTaskForInput
  insertSendTaskForInput(params: paramsType) {
    return services.post(`${base.baseURL}/sendtask/insertSendTaskForInput`, params, {
      headers: { "Content-Type": "application/json" }
    });
  },
  // 修改更新短信任务sendtask/updateSendTaskForInput
  updateSendTaskForInput(params: paramsType) {
    return services.post(`${base.baseURL}/sendtask/updateSendTaskForInput`, params, {
      headers: { "Content-Type": "application/json" }
    });
  },
  // 执行短信任务 sendtask/startSendTask
  startSendTask(params: paramsType) {
    return services.post(`${base.baseURL}/sendtask/startSendTask`, params, {
      headers: { "Content-Type": "application/json" }
    });
  },
  // 获取客户名称列表 /MangerPub/getSonMerchantList
  getSonMerchantList(params: paramsType) {
    return services.post(`${base.baseURL}/MangerPub/getSonMerchantList`, params, {
      headers: { "Content-Type": "application/json" }
    });
  },
  // 获取任务名称 /MangerPub/getTaskNameList
  getTaskNameList(params: paramsType) {
    return services.post(`${base.baseURL}/MangerPub/getTaskNameList`, params, {
      headers: { "Content-Type": "application/json" }
    });
  },
  // 获取发送列表 getEsSmsSendLogList --------------------------base2
  getEsSmsSendLogList(params: paramsType) {
    return services.post(`${base.baseURL2}/getEsSmsSendLogList`, params, {
      headers: { "Content-Type": "application/json" }
    });
  },
  // 查看导出任务 exportTask/getExportTaskList
  getExportTaskList(params: paramsType) {
    return services.post(`${base.baseURL}/exportTask/getExportTaskList`, params, {
      headers: { "Content-Type": "application/json" }
    });
  },
  // 上行查询 api/1.0/getSmsUpList
  getSmsUpList(params: paramsType) {
    return services.post(`${base.baseURL2}/getSmsUpList`, params, {
      headers: { "Content-Type": "application/json" }
    });
  },
  //获取联系人表 contactGroup/getContactGroupList
  getContactGroupList(params: paramsType) {
    return services.post(`${base.baseURL}/contactGroup/getContactGroupList`, params, {
      headers: { "Content-Type": "application/json" }
    });
  },
};

export default messageOneAPI;