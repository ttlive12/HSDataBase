import { RequestOption, OfflineRequest, BatchRequestItem } from './type';

// 环境配置
const ENV = {
  PROD: 'https://tlumbbmnnlhg.sealosgzg.site',
  TEST: 'https://enhjvirnfvlm.sealosgzg.site',
};

const BaseUrl = ENV.TEST;

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
  requestUrl?: string;
  requestMethod?: string;

  constructor(message: string, statusCode?: number, url?: string, method?: string) {
    super(message);
    this.name = 'RequestError';
    this.errMsg = message;
    this.statusCode = statusCode;
    this.requestUrl = url;
    this.requestMethod = method;
  }
}

const showErrorMessage = (error: RequestError | WxRequestError) => {
  wx.showToast({
    title: error.errMsg || '系统错误',
    icon: 'none',
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

    // 每次设置缓存时，有10%的概率清理过期缓存
    if (Math.random() < 0.1) {
      this.clearExpiredCache();
    }
  }

  // 清除所有过期缓存
  clearExpiredCache(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp >= this.DEFAULT_EXPIRE_TIME) {
        this.cache.delete(key);
      }
    }
  }

  // 清除特定URL的缓存
  clearUrlCache(url: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(url)) {
        this.cache.delete(key);
      }
    }
  }

  // 清除所有缓存
  clearAllCache(): void {
    this.cache.clear();
  }
}

// 网络状态管理
class NetworkManager {
  private static instance: NetworkManager;
  private isConnected: boolean = true;
  private listeners: Array<(isConnected: boolean) => void> = [];

  private constructor() {
    // 初始化时获取网络状态
    wx.getNetworkType({
      success: (res) => {
        this.isConnected = res.networkType !== 'none';
      },
    });

    // 监听网络状态变化
    wx.onNetworkStatusChange((res) => {
      const previousState = this.isConnected;
      this.isConnected = res.isConnected;

      // 只有在状态变化时通知监听器
      if (previousState !== this.isConnected) {
        this.notifyListeners();
      }
    });
  }

  static getInstance(): NetworkManager {
    if (!NetworkManager.instance) {
      NetworkManager.instance = new NetworkManager();
    }
    return NetworkManager.instance;
  }

  // 获取当前网络状态
  getIsConnected(): boolean {
    return this.isConnected;
  }

  // 添加网络状态变化监听器
  addListener(callback: (isConnected: boolean) => void): void {
    this.listeners.push(callback);
  }

  // 移除网络状态变化监听器
  removeListener(callback: (isConnected: boolean) => void): void {
    this.listeners = this.listeners.filter((listener) => listener !== callback);
  }

  // 通知所有监听器
  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.isConnected));
  }
}

// 解析URL查询参数的辅助函数（替代URLSearchParams）
const parseQueryString = (queryString: string): Record<string, string> => {
  const params: Record<string, string> = {};
  if (!queryString) {
    return params;
  }

  // 将查询字符串按&分割
  const pairs = queryString.split('&');

  for (const pair of pairs) {
    // 按=分割键值对
    const [key, value] = pair.split('=');
    if (key) {
      // 解码URI组件
      params[decodeURIComponent(key)] = value ? decodeURIComponent(value) : '';
    }
  }

  return params;
};

// 请求队列管理（用于处理 429 Too Many Requests 错误）
class RequestQueue {
  private static instance: RequestQueue;
  private queue: Array<{
    options: RequestOption;
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
    priority: number;
  }> = [];
  private processing: boolean = false;
  private rateLimitMap: Map<string, { lastRequest: number; count: number }> = new Map();
  // 每个域名每分钟允许的最大请求数
  private readonly MAX_REQUESTS_PER_MINUTE = 100;
  // 两次请求之间的最小间隔（毫秒）
  private readonly MIN_REQUEST_INTERVAL = (60 * 1000) / this.MAX_REQUESTS_PER_MINUTE;
  // 当收到429错误时增加的延迟（毫秒）
  private readonly RATE_LIMIT_BACKOFF = 5000;
  // 批处理的时间窗口（毫秒）
  private readonly BATCH_WINDOW = 50;
  private batchTimer: number | null = null;
  private batchRequests: Map<
    string,
    Array<{
      request: { path: string; params: Record<string, string> };
      resolve: (value: any) => void;
      reject: (reason?: any) => void;
    }>
  > = new Map();

  private constructor() {}

  static getInstance(): RequestQueue {
    if (!RequestQueue.instance) {
      RequestQueue.instance = new RequestQueue();
    }
    return RequestQueue.instance;
  }

  // 将请求加入队列
  enqueue(options: RequestOption, priority: number = 0): Promise<any> {
    return new Promise((resolve, reject) => {
      // 检查是否是可批处理的GET请求
      if (options.method === 'GET' && this.isBatchableRequest(options.url)) {
        return this.enqueueBatchRequest(options, resolve, reject);
      }

      this.queue.push({
        options,
        resolve,
        reject,
        priority,
      });

      // 按优先级排序（高优先级在前）
      this.queue.sort((a, b) => b.priority - a.priority);

      if (!this.processing) {
        this.processQueue();
      }
    });
  }

  // 检查请求是否可以批处理
  private isBatchableRequest(url: string): boolean {
    // 服务端支持的批处理路径
    const batchablePaths = [
      '/getRanksData',
      '/getDecksData',
      '/getRankDetails',
      '/getDeckDetails',
      '/getDeckCardStats',
      '/getConfigData',
    ];

    return batchablePaths.some((path) => url.startsWith(path));
  }

  // 将请求加入批处理队列
  private enqueueBatchRequest(
    options: RequestOption,
    resolve: (value: any) => void,
    reject: (reason?: any) => void
  ): void {
    // 从URL中提取路径和参数
    const url = options.url;
    // 提取问号前的路径部分
    const path = url.includes('?') ? url.substring(0, url.indexOf('?')) : url;
    // 提取参数部分
    let params: Record<string, string> = {};
    if (url.includes('?')) {
      const queryPart = url.substring(url.indexOf('?') + 1);
      // 使用自定义函数解析查询参数
      params = parseQueryString(queryPart);
    }

    // 如果options.data存在，将其合并到params
    if (options.data) {
      // 确保data中的值都转换为字符串
      const dataParams: Record<string, string> = {};
      for (const key in options.data) {
        if (Object.prototype.hasOwnProperty.call(options.data, key)) {
          dataParams[key] = String(options.data[key]);
        }
      }
      params = { ...params, ...dataParams };
    }

    // 批处理分组依据，可以根据实际需求调整
    const batchKey = 'default';

    if (!this.batchRequests.has(batchKey)) {
      this.batchRequests.set(batchKey, []);
    }

    this.batchRequests.get(batchKey)!.push({
      request: {
        path,
        params,
      },
      resolve,
      reject,
    });

    // 设置定时器，在短时间内收集多个请求后一次性发送
    if (this.batchTimer === null) {
      this.batchTimer = setTimeout(() => {
        this.processBatchRequests();
        this.batchTimer = null;
      }, this.BATCH_WINDOW) as unknown as number;
    }
  }

  // 处理批量请求
  private processBatchRequests(): void {
    for (const [_, requests] of this.batchRequests.entries()) {
      if (requests.length === 0) {
        continue;
      }

      // 如果只有一个请求，不使用批处理
      if (requests.length === 1) {
        const { request, resolve, reject } = requests[0];
        this.queue.push({
          options: {
            url: request.path,
            method: 'GET',
            data: request.params,
          },
          resolve,
          reject,
          priority: 5, // 给予一定的优先级
        });

        if (!this.processing) {
          this.processQueue();
        }
        continue;
      }

      // 准备批处理请求
      const batchRequests = requests.map((item) => item.request);

      // 构建批处理请求
      this.queue.push({
        options: {
          url: '/batch',
          method: 'GET',
          data: {
            requests: JSON.stringify(batchRequests),
          },
        },
        resolve: (response) => {
          if (response.success && response.results) {
            // 将批处理响应分配给各个原始请求
            requests.forEach((req, index) => {
              if (index < response.results.length) {
                req.resolve(response.results[index]);
              } else {
                req.reject(new RequestError('批处理响应结果数量不匹配', 500));
              }
            });
          } else {
            // 批处理请求失败，所有原始请求都拒绝
            requests.forEach((req) => {
              req.reject(
                new RequestError(response.message || '批处理请求失败', response.statusCode)
              );
            });
          }
        },
        reject: (error) => {
          // 批处理请求失败，所有原始请求都拒绝
          requests.forEach((req) => {
            req.reject(error);
          });
        },
        priority: 5, // 给予一定的优先级
      });

      if (!this.processing) {
        this.processQueue();
      }
    }

    // 清空批处理队列
    this.batchRequests.clear();
  }

  // 处理队列中的请求
  private processQueue(): void {
    if (this.queue.length === 0) {
      this.processing = false;
      return;
    }

    this.processing = true;
    const nextRequest = this.queue.shift();

    if (!nextRequest) {
      this.processing = false;
      return;
    }

    // 检查是否需要进行限流
    const domain = BaseUrl;
    const now = Date.now();
    let rateLimitInfo = this.rateLimitMap.get(domain);

    if (!rateLimitInfo) {
      rateLimitInfo = { lastRequest: 0, count: 0 };
      this.rateLimitMap.set(domain, rateLimitInfo);
    }

    // 计算需要等待的时间
    let waitTime = 0;

    // 如果上一次请求的时间加上最小间隔时间大于当前时间，则需要等待
    if (rateLimitInfo.lastRequest + this.MIN_REQUEST_INTERVAL > now) {
      waitTime = rateLimitInfo.lastRequest + this.MIN_REQUEST_INTERVAL - now;
    }

    // 执行请求（可能在延迟后）
    setTimeout(() => {
      // 更新速率限制信息
      rateLimitInfo!.lastRequest = Date.now();
      rateLimitInfo!.count++;

      // 1分钟后重置计数
      setTimeout(() => {
        const info = this.rateLimitMap.get(domain);
        if (info) {
          info.count = Math.max(0, info.count - 1);
        }
      }, 60000);

      // 执行请求
      executeRequest(nextRequest.options)
        .then(nextRequest.resolve)
        .catch((error) => {
          // 如果是 429 错误，将请求重新加入队列并增加延迟
          if (error.statusCode === 429) {
            console.log('收到 429 错误，将在延迟后重试请求');
            setTimeout(() => {
              this.queue.push(nextRequest);
            }, this.RATE_LIMIT_BACKOFF);
          } else {
            nextRequest.reject(error);
          }
        })
        .finally(() => {
          // 安排处理下一个请求
          setTimeout(() => {
            this.processQueue();
          }, this.MIN_REQUEST_INTERVAL);
        });
    }, waitTime);
  }
}

// 离线请求管理
class OfflineRequestManager {
  private static instance: OfflineRequestManager;
  private offlineRequests: OfflineRequest[] = [];
  private readonly STORAGE_KEY = 'offline_requests';
  private readonly MAX_OFFLINE_REQUESTS = 100; // 最大保存的离线请求数量
  private isProcessing = false;

  private constructor() {
    this.loadOfflineRequests();

    // 监听网络状态变化
    NetworkManager.getInstance().addListener((isConnected) => {
      if (isConnected) {
        this.processOfflineRequests();
      }
    });
  }

  static getInstance(): OfflineRequestManager {
    if (!OfflineRequestManager.instance) {
      OfflineRequestManager.instance = new OfflineRequestManager();
    }
    return OfflineRequestManager.instance;
  }

  // 加载保存的离线请求
  private loadOfflineRequests(): void {
    try {
      const savedRequests = wx.getStorageSync(this.STORAGE_KEY);
      if (savedRequests) {
        this.offlineRequests = JSON.parse(savedRequests);
      }
    } catch (error) {
      console.error('加载离线请求失败:', error);
      // 如果加载失败，重置离线请求
      this.offlineRequests = [];
    }
  }

  // 保存离线请求到本地存储
  private saveOfflineRequests(): void {
    try {
      wx.setStorageSync(this.STORAGE_KEY, JSON.stringify(this.offlineRequests));
    } catch (error) {
      console.error('保存离线请求失败:', error);
    }
  }

  // 添加离线请求
  addOfflineRequest(options: RequestOption): void {
    // 仅保存 GET 和 POST 请求
    if (options.method !== 'GET' && options.method !== 'POST') {
      return;
    }

    // 检查是否已存在相同的请求
    const existingIndex = this.offlineRequests.findIndex(
      (item) =>
        item.options.url === options.url &&
        item.options.method === options.method &&
        JSON.stringify(item.options.data) === JSON.stringify(options.data)
    );

    if (existingIndex !== -1) {
      // 更新现有请求的时间戳
      this.offlineRequests[existingIndex].timestamp = Date.now();
    } else {
      // 添加新的离线请求
      this.offlineRequests.push({
        options,
        timestamp: Date.now(),
      });

      // 如果超过最大数量，删除最旧的请求
      if (this.offlineRequests.length > this.MAX_OFFLINE_REQUESTS) {
        this.offlineRequests.sort((a, b) => a.timestamp - b.timestamp);
        this.offlineRequests = this.offlineRequests.slice(-this.MAX_OFFLINE_REQUESTS);
      }
    }

    this.saveOfflineRequests();
  }

  // 处理所有离线请求
  processOfflineRequests(): void {
    if (this.isProcessing || this.offlineRequests.length === 0) {
      return;
    }

    this.isProcessing = true;

    console.log(`开始处理 ${this.offlineRequests.length} 个离线请求`);

    // 复制一份离线请求列表
    const requestsToProcess = [...this.offlineRequests];
    // 清空当前列表
    this.offlineRequests = [];
    this.saveOfflineRequests();

    // 按时间顺序处理请求
    requestsToProcess.sort((a, b) => a.timestamp - b.timestamp);

    // 使用队列处理，避免一次性发送太多请求
    const processNext = (index: number) => {
      if (index >= requestsToProcess.length) {
        this.isProcessing = false;
        return;
      }

      const currentRequest = requestsToProcess[index];
      console.log(
        `处理离线请求 ${index + 1}/${requestsToProcess.length}: ${currentRequest.options.url}`
      );

      // 通过队列发送请求（低优先级）
      RequestQueue.getInstance()
        .enqueue(
          {
            ...currentRequest.options,
            // 避免显示错误和加载提示
            showError: false,
            showLoading: false,
          },
          1
        )
        .then(() => {
          console.log(`离线请求成功: ${currentRequest.options.url}`);
        })
        .catch((error) => {
          console.log(`离线请求失败: ${currentRequest.options.url}`, error);
          // 如果仍然失败，重新添加到离线请求（除非是4xx错误）
          if (!error.statusCode || error.statusCode < 400 || error.statusCode >= 500) {
            this.addOfflineRequest(currentRequest.options);
          }
        })
        .finally(() => {
          // 处理下一个请求
          setTimeout(() => {
            processNext(index + 1);
          }, 1000); // 间隔1秒处理下一个请求
        });
    };

    processNext(0);
  }
}

// 增强的请求函数
const request = <T extends ApiResponse>({
  url,
  method = 'GET',
  data,
  header = {},
  showError = true,
  showLoading = false,
  varLabs,
  maxRetries = 2, // 最大重试次数
  priority = 0, // 请求优先级，数字越大优先级越高
  ignoreOffline = false, // 是否忽略离线处理
}: RequestOption): Promise<T> => {
  const cache = RequestCache.getInstance();
  const networkManager = NetworkManager.getInstance();
  const requestQueue = RequestQueue.getInstance();
  const offlineManager = OfflineRequestManager.getInstance();

  // 处理请求选项
  const options: RequestOption = {
    url,
    method,
    data,
    header,
    showError,
    showLoading,
    varLabs,
    maxRetries,
  };

  // 如果当前没有网络连接，并且不忽略离线处理
  if (!networkManager.getIsConnected() && !ignoreOffline) {
    // 把请求保存到离线队列
    offlineManager.addOfflineRequest(options);

    return Promise.reject(
      new RequestError('当前无网络连接，请求已保存，将在网络恢复后自动执行', undefined, url, method)
    );
  }

  // 尝试获取缓存
  const cachedData = cache.get<T>(url, method, data);
  if (cachedData) {
    // 返回缓存数据
    wx.reportEvent('wxdata_perf_monitor', {
      ...varLabs,
      wxdata_perf_error_code: 0,
      wxdata_perf_error_msg: 'success from cache',
      wxdata_perf_cost_time: 0,
    });
    return Promise.resolve(cachedData);
  }

  showLoading && wx.showLoading({ title: '加载中' });

  // 通过请求队列发送请求，实现限流
  return requestQueue
    .enqueue(options, priority)
    .then((result) => {
      showLoading && wx.hideLoading();
      return result as T;
    })
    .catch((error) => {
      showLoading && wx.hideLoading();
      throw error;
    });
};

// 实际执行请求的函数（被RequestQueue调用）
const executeRequest = <T extends ApiResponse>(options: RequestOption): Promise<T> => {
  const {
    url,
    method = 'GET',
    data,
    header = {},
    showError = true,
    showLoading = false,
    varLabs,
    maxRetries = 2,
  } = options;

  const cache = RequestCache.getInstance();

  // 实现请求重试逻辑
  const doRequest = (retryCount = 0): Promise<T> => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();

      wx.request({
        method,
        url: BaseUrl + url,
        data,
        header: {
          'Content-Type': 'application/json',
          ...header,
        },
        success(res: WechatMiniprogram.RequestSuccessCallbackResult<ApiResponse>) {
          const costTime = Date.now() - startTime;

          if (res.data.success) {
            // 成功时缓存响应数据
            cache.set(url, method, data, res.data);

            wx.reportEvent('wxdata_perf_monitor', {
              ...varLabs,
              wxdata_perf_error_code: 0,
              wxdata_perf_error_msg: 'success',
              wxdata_perf_cost_time: costTime,
            });

            resolve(res.data as T);
          } else {
            wx.reportEvent('wxdata_perf_monitor', {
              ...varLabs,
              wxdata_perf_error_code: res.statusCode || 1,
              wxdata_perf_error_msg: res.data?.message || '业务处理失败',
              wxdata_perf_cost_time: costTime,
            });

            const error = new RequestError(
              res.data?.message || '请求失败',
              res.statusCode,
              url,
              method
            );
            reject(error);
          }
        },
        fail(err) {
          const costTime = Date.now() - startTime;
          const errCode = (err as any).errCode;

          // 如果是网络中断错误，并且还有重试次数，则进行重试
          if (errCode === 600003 && retryCount < maxRetries) {
            console.log(`网络中断，正在进行第${retryCount + 1}次重试...`);
            // 使用指数退避策略计算延迟时间
            const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
            setTimeout(() => {
              doRequest(retryCount + 1)
                .then(resolve)
                .catch(reject);
            }, delay);
            return;
          }
          // 对于其他类型的错误，如果还有重试次数，也进行重试
          else if (retryCount < maxRetries) {
            console.log(`请求失败，正在进行第${retryCount + 1}次重试...`);
            // 线性增加延迟时间
            setTimeout(
              () => {
                doRequest(retryCount + 1)
                  .then(resolve)
                  .catch(reject);
              },
              1000 * (retryCount + 1)
            );
            return;
          }

          wx.reportEvent('wxdata_perf_monitor', {
            ...varLabs,
            wxdata_perf_error_code: errCode || -1,
            wxdata_perf_error_msg: err.errMsg || '网络请求失败',
            wxdata_perf_cost_time: costTime,
          });

          // 如果是网络中断错误，添加到离线请求队列
          if (errCode === 600003) {
            OfflineRequestManager.getInstance().addOfflineRequest(options);
          }

          showError && showErrorMessage(err);
          const error = new RequestError(err.errMsg || '网络请求失败', undefined, url, method);
          reject(error);
        },
        complete() {
          showLoading && wx.hideLoading();
        },
      });
    });
  };

  return doRequest();
};

// 批量请求函数
const batchRequests = <T>(requests: BatchRequestItem[]): Promise<Array<T>> => {
  if (requests.length === 0) {
    return Promise.resolve([]);
  }

  // 如果只有一个请求，直接使用单个请求
  if (requests.length === 1) {
    const { path, params } = requests[0];
    return request<{ success: boolean } & T>({
      url: path,
      method: 'GET',
      data: params,
      priority: requests[0].priority || 0,
    }).then((res) => [res]);
  }

  // 最多支持10个请求
  if (requests.length > 10) {
    const chunks = [];
    for (let i = 0; i < requests.length; i += 10) {
      chunks.push(requests.slice(i, i + 10));
    }

    return Promise.all(chunks.map((chunk) => batchRequests<T>(chunk))).then((results) =>
      results.flat()
    );
  }

  // 发送批量请求
  return request<{ success: boolean; results: Array<T> }>({
    url: '/batch',
    method: 'GET',
    data: {
      requests: JSON.stringify(requests),
    },
    // 使用请求中最高的优先级
    priority: Math.max(...requests.map((r) => r.priority || 0)),
  }).then((response) => {
    if (response.success && response.results) {
      return response.results;
    }
    throw new RequestError('批量请求处理失败');
  });
};

// 初始化
const initRequestSystem = () => {
  console.log('初始化请求系统');
  // 初始化网络状态管理
  NetworkManager.getInstance();
  // 初始化离线请求管理
  OfflineRequestManager.getInstance();
};

// 自动初始化
initRequestSystem();

export default request;
export { RequestQueue, NetworkManager, batchRequests };
