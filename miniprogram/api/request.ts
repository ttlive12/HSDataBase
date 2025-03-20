import WxRequest from 'wx-request-plus';

// 环境配置
const ENV = {
  PROD: 'https://tlumbbmnnlhg.sealosgzg.site',
  TEST: 'https://enhjvirnfvlm.sealosgzg.site',
};

const wxRequest = WxRequest.create({
  baseURL: ENV.PROD,
  timeout: 4000,
  enableLoading: true,
  returnData: true,
});

wxRequest.interceptors.request.use((config) => {
  // 对GET请求默认启用强缓存
  if (config.method?.toUpperCase() === 'GET' && config.cache === undefined) {
    config.cache = 'force-cache';
    config.cacheExpire = 120000;
  }
  return config;
});

wxRequest.interceptors.response.use(
  (response) => {
    if (response.config?.varLabs) {
      wx.reportEvent('wxdata_perf_monitor', {
        ...response.config.varLabs,
        wxdata_perf_error_code: 0,
        wxdata_perf_error_msg: 'success',
      });
    }
    return response;
  },
  (error) => {
    if (error.config?.varLabs) {
      wx.reportEvent('wxdata_perf_monitor', {
        ...error.config.varLabs,
        wxdata_perf_error_code: error.status,
        wxdata_perf_error_msg: error.statusText,
      });
    }
    wx.showToast({
      title: error.statusText,
      icon: 'none',
    })
    return {
      success: false,
      ...error
    };
  }
);

export default wxRequest;
