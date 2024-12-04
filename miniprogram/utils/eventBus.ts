type EventHandler = (...args: any[]) => void;

interface EventMap {
  [key: string]: EventHandler[];
}

class EventBus {
  private events: EventMap = {};

  on(event: string, handler: EventHandler): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    
    if (!this.events[event].includes(handler)) {
      this.events[event].push(handler);
    }
  }

  off(event: string, handler: EventHandler): void {
    if (!this.events[event]) {
      return;
    }

    const index = this.events[event].indexOf(handler);
    if (index > -1) {
      this.events[event].splice(index, 1);
    }

    if (this.events[event].length === 0) {
      delete this.events[event];
    }
  }

  emit(event: string, ...args: any[]): void {
    if (!this.events[event]) {
      return;
    }

    this.events[event].forEach(handler => {
      try {
        handler(...args);
      } catch (error) {
        console.error(`Error in event handler for ${event}:`, error);
      }
    });
  }

  clear(): void {
    this.events = {};
  }

  getEventCount(event: string): number {
    return this.events[event]?.length || 0;
  }
}

export default EventBus;