export default class EventEmitter {
  constructor() {
    this.listeners = new Map();
  }

  subscribe = (event, listener) => {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }

    this.listeners.get(event).push(listener);
  };

  unsubscribe = (event, listener) => {
    if (!this.listeners.has(event)) {
      throw new Error(`No listeners registered for event '${event}'`);
    }

    const listeners = this.listeners.get(event);
    const index = listeners.indexOf(listener);

    if (index === -1) {
      throw new Error(`Listener not found for event '${event}'`);
    }

    listeners.splice(index, 1);
    return true;
  };

  emit = (event, payload) => {
    if (!this.listeners.has(event)) {
      throw new Error(`No listeners registered for event '${event}'`);
    }

    const listeners = this.listeners.get(event);
    listeners.forEach((listener) => listener(payload));
  };
}
