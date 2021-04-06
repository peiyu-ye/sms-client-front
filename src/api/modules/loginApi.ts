/*
 * 登录接口
 * */
import services from "../../utils/axios/http";
import base from "./base"; // 导入接口域名列表

// 定义参数类型
type paramsType = {
  [key: string]: any;
};

const loginAPI = {
  // 登录
  login(params: paramsType) {
    return services.post(`${base.baseURL}/userLogin/merchantLogin`, params);
    // return services.post(`${base.baseURL}/userLogin/merchantLogin`, params);
    // return services.post(`${base.baseURL}/userLogin/merchantLogin`, params, {
    //   headers: { "Content-Type": "application/json" }
    // });
  },
  //获取当前用户权限信息
  getInfo(params:any) {
    return services.post(`${base.baseURL}/MangerPub/getTreeMenuList`, params, {
        // headers: { 
        //   "Content-Type": "application/json; charset=UTF-8",
        //   "Accept-Language": "zh-CN,zh;q=0.9,en;*;q=0.8"
        // }
      }
    );
  }
};

export default loginAPI;