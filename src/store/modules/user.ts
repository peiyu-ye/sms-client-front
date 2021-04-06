import API from "../../api/api";

const state = {
  worker: {},
  roles: [],
};

const mutations = {
  SET_WORKER: (state: any, worker: any) => {
    state.worker = worker;
  },
  SET_ROLES: (state: any, roles: any) => {
    state.roles = roles;
  },
};

const actions = {
  // get user info
  getInfo({commit, state}:any) {
    const params =  sessionStorage.getItem("userInfoEntity");
    // console.log("params:", params)
    const demoData = [
      {
        "hotkey": null,
        "linkUrl": null,
        "logoUrrl": "",
        "mobileIcon": null,
        "nodeName": "用户中心",
        "nodeNumber": "YHZX",
        parentNodePid: "-1",
        permissionList: "guest",
        routeUrl: null,
        showMobile: "0",
        sortposition: 1,
        treeMenuId: "002",
        type: "用户中心",
        valid: "1"
      },
      {
        hotkey: null,
        linkUrl: null,
        logoUrrl: "",
        mobileIcon: null,
        nodeName: "短信发送",
        nodeNumber: "DXFS",
        parentNodePid: "-1",
        permissionList: "guest",
        routeUrl: null,
        showMobile: "0",
        sortposition: 3,
        treeMenuId: "010",
        type: "短信发送",
        valid: "1"
      },
      {
        hotkey: null,
        linkUrl: null,
        logoUrrl: "",
        mobileIcon: null,
        nodeName: "业务统计",
        nodeNumber: "YWTJ",
        parentNodePid: "-1",
        permissionList: "guest",
        routeUrl: null,
        showMobile: "0",
        sortposition: 4,
        treeMenuId: "004",
        type: "业务统计",
        valid: "1"
      },
      {
        hotkey: null,
        linkUrl: null,
        logoUrrl: "",
        mobileIcon: null,
        nodeName: "个人信息",
        nodeNumber: "GRZL",
        parentNodePid: "002",
        permissionList: "guest",
        routeUrl: "mangerconsole/usercenter/userInfo",
        showMobile: "0",
        sortposition: 2,
        treeMenuId: "002002",
        type: "用户中心",
        valid: "1"
      },
      {
        hotkey: null,
        linkUrl: "",
        logoUrrl: "",
        mobileIcon: "iconfont icon-luru",
        nodeName: "充值记录",
        nodeNumber: "CZJL",
        parentNodePid: "002",
        permissionList: "guest",
        routeUrl: "mangerconsole/usercenter/masterAccountChargeRecord",
        showMobile: "0",
        sortposition: 8,
        treeMenuId: "002008",
        type: "用户中心",
        valid: "1"
      },
      {
        hotkey: null,
        linkUrl: null,
        logoUrrl: "",
        mobileIcon: null,
        nodeName: "发送量统计",
        nodeNumber: "GRFSLTJ",
        parentNodePid: "004",
        permissionList: "guest",
        routeUrl: "mangerconsole/usercenter/userStaList",
        showMobile: "0",
        sortposition: 1,
        treeMenuId: "004001",
        type: "业务统计",
        valid: "1"
      },
      {
        hotkey: null,
        linkUrl: null,
        logoUrrl: "",
        mobileIcon: null,
        nodeName: "在线发送",
        nodeNumber: "ZXFDX",
        parentNodePid: "010",
        permissionList: "guest",
        routeUrl: "mangerconsole/configuration/sendTaskList",
        showMobile: "0",
        sortposition: 1,
        treeMenuId: "010001",
        type: "配置管理",
        valid: "1"
      },
      {
        hotkey: null,
        linkUrl: null,
        logoUrrl: "",
        mobileIcon: null,
        nodeName: "发送查询",
        nodeNumber: "DXFSCX",
        parentNodePid: "010",
        permissionList: "guest",
        routeUrl: "mangerconsole/usercenter/smsSendLogList",
        showMobile: "0",
        sortposition: 2,
        treeMenuId: "010002",
        type: "业务统计",
        valid: "1"
      },
      {
        hotkey: null,
        linkUrl: null,
        logoUrrl: "",
        mobileIcon: null,
        nodeName: "上行查询",
        nodeNumber: "SHSXDX",
        parentNodePid: "010",
        permissionList: "guest",
        routeUrl: "mangerconsole/usercenter/merchantSmsSendUpList",
        showMobile: "0",
        sortposition: 3,
        treeMenuId: "010003",
        type: "业务统计",
        valid: "1"
      },
      {
        hotkey: null,
        linkUrl: null,
        logoUrrl: "",
        mobileIcon: "iconfont icon-tongji2",
        nodeName: "联系人群组",
        nodeNumber: "LXRQZ",
        parentNodePid: "040",
        permissionList: "guest",
        routeUrl: "mangerconsole/contactsManagement/contactsGroupList",
        showMobile: "0",
        sortposition: 1,
        treeMenuId: "040001",
        type: "后台管理",
        valid: "1"
      }
    ];
    return new Promise((resolve, reject) => {
      API.loginAPI
        .getInfo(params)
        .then((response:any) => {
          const { data } = response;
          console.log("response---------data:      ", data);
          if (!data || response.result!=="success") {
            reject("获取信息失败，请重新登录");
          } else {
            const menus = data.map((item: any) => item.nodeNumber)
            const actions: any[] = [];
            data.forEach((e: any) => {
              // 这里的父节点为-1的时候是没连接的
              e.parentNodePid!=="-1"&&actions.push(e.routeUrl)
            });
            // menus must be a non-empty array
            if (!data || data.length <= 0) {
              reject("此账号无任何页面权限");
            } else {
              if (process.env.NODE_ENV === "development"){
                commit("SET_ROLES", [
                  ...menus,
                  ...actions,
                  "development"
                ]);
              } else {
                commit("SET_ROLES", [
                  ...menus,
                  ...actions,
                ]);
              }
              const worker:any = sessionStorage.getItem("userInfoEntity")
              commit("SET_WORKER", worker);
              sessionStorage.workerId = worker.userId;
              resolve(state.roles);
            }
          }
        })
        .catch((error) => {
          console.log("getInfo: error")
          const menus = demoData.map((item: any) => item.nodeNumber)
            const actions: any[] = [];
            demoData.forEach((e: any) => {
              // 这里的父节点为-1的时候是没连接的
              e.parentNodePid!=="-1"&&actions.push(e.routeUrl)
            });
            // menus must be a non-empty array
            if (!demoData || demoData.length <= 0) {
              reject("此账号无任何页面权限");
            } else {
              if (process.env.NODE_ENV === "development"){
                commit("SET_ROLES", [
                  ...menus,
                  ...actions,
                  "development"
                ]);
              } else {
                commit("SET_ROLES", [
                  ...menus,
                  ...actions,
                ]);
              }
              const worker:any = sessionStorage.getItem("userInfoEntity")
              commit("SET_WORKER", worker);
              sessionStorage.workerId = worker.userId;
              resolve(state.roles);
            }
          // reject(error);
        });
    });
  },
  // user logout
  logout() {
    sessionStorage.clear();
    location.reload();
  },

  // remove token
  toLogin() {
    // localStorage.token = "";
    sessionStorage.clear();
    location.reload();
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
