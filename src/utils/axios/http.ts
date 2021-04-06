/**
 * 对axios稍作封装
 * 1. 设置请求超时时间
 * 2. 添加请求拦截器，在每个请求的头部添加token
 * 3. 添加响应拦截器，根据服务器返回状态进行相应的结果返回
 */

import axiosObj, { AxiosRequestConfig, AxiosResponse } from "axios";
import store from "../../store";
import vuex from "vuex";
import { message } from "ant-design-vue";
const defaultConfig = {
  // 请求超时时间
  timeout: 10 * 1000,
  // 跨域请求时是否需要凭证
  withCredentials: true, // Check cross-site Access-Control
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    // 'Accept': 'application/json, text/plain, */*',
  },
};

/**
 * 请求失败后的错误统一处理，当然还有更多状态码判断，根据自己业务需求去扩展即可
 * @param status 请求失败的状态码
 * @param msg 错误信息
 */
const errorHandle = (status: number, msg: string) => {
  // 状态码判断
  switch (status) {
    // 401: 未登录状态，跳转登录页
    case 401:
      showMessage("用户未登录");
      // 跳转登录页
      break;
    // 403 token过期
    case 403:
      // 如果不需要自动刷新token，可以在这里移除本地存储中的token，跳转登录页
      showMessage("登录信息过期，请重新登录");
      logout();
      break;
    // 404请求不存在
    case 404:
      // 提示资源不存在
      showMessage("请求资源不存在");
      break;
    default:
      showMessage("请求数据失败,请稍后再试");
      console.log(msg);
  }
};

// 创建实例
const _axios = axiosObj.create(defaultConfig);

// 请求拦截器
_axios.interceptors.request.use(
  function(config: AxiosRequestConfig) {
    // 如果token存在就在请求头里添加
    const token = sessionStorage.getItem('token')
    // token && (config.headers.token = token);
   
    // if (localStorage.token) config.headers['token'] = localStorage.token // 让每个请求携带自定义token 请根据实际情况自行修改
    if (token){
      config.headers.Authorization = token;
    }
    return config
  },
  function(error) {
    // Do something with request error
    error.data = {};
    error.data.msg = "服务器异常";
    return Promise.reject(error);
  }
);
// 响应拦截器
_axios.interceptors.response.use(
  function(response: AxiosResponse) {
    const res = response.data;
    console.log("this:  ",res)
    if (res) {
      if (typeof res === "string") {
        return res;
      } else if (res.data && !res.err) {
        return res.data;
      } else if (res.data && res.err) {
        return Promise.reject(res);
      }
      res["Content-Type"] = "application/json;charset=UTF-8" //Content-Type: application/json;charset=UTF-8
      if (res.code === 100004 || res.code === 600) {
        showMessage("登陆信息过期 !");
        logout();
      } else if (res.code === 100033) {
        return res;
      } else if (res.code !== 100000 && res.msg) {
        showMessage(res.msg);
        return Promise.reject(res);
      } else {
        return res;
      }
    } else {
      return Promise.reject(res);
    }
  },
  function(error) {
    if (error) {
      // 请求已发出，但不在2xx范围内
      errorHandle(error.status, error.data.msg);
      return Promise.reject(error);
    } else {
      // 断网
      return Promise.reject(error);
    }
  }
);

//弹框
function showMessage(msg: any) {
  message.error({
    content: msg,
    duration: 4,
  });
}
// 登出
function logout() {
  sessionStorage.clear();
  location.reload();
}

export default _axios;
