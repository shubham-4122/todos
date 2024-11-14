import { todoActionToggleAll } from 'actions';
import { Build } from 'lib';
import { withStoreHOF } from 'store';
import TodoList from './TodoList';

const Main =
  (store) =>
  ({ initialState, props }) =>
    Build({
      initialState,
      props: {
        ...props,
        elementType: 'div',
        classes: 'main',
        attributes: {
          'data-root': props.name,
        },
        childrenElements: [
          {
            elementType: 'input',
            classes: 'toggle-all',
            attributes: {
              id: 'toggle-all',
              type: 'checkbox',
            },
          },
          {
            elementType: 'label',
            textContent: 'Mark all as complete',
            attributes: {
              'data-el': 'toggle-all',
              for: 'toggle-all',
            },
          },
        ],
      },
      components: ({ root }) => [
        TodoList({
          initialState,
          props: {
            targetSelector: root,
            name: 'todo-list',
          },
        }),
      ],
      listeners: () => [
        {
          target: '[data-el="toggle-all"]',
          type: 'click',
          callback: () => store.dispatch([() => todoActionToggleAll()]),
        },
      ],
    });

export default withStoreHOF(Main);
