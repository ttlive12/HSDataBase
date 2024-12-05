import { RequestOption } from "./type";

// 环境配置
const ENV = {
  PROD: "https://wcshxupboocw.sealosbja.site",
  TEST: "https://vqnemzapzfmm.sealosbja.site",
};

const BaseUrl = ENV.PROD;

type WxRequestError = WechatMiniprogram.GeneralCallbackResult & {
  errMsg?: string;
};

interface ApiResponse {
  message?: string;
  [key: string]: any;
}

class RequestError extends Error {
  statusCode?: number;
  errMsg: string;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = "RequestError";
    this.errMsg = message;
    this.statusCode = statusCode;
  }
}

const showErrorMessage = (error: RequestError | WxRequestError) => {
  wx.showToast({
    title: error.errMsg || "系统错误",
    icon: "none",
    duration: 2000,
  });
};

// 缓存接口
interface CacheData<T> {
  data: T;
  timestamp: number;
}

// 缓存管理类
class RequestCache {
  private static instance: RequestCache;
  private cache: Map<string, CacheData<any>>;
  private readonly DEFAULT_EXPIRE_TIME = 1800000; // 半小时，单位毫秒

  private constructor() {
    this.cache = new Map();
  }

  static getInstance(): RequestCache {
    if (!RequestCache.instance) {
      RequestCache.instance = new RequestCache();
    }
    return RequestCache.instance;
  }

  // 生成缓存key
  private generateCacheKey(url: string, method: string, data?: any): string {
    return `${method}:${url}:${JSON.stringify(data || {})}`;
  }

  // 获取缓存
  get<T>(url: string, method: string, data?: any): T | null {
    const key = this.generateCacheKey(url, method, data);
    const cached = this.cache.get(key);

    if (cached && Date.now() - cached.timestamp < this.DEFAULT_EXPIRE_TIME) {
      return cached.data;
    }

    // 清除过期缓存
    if (cached) {
      this.cache.delete(key);
    }
    return null;
  }

  // 设置缓存
  set<T>(url: string, method: string, data: any, response: T): void {
    const key = this.generateCacheKey(url, method, data);
    this.cache.set(key, {
      data: response,
      timestamp: Date.now(),
    });
  }
}

const request = <T extends ApiResponse>({
  url,
  method = "GET",
  data,
  header = {},
  showError = true,
  showLoading = false,
  varLabs,
}: RequestOption): Promise<T> => {
  const startTime = Date.now();
  const cache = RequestCache.getInstance();

  // 尝试获取缓存
  const cachedData = cache.get<T>(url, method, data);
  if (cachedData) {
    // 返回缓存数据
    wx.reportEvent("wxdata_perf_monitor", {
      ...varLabs,
      wxdata_perf_error_code: 0,
      wxdata_perf_error_msg: "success from cache",
      wxdata_perf_cost_time: 0,
    });
    return Promise.resolve(cachedData);
  }

  showLoading && wx.showLoading({ title: "加载中" });

  return new Promise((resolve, reject) => {
    wx.request({
      method,
      url: BaseUrl + url,
      data,
      header: {
        "Content-Type": "application/json",
        ...header,
      },
      success(
        res: WechatMiniprogram.RequestSuccessCallbackResult<ApiResponse>
      ) {
        const costTime = Date.now() - startTime;

        if (res.data.success) {
          // 成功时缓存响应数据
          cache.set(url, method, data, res.data);

          wx.reportEvent("wxdata_perf_monitor", {
            ...varLabs,
            wxdata_perf_error_code: 0,
            wxdata_perf_error_msg: "success",
            wxdata_perf_cost_time: costTime,
          });

          resolve(res.data as T);
        } else {
          wx.reportEvent("wxdata_perf_monitor", {
            ...varLabs,
            wxdata_perf_error_code: res.statusCode || 1,
            wxdata_perf_error_msg: res.data?.message || "业务处理失败",
            wxdata_perf_cost_time: costTime,
          });

          const error = new RequestError(
            res.data?.message || "请求失败",
            res.statusCode
          );
          reject(error);
        }
      },
      fail(err) {
        const costTime = Date.now() - startTime;
        wx.reportEvent("wxdata_perf_monitor", {
          ...varLabs,
          wxdata_perf_error_code: -1,
          wxdata_perf_error_msg: err.errMsg || "网络请求失败",
          wxdata_perf_cost_time: costTime,
        });

        showError && showErrorMessage(err);
        const error = new RequestError(err.errMsg || "网络请求失败");
        reject(error);
      },
      complete() {
        showLoading && wx.hideLoading();
      },
    });
  });
};

export default request;
