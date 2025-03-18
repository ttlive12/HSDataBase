type EventListener = (...args: any[]) => void;

class EventBus {
  private listeners: { [key: string]: EventListener[] } = {};

  // 订阅事件
  on(event: string, listener: EventListener): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);

    // 返回取消订阅的函数
    return () => this.off(event, listener);
  }

  // 只订阅一次事件
  once(event: string, listener: EventListener): () => void {
    const onceWrapper = (...args: any[]) => {
      listener(...args);
      this.off(event, onceWrapper);
    };

    return this.on(event, onceWrapper);
  }

  // 发布事件
  emit(event: string, ...args: any[]): void {
    const listeners = this.listeners[event];
    if (listeners) {
      // 创建副本以防在回调中修改监听器数组
      [...listeners].forEach((listener) => listener(...args));
    }
  }

  // 取消订阅事件
  off(event: string, listener: EventListener): void {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event] = this.listeners[event].filter((l) => l !== listener);
  }

  // 取消订阅特定事件的所有监听器
  offAll(event: string): void {
    if (event) {
      delete this.listeners[event];
    } else {
      this.listeners = {};
    }
  }
}

export default EventBus;
