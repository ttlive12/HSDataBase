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

体验侧
1. loading延迟
2. loading计数器防闪烁
3. 瀑布流
4. rankbar拖拽
5. 兜底分析

### 业务侧
1. 埋点
