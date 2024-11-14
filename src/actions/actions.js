export const formActionSetInput = (payload) => ({
  type: 'form/setInput',
  payload,
});

export const filtersActionSwitch = (payload) => ({
  type: 'filters/switch',
  payload,
});

export const todoActionAdd = (payload) => ({
  type: 'todos/add',
  payload,
});

export const todoActionClear = (payload) => ({
  type: 'todos/clear',
  payload,
});

export const todoActionCheck = (payload) => ({
  type: 'todos/check',
  payload,
});

export const todoActionEditRequest = (payload) => ({
  type: 'todos/editRequest',
  payload,
});

export const todoActionEditSave = (payload) => ({
  type: 'todos/editSave',
  payload,
});

export const todoClearCompleted = (payload) => ({
  type: 'todos/clearCompleted',
  payload,
});

export const todoActionToggleAll = (payload) => ({
  type: 'todos/toggleAll',
  payload,
});
