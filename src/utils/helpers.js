export const getEl = (selector) => document.querySelector(selector);

export const addListener = ({ target, type = 'click', callback }) => {
  getEl(target).addEventListener(type, callback);
};

export const removeListener = ({ target, type = 'click', callback }) => {
  getEl(target).removeEventListener(type, callback);
};

export const addListeners = (listeners) => {
  listeners.map((listener) =>
    addListener({
      target: listener.target,
      type: listener.type,
      callback: listener.callback,
    }),
  );
};

export const removeListeners = (listeners) => {
  return listeners.map((listener) =>
    removeListener({
      target: listener.target,
      type: listener.type,
      callback: listener.callback,
    }),
  );
};

export const insertHtmlToDOM = ({ targetSelector, render, position = 'beforeend' }) => {
  getEl(targetSelector).insertAdjacentHTML(position, render());
};

export const attachChildElement = ({ target, position, element }) => {
  switch (position) {
    case 'afterend':
      target.after(element);
      break;
    case 'beforebegin':
      target.before(element);
      break;
    case 'prepend':
      target.prepend(element);
      break;
    default:
      target.append(element);
  }
};
