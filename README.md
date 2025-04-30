# HS 卡牌大师小程序

### 性能优化

网络请求层
1. 请求Cache，队列（利用包wx-request-plus）
2. 请求重试
3. 接口预请求

代码体积
1. 图片使用svg，懒加载
2. 资源CDN
3. base64 -> url 减少包体积
4. 分包

体验侧
1. loading延迟
2. loading计数器防闪烁
3. 瀑布流
4. rankbar拖拽
5. 兜底错误页
  
### 业务侧
1. 埋点

### 后端
爬虫：axios => puppeteer => playwright
反爬虫：代理IP，请求头伪造，无头浏览器

数据选择：降级获取数据逻辑