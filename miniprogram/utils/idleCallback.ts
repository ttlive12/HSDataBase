/**
 * 微信小程序环境下模拟 requestIdleCallback 的简单实现
 * 在空闲时间执行回调函数，避免影响主线程
 *
 * @param callback 在空闲时执行的回调函数
 * @param options 配置选项
 * @returns 用于取消回调的id
 */
export function requestIdleCallback(
  callback: () => void,
  options: { timeout?: number } = {}
): number {
  const { timeout = 1000 } = options;

  // 使用setTimeout来模拟requestIdleCallback，默认延迟50ms执行
  // 这样可以让UI渲染和动画等主要任务先完成
  const id = setTimeout(() => {
    callback();
  }, 50);

  // 如果设置了超时，确保回调不会无限期等待
  if (timeout) {
    setTimeout(() => {
      clearTimeout(id);
    }, timeout);
  }

  return id as unknown as number;
}

/**
 * 取消之前通过requestIdleCallback注册的回调
 *
 * @param id 通过requestIdleCallback返回的id
 */
export function cancelIdleCallback(id: number): void {
  clearTimeout(id);
}
