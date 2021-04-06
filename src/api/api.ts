/**
 * api统一出口
 *  将api接口根据功能划分为多个模块，利于多人开发，一个人负责一个模块的开发，方便每个模块中接口的命名
 * */

// 登录管理接口
import loginAPI from "./modules/loginApi";
import userAPI from "./modules/userCenterApi";
import messageOneAPI from "./modules/messageOneApi";
import businessStatisticsAPI from "./modules/businessStatisticsApi";
// 导出接口
export default {
  loginAPI,
  userAPI,
  messageOneAPI,
  businessStatisticsAPI
};
