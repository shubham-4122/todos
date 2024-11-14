import { $$Components, Build } from 'lib';
import ListItem from './ListItem';

const TodoList = ({ initialState, props }) =>
  Build({
    initialState,
    props: {
      ...props,
      elementType: 'ul',
      classes: 'todo-list',
      attributes: {
        'data-root': props.name,
      },
    },
    components: ({ root }) => {
      return [
        $$Components({
          itemsList: (state) => Object.values(state.todos),
          component: ListItem,
          state: initialState,
          props: () => ({
            targetSelector: root,
          }),
          filter: (state) => ({
            check: state.activeTodosFilter,
            cases: [
              {
                value: 'all',
                callback: (todo) => todo,
              },
              {
                value: 'active',
                callback: (todo) => !todo.completed,
              },
              {
                value: 'completed',
                callback: (todo) => todo.completed,
              },
            ],
          }),
        }),
      ];
    },
  });

export default TodoList;
