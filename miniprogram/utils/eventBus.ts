class EventBus {
  private listeners: { [key: string]: Function[] } = {};

  // 订阅事件
  on(event: string, listener: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
  }

  // 发布事件
  emit(event: string, ...args: any[]) {
    const listeners = this.listeners[event];
    if (listeners) {
      listeners.forEach(listener => listener(...args));
    }
  }

  // 取消订阅事件
  off(event: string, listener: Function) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(l => l !== listener);
  }
}

export default EventBus