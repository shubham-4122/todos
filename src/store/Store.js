import { cloneDeep } from 'lodash';

export default class Store {
  constructor({ eventsEmitter }) {
    this.eventsEmitter = eventsEmitter;

    this.prevState = null;

    this.state = {
      filtersProps: [
        {
          id: 0,
          name: 'all',
          title: 'All',
          href: '#/',
        },
        {
          id: 1,
          name: 'active',
          title: 'Active',
          href: '#/active',
        },
        {
          id: 2,
          name: 'completed',
          title: 'Completed',
          href: '#/completed',
        },
      ],
      form: {
        input: {
          value: '',
        },
        isUpdating: false,
        todoToUpdate: null,
      },
      activeTodosFilter: 'all',
      nextTodoId: 0,
      todos: {},
    };
  }

  getState = () => this.state;

  getPrevState = () => this.prevState;

  subscribe = (event, listener) => {
    return this.eventsEmitter.subscribe(event, listener);
  };

  unsubscribe = (event, listener) => {
    return this.eventsEmitter.unsubscribe(event, listener);
  };

  initUpdate = (event) => {
    this.history = this.saveStateToHistory(this.state);
    this.dispatchUpdate(event);
  };

  dispatchUpdate(event) {
    this.eventsEmitter.emit(event, this.state);
  }

  setPrevState = (state) => {
    return cloneDeep(state);
  };

  dispatch = (actions) => {
    this.prevState = this.setPrevState(this.state);

    actions.forEach((action) => {
      const { type, payload } = action();
      switch (type) {
        case 'todos/add':
          this.state = this.addTodo(this.state, payload);
          break;
        case 'todos/check':
          this.state = this.checkTodo(this.state, payload);
          break;
        case 'todos/clear':
          this.state = this.clearTodo(this.state, payload);
          break;
        case 'todos/editRequest':
          this.state = this.requestEditTodo(this.state, payload);
          break;
        case 'todos/editSave':
          this.state = this.saveEditedTodo(this.state, payload);
          break;
        case 'todos/toggleAll':
          this.state = this.toggleAllTodos(this.state);
          break;
        case 'todos/clearCompleted':
          this.state = this.clearCompleted(this.state);
          break;
        case 'form/setInput':
          this.state = this.setFormInput(this.state, payload);
          break;
        case 'filters/switch':
          this.state = this.switchActiveFilter(this.state, payload);
          break;
        default:
          return 'Unknown action type';
      }
    });

    this.dispatchUpdate('update');
  };

  switchActiveFilter = (state, payload) => {
    return {
      ...state,
      activeTodosFilter: payload.filter,
    };
  };

  addTodo = (state, payload) => ({
    ...state,
    nextTodoId: state.nextTodoId + 1,
    todos: {
      ...state.todos,
      [state.nextTodoId]: {
        id: state.nextTodoId,
        ...payload,
      },
    },
  });

  checkTodo = (state, payload) => ({
    ...state,
    form: {
      input: {
        value: '',
      },
      isUpdating: false,
      todoIdToUpdate: null,
    },
    todos: {
      ...state.todos,
      [payload.id]: {
        ...state.todos[payload.id],
        completed: !state.todos[payload.id].completed,
      },
    },
  });

  clearTodo = (state, payload) => {
    // eslint-disable-next-line no-unused-vars
    const { [payload.id]: removed, ...rest } = state.todos;
    return {
      ...state,
      todos: {
        ...rest,
      },
    };
  };

  requestEditTodo = (state, payload) => {
    if (state.todos[payload.id].completed) return this.state;

    return {
      ...state,
      form: {
        input: {
          value: state.todos[payload.id].title,
        },
        isUpdating: true,
        todoIdToUpdate: payload.id,
      },
    };
  };

  saveEditedTodo = (state, payload) => ({
    ...state,
    form: {
      isUpdating: false,
      todoIdToUpdate: null,
      input: {
        value: '',
      },
    },
    todos: {
      ...state.todos,
      [state.form.todoIdToUpdate]: {
        ...state.todos[state.form.todoIdToUpdate],
        title: payload.title,
      },
    },
  });

  toggleAllTodos = (state) => {
    const todosLeft = Object.values(state.todos).some((todo) => !todo.completed);

    const updatedTodos = Object.entries(state.todos)
      .map(([key, value]) => {
        return {
          [key]: {
            ...value,
            completed: todosLeft ? true : false,
          },
        };
      })
      .reduce((acc, curr) => {
        return {
          ...acc,
          ...curr,
        };
      }, {});

    return {
      ...state,
      todos: {
        ...updatedTodos,
      },
    };
  };

  clearCompleted = (state) => {
    const filteredTodos = Object.entries(state.todos)
      .filter((entry) => entry[1].completed === false)
      .reduce((acc, [key, value]) => {
        return {
          ...acc,
          [key]: value,
        };
      }, {});

    return {
      ...state,
      todos: {
        ...filteredTodos,
      },
    };
  };

  setFormInput = (state, payload) => {
    return {
      ...state,
      form: {
        ...this.state.form,
        input: {
          ...payload,
        },
      },
    };
  };
}
