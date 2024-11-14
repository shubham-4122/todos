import EventEmitter from './EventEmitter';
import Store from './Store';

const eventsEmitter = new EventEmitter();

export const store = new Store({ eventsEmitter });

export const withStoreHOF = (component) => {
  return component(store);
};
